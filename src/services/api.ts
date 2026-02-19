import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const getClient = () => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.'
    )
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  })
}

export interface AnalyzeReasoningRequest {
  reasoningText: string
  selectedDrugs: string[]
  confidence: number
  caseContext: string
}

export interface DiagramBlock {
  id: string
  type: 'OBSERVATION' | 'INTERPRETATION' | 'CONSIDERATION' | 'CONTRAINDICATION' | 'DECISION'
  title: string
  body: string
  connects_to: string[]
  step?: number // Which update cycle this block was added in
  addedAt?: number // Timestamp when block was created
}

export interface AnalyzeReasoningResponse {
  blocks: DiagramBlock[]
}

/**
 * Analyze user's clinical reasoning and extract structured diagram blocks
 */
export async function analyzeReasoning(
  request: AnalyzeReasoningRequest
): Promise<AnalyzeReasoningResponse> {
  const client = getClient()

  const systemPrompt = `You are an expert clinical reasoning analyzer. Extract structured reasoning blocks from a clinician's written reasoning.

BLOCK TYPES (use exactly these):
- OBSERVATION: Clinical findings, vitals, labs, history
- INTERPRETATION: Analysis of observations, risk assessment
- CONSIDERATION: Treatment options being considered
- CONTRAINDICATION: Reasons against treatments
- DECISION: Final treatment choice or conclusion (when user explicitly states "Decision:", chooses treatment, or makes final determination)

DECISION DETECTION: Look for explicit decision markers like "Decision:", "I choose", "Going with", "Final choice", or when treatment is definitively selected. Create DECISION blocks for these.

REQUIRED FIELDS:
- id: string ("b1", "b2", etc. in order)
- type: exact type from list above
- title: concise (max 8 words)
- body: reasoning (2-3 sentences)
- connects_to: array of block IDs showing logical flow
- step: sequential number (1, 2, 3, etc. based on order in reasoning)
- addedAt: timestamp ${Date.now()}

CRITICAL: Return ONLY valid JSON. No markdown. No explanations.

Example:
{
  "blocks": [
    {
      "id": "b1",
      "type": "OBSERVATION",
      "title": "Elevated HbA1c presentation",
      "body": "Patient presents with HbA1c of 9.1% indicating poor glycemic control. Classic symptoms confirm active hyperglycemia.",
      "connects_to": ["b2"],
      "step": 1,
      "addedAt": ${Date.now()}
    },
    {
      "id": "b2",
      "type": "DECISION",
      "title": "Empagliflozin selected",
      "body": "Decision to use empagliflozin based on HFrEF mortality benefit and diabetes control. Evidence-based choice for dual indication.",
      "connects_to": [],
      "step": 2,
      "addedAt": ${Date.now()}
    }
  ]
}`

  const userPrompt = `Clinical Case Context:
${request.caseContext}

Clinician's Reasoning:
${request.reasoningText}

Selected Treatments: ${request.selectedDrugs.join(', ') || 'None selected'}
Confidence Level: ${request.confidence}/5

Extract the structured reasoning diagram from this clinical thinking.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature: 0.3,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  // Extract JSON from response
  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from API')
  }

  // Parse the JSON response (handle markdown code blocks)
  try {
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    // Try to find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return parsed
  } catch (error) {
    console.error('Failed to parse API response:', content.text)
    throw new Error('Failed to parse reasoning analysis')
  }
}

/**
 * Update diagram incrementally based on new reasoning text
 * Used for live diagram generation as user types
 */
export async function updateDiagramIncremental(params: {
  previousText: string
  newText: string
  textDiff: string
  currentBlocks: DiagramBlock[]
  caseContext: string
  selectedDrugs: string[]
}): Promise<AnalyzeReasoningResponse> {
  const client = getClient()

  const systemPrompt = `You are updating a clinical reasoning diagram in real-time.

PREVIOUS REASONING:
${params.previousText}

NEW TEXT ADDED:
${params.textDiff}

CURRENT BLOCKS:
${JSON.stringify(params.currentBlocks, null, 2)}

SELECTED TREATMENTS: ${params.selectedDrugs.join(', ') || 'None selected yet'}

TASK: Update the diagram to reflect new reasoning. You may:
1. Add new blocks for new reasoning steps
2. Modify existing blocks if refined
3. Update connections to show logical flow

BLOCK TYPES (use exactly these):
- OBSERVATION: Clinical findings, vitals, labs, history
- INTERPRETATION: Analysis of observations, risk assessment
- CONSIDERATION: Treatment options being considered
- CONTRAINDICATION: Reasons against treatments
- DECISION: Final treatment choice or key conclusion (IMPORTANT: when user explicitly states "Decision:" or chooses a treatment, use DECISION type)

DECISION DETECTION: If the new text contains phrases like "Decision:", "I choose", "Going with", "Final choice", or explicit treatment selection, create a DECISION block.

REQUIRED FIELDS:
- id: string (keep existing IDs, use sequential "b1", "b2", etc. for new)
- type: exact type from list above
- title: concise (max 8 words)
- body: reasoning (2-3 sentences)
- connects_to: array of block IDs showing logical flow
- step: increment from highest existing step (or use 1 for first blocks)
- addedAt: current timestamp ${Date.now()}

CRITICAL: Return ONLY valid JSON. No markdown. No explanations.

Format:
{
  "blocks": [...]
}`

  const userPrompt = `Clinical Case: ${params.caseContext}

Full reasoning text:
${params.newText}

Update the diagram based on the new reasoning.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature: 0.3,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from API')
  }

  try {
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    // Try to find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return parsed
  } catch (error) {
    console.error('Failed to parse API response:', content.text)
    throw new Error('Failed to parse diagram update')
  }
}
