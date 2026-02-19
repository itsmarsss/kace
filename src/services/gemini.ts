import { GoogleGenerativeAI } from '@google/generative-ai'
import { DiagramBlock } from './types'

// Initialize Gemini client
const getClient = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Google AI API key not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.'
    )
  }

  return new GoogleGenerativeAI(apiKey)
}

const blockSchema = {
  type: 'object',
  properties: {
    blocks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Block ID like "b1", "b2"' },
          type: {
            type: 'string',
            enum: ['OBSERVATION', 'INTERPRETATION', 'CONSIDERATION', 'CONTRAINDICATION', 'DECISION'],
            description: 'Block type'
          },
          title: { type: 'string', description: 'Concise title (max 8 words)' },
          body: { type: 'string', description: 'Third-person summary (2-3 sentences)' },
          connects_to: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of block IDs this connects to (can be multiple for branching, or multiple blocks can point to same ID for merging)'
          },
          step: { type: 'integer', description: 'Sequential step number' },
          addedAt: { type: 'integer', description: 'Timestamp' },
          sourceStart: { type: 'integer', description: 'Character index where cited text starts in the NEW TEXT' },
          sourceEnd: { type: 'integer', description: 'Character index where cited text ends in the NEW TEXT' },
          sourceText: { type: 'string', description: 'The actual quoted text from reasoning that this block represents' }
        },
        required: ['id', 'type', 'title', 'body', 'connects_to', 'step', 'addedAt', 'sourceStart', 'sourceEnd', 'sourceText']
      }
    }
  },
  required: ['blocks']
}

/**
 * Update diagram incrementally using Gemini 3 Flash
 * Fast, cheap, and has native structured outputs
 */
export async function updateDiagramWithGemini(params: {
  previousText: string
  newText: string
  textDiff: string
  currentBlocks: DiagramBlock[]
  selectedDrugs: string[]
  caseContext: string
}): Promise<{ blocks: DiagramBlock[] }> {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash-lite', // Fastest for high-frequency extraction
    generationConfig: {
      temperature: 1.0,
      responseMimeType: 'application/json',
      responseSchema: blockSchema
    }
  })

  const prompt = `You are extracting the student's reasoning into structured blocks. Write concise third-person summaries.

PREVIOUS TEXT:
${params.previousText}

NEW TEXT ADDED:
${params.textDiff}

FULL NEW TEXT (for citation):
${params.newText}

CURRENT BLOCKS:
${JSON.stringify(params.currentBlocks, null, 2)}

TREATMENTS SELECTED: ${params.selectedDrugs.join(', ') || 'None yet'}

CRITICAL RULES:
- Summarize what student SAID, don't add clinical knowledge
- Use third-person: "Identifies", "Notes", "Recognizes", "Considers", "Rules out", "Decides"
- Be concise but preserve their key insight
- Do NOT correct mistakes (evaluation comes later)

BLOCK TYPES:
- OBSERVATION: Student identifies findings, vitals, labs, history
- INTERPRETATION: Student analyzes, connects ideas, draws conclusions
- CONSIDERATION: Student considers treatment options
- CONTRAINDICATION: Student rules something out
- DECISION: Student makes final choice

CONNECTIONS (IMPORTANT):
- connects_to can have MULTIPLE IDs (one block splitting to many)
- MULTIPLE blocks can point to SAME ID (many merging into one)
- NOT everything is sequential! Show actual reasoning flow:
  * If student considers 2 options from same observation: b1 → [b2, b3]
  * If 2 findings lead to same conclusion: [b1, b2] both → b3
  * If reasoning branches then reconverges: b1 → [b2, b3] → b4

Example of NON-SEQUENTIAL flow:
- b1 (observation) connects_to: ["b2", "b3"] (branches to 2 interpretations)
- b2 (interpretation A) connects_to: ["b4"]
- b3 (interpretation B) connects_to: ["b4"]
- b4 (synthesis) connects_to: ["b5"] (decision)

CITATION (REQUIRED):
- For each block, you MUST identify where in the NEW TEXT it came from
- sourceStart: character index where the relevant text starts (0-based)
- sourceEnd: character index where the relevant text ends
- sourceText: copy the exact text from NEW TEXT that this block represents
- If a block spans multiple sentences, cite the full range
- Be precise - this will be used to highlight text when user hovers over the block

TASK: Extract new reasoning from added text and create new blocks. Keep existing blocks unless student explicitly revises them.

Return ALL blocks (existing + new) with proper connections showing the true reasoning flow, not just sequential chains.
Each block MUST include accurate citations (sourceStart, sourceEnd, sourceText) pointing to the NEW TEXT.

Current timestamp: ${Date.now()}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const parsed = JSON.parse(text)
    return parsed
  } catch (error) {
    console.error('[Gemini] Generation failed:', error)
    throw new Error('Failed to generate diagram with Gemini')
  }
}
