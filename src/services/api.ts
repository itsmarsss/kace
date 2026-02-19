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

  const systemPrompt = `You are an expert clinical reasoning analyzer. Your task is to extract structured reasoning blocks from a clinician's written reasoning.

Extract the key steps in their clinical thinking process and categorize them into these types:
- OBSERVATION: Clinical findings, vital signs, lab values, patient history
- INTERPRETATION: Analysis and synthesis of observations
- CONSIDERATION: Treatment options being considered
- CONTRAINDICATION: Reasons against certain treatments
- DECISION: Final treatment decision or key conclusions

For each block, provide:
- A concise title (max 8 words)
- A body with the reasoning (2-3 sentences)
- Connections to other blocks (logical flow)

Return ONLY a JSON object with this structure:
{
  "blocks": [
    {
      "id": "b1",
      "type": "OBSERVATION",
      "title": "...",
      "body": "...",
      "connects_to": ["b2", "b3"]
    }
  ]
}

Generate IDs as "b1", "b2", etc. Connect blocks to show logical reasoning flow (observations lead to interpretations, interpretations lead to considerations, etc.).`

  const userPrompt = `Clinical Case Context:
${request.caseContext}

Clinician's Reasoning:
${request.reasoningText}

Selected Treatments: ${request.selectedDrugs.join(', ') || 'None selected'}
Confidence Level: ${request.confidence}/5

Extract the structured reasoning diagram from this clinical thinking.`

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620',
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

  // Parse the JSON response
  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
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

  const systemPrompt = `You are updating a reasoning diagram in real-time as a clinician types.

Previous reasoning: ${params.previousText}
New reasoning added: ${params.textDiff}
Current diagram blocks: ${JSON.stringify(params.currentBlocks, null, 2)}

Your task: Update the diagram to reflect the new reasoning. You may:
1. Add new blocks if new reasoning steps appear
2. Modify existing blocks if reasoning is refined
3. Update connections to show updated logical flow

Keep existing block IDs where possible. Use "b1", "b2", etc. for new blocks.

Return the complete updated blocks array in JSON format:
{
  "blocks": [...]
}`

  const userPrompt = `Clinical Case: ${params.caseContext}

Full reasoning text:
${params.newText}

Update the diagram based on the new reasoning.`

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620',
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
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
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
