import Anthropic from '@anthropic-ai/sdk'
import { DiagramBlock, AnalyzeReasoningRequest, AnalyzeReasoningResponse } from './types'

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
    dangerouslyAllowBrowser: true,
  })
}

/**
 * Analyze user's final reasoning submission with Claude
 * This is the high-quality analysis for expert comparison
 */
export async function analyzeReasoningWithClaude(
  request: AnalyzeReasoningRequest
): Promise<AnalyzeReasoningResponse> {
  const client = getClient()

  const systemPrompt = `You are analyzing a medical student's clinical reasoning. Extract their reasoning into structured blocks using third-person narrative.

BLOCK TYPES:
- OBSERVATION: Student identifies findings, vitals, labs, history
- INTERPRETATION: Student analyzes, connects ideas, draws conclusions
- CONSIDERATION: Student considers treatment options
- CONTRAINDICATION: Student rules something out
- DECISION: Student makes final choice

CRITICAL RULES:
- Summarize what student SAID, don't add clinical knowledge they didn't mention
- Use third-person: "Identifies", "Notes", "Recognizes", "Considers", "Decides"
- Be concise but preserve their key insight
- Do NOT correct mistakes (we evaluate separately)

CONNECTIONS (IMPORTANT):
- connects_to can have MULTIPLE IDs (branching: b1 → [b2, b3])
- MULTIPLE blocks can point to SAME ID (merging: [b1, b2] → b3)
- Show actual reasoning flow, not just sequential chains
- If student considers 2 options from one observation: branch
- If 2 findings lead to same conclusion: merge
- If reasoning reconverges after branching: show it

REQUIRED FIELDS:
- id: STRING like "b1", "b2", "b3"
- type: exact type from list above
- title: concise summary (max 8 words)
- body: third-person summary (2-3 sentences)
- connects_to: array of block ID strings (can be empty, one, or many)
- step: sequential number based on order in reasoning
- addedAt: ${Date.now()}

OUTPUT FORMAT:
{
  "blocks": [
    {
      "id": "b1",
      "type": "OBSERVATION",
      "title": "...",
      "body": "...",
      "connects_to": ["b2", "b3"],
      "step": 1,
      "addedAt": ${Date.now()}
    }
  ]
}

Return ONLY this JSON structure.`

  const userPrompt = `Clinical Case Context:
${request.caseContext}

Student's Complete Reasoning:
${request.reasoningText}

Selected Treatments: ${request.selectedDrugs.join(', ') || 'None selected'}
Confidence Level: ${request.confidence}/5

Extract the structured reasoning diagram showing the true flow of their clinical thinking (branches, merges, not just linear).`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    temperature: 1.0,
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

    // Remove markdown code blocks
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    // Parse JSON (handle both array and object)
    let parsed: any

    if (jsonText.trim().startsWith('[')) {
      const arrayMatch = jsonText.match(/\[[\s\S]*\]/)
      if (!arrayMatch) throw new Error('No JSON array found')
      parsed = { blocks: JSON.parse(arrayMatch[0]) }
    } else {
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      parsed = JSON.parse(jsonMatch[0])
    }

    // Ensure IDs are strings
    if (parsed.blocks) {
      parsed.blocks = parsed.blocks.map((block: any) => ({
        ...block,
        id: String(block.id),
      }))
    }

    return parsed
  } catch (error) {
    console.error('Failed to parse Claude response:', content.text)
    throw new Error('Failed to parse reasoning analysis')
  }
}
