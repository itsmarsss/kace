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
- OBSERVATION: Clinical findings, vital signs, lab values, patient history
- INTERPRETATION: Analysis and synthesis of observations
- CONSIDERATION: Treatment options being considered
- CONTRAINDICATION: Reasons against certain treatments
- DECISION: Final treatment decision or key conclusions

REQUIRED FIELDS:
- id: string ("b1", "b2", etc.)
- type: one of the exact types above (e.g., "OBSERVATION", not "assessment")
- title: concise title (max 8 words)
- body: reasoning explanation (2-3 sentences)
- connects_to: array of block IDs that this block leads to

CRITICAL: Return ONLY valid JSON. Do not wrap in markdown. Do not include explanations.

Example format:
{
  "blocks": [
    {
      "id": "b1",
      "type": "OBSERVATION",
      "title": "Elevated HbA1c presentation",
      "body": "Patient presents with HbA1c of 9.1% indicating poor glycemic control. Classic symptoms of polyuria and polydipsia confirm active hyperglycemia.",
      "connects_to": ["b2"]
    },
    {
      "id": "b2",
      "type": "INTERPRETATION",
      "title": "Treatment urgency assessment",
      "body": "HbA1c >9% requires immediate pharmacotherapy. Patient cannot achieve control with lifestyle alone at this level.",
      "connects_to": ["b3"]
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
}): Promise<AnalyzeReasoningResponse> {
  const client = getClient()

  const systemPrompt = `You are updating a clinical reasoning diagram in real-time.

PREVIOUS REASONING:
${params.previousText}

NEW TEXT ADDED:
${params.textDiff}

CURRENT BLOCKS:
${JSON.stringify(params.currentBlocks, null, 2)}

TASK: Update the diagram to reflect new reasoning. You may:
1. Add new blocks for new reasoning steps
2. Modify existing blocks if refined
3. Update connections to show logical flow

BLOCK TYPES (use exactly these):
- OBSERVATION, INTERPRETATION, CONSIDERATION, CONTRAINDICATION, DECISION

REQUIRED FIELDS:
- id: string (keep existing IDs, use "b1", "b2" for new ones)
- type: exact type from list above
- title: concise (max 8 words)
- body: reasoning (2-3 sentences)
- connects_to: array of block IDs

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
