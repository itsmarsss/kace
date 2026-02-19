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

  const systemPrompt = `You are summarizing the student's clinical reasoning into concise blocks. Write in third-person narrative style using verbs like "Identifies", "Notes", "Recognizes", "Considers", "Rules out", "Decides".

CRITICAL RULES:
- Summarize what the student ACTUALLY said/thought, don't add your own clinical knowledge
- Use third-person narrative: "Identifies X", "Notes that Y", "Recognizes Z"
- Be concise but capture their key insight or reasoning
- Do NOT add information they didn't mention
- Do NOT correct their mistakes (we evaluate later)
- Do NOT add formal clinical language they didn't use

BLOCK TYPES:
- OBSERVATION: Student identifies findings, vitals, labs, history
- INTERPRETATION: Student analyzes, connects ideas, draws conclusions
- CONSIDERATION: Student considers treatment options
- CONTRAINDICATION: Student rules something out or notes concerns
- DECISION: Student makes final choice or determination

REQUIRED FIELDS:
- id: STRING like "b1", "b2", "b3" (NOT numbers)
- type: from list above
- title: Concise summary (max 8 words)
- body: Third-person summary of student's reasoning (2-3 sentences, concise)
- connects_to: array of block ID strings
- step: sequential number
- addedAt: ${Date.now()}

OUTPUT FORMAT: Return object with "blocks" array:
{
  "blocks": [
    {
      "id": "b1",
      "type": "OBSERVATION",
      ...
    }
  ]
}

Return ONLY this JSON structure. No markdown code blocks.

EXAMPLES:

Student wrote: "Wait, let me check his history... Oh. NSTEMI 8 months ago. That's significant. He's got a stent in his LAD, on dual antiplatelet therapy."

GOOD Block:
{
  "title": "Recent NSTEMI with LAD stent",
  "body": "Identifies recent NSTEMI 8 months ago with LAD stent placement. Notes patient is on dual antiplatelet therapy.",
  "type": "OBSERVATION"
}

BAD Block (too verbatim):
{
  "title": "Wait, let me check his history",
  "body": "Wait, let me check his history... Oh. NSTEMI 8 months ago. That's significant.",
  "type": "OBSERVATION"
}

BAD Block (added knowledge):
{
  "title": "High-risk coronary artery disease",
  "body": "Recent NSTEMI indicates acute coronary syndrome requiring antiplatelet therapy per ACC/AHA guidelines.",
  "type": "OBSERVATION"
}

---

Student wrote: "Okay this changes everything. He doesn't just need glucose control - he needs a medication that will help his heart failure. The cardiac status is what's going to kill him if we don't address it."

GOOD Block:
{
  "title": "Cardiac status is priority over glucose",
  "body": "Recognizes that patient doesn't just need glucose control, but needs medication that addresses heart failure. Notes cardiac status is the critical factor that must be addressed.",
  "type": "INTERPRETATION"
}

BAD Block (word-for-word):
{
  "title": "This changes everything",
  "body": "Okay this changes everything. He doesn't just need glucose control. The cardiac status is what's going to kill him.",
  "type": "INTERPRETATION"
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

    // Try to parse JSON (could be object or array)
    let parsed: any

    // Check if it's an array
    if (jsonText.trim().startsWith('[')) {
      const arrayMatch = jsonText.match(/\[[\s\S]*\]/)
      if (!arrayMatch) {
        throw new Error('No JSON array found in response')
      }
      parsed = { blocks: JSON.parse(arrayMatch[0]) }
    } else {
      // It's an object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsed = JSON.parse(jsonMatch[0])
    }

    // Ensure IDs are strings
    if (parsed.blocks) {
      parsed.blocks = parsed.blocks.map((block: any) => ({
        ...block,
        id: String(block.id), // Convert numeric IDs to strings
      }))
    }

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

  const systemPrompt = `You are summarizing the student's NEW reasoning and updating their diagram. Write concise third-person summaries using "Identifies", "Notes", "Recognizes", "Considers", "Rules out", "Decides".

PREVIOUS TEXT:
${params.previousText}

NEW TEXT ADDED:
${params.textDiff}

CURRENT BLOCKS:
${JSON.stringify(params.currentBlocks, null, 2)}

TREATMENTS SELECTED: ${params.selectedDrugs.join(', ') || 'None yet'}

YOUR JOB: Identify new reasoning in the added text and create new blocks for it. Keep existing blocks unchanged unless student explicitly revises that thought.

CRITICAL RULES:
- Write in third-person: "Identifies", "Notes", "Recognizes"
- Summarize what student SAID, don't add clinical knowledge
- Be concise but preserve their key insight
- Do NOT correct mistakes (evaluation comes later)
- Do NOT add formal medical language they didn't use

BLOCK TYPES:
- OBSERVATION: Student identifies findings, vitals, labs, history
- INTERPRETATION: Student analyzes, connects ideas, draws conclusions
- CONSIDERATION: Student considers treatment options
- CONTRAINDICATION: Student rules something out
- DECISION: Student makes final choice

WHEN TO ADD NEW BLOCKS:
- New finding or observation mentioned
- New conclusion or analysis drawn
- New treatment option considered
- Something ruled out
- Decision made

KEEP EXISTING BLOCKS unless student explicitly revises that specific thought.

REQUIRED FIELDS:
- id: STRING like "b1", "b2" (keep existing IDs, use next sequential for new)
- type: from list above
- title: concise summary (max 8 words)
- body: third-person summary (2-3 sentences, concise)
- connects_to: array of block ID strings
- step: highest step + 1 for new blocks
- addedAt: ${Date.now()}

OUTPUT FORMAT: Return object with "blocks" array containing ALL blocks (existing + new):
{
  "blocks": [
    { existing blocks unchanged },
    { new blocks with incremented IDs }
  ]
}

Return ONLY this JSON structure. No markdown code blocks.

EXAMPLE:

New text: "So metformin would control his glucose, sure, but it doesn't have proven mortality benefit in HFrEF. I need to think about SGLT2 inhibitors here."

GOOD Block:
{
  "title": "Metformin lacks HFrEF mortality benefit",
  "body": "Recognizes metformin provides glucose control but doesn't have proven mortality benefit in HFrEF. Considers SGLT2 inhibitors as alternative.",
  "type": "INTERPRETATION"
}

BAD (word-for-word):
{
  "body": "So metformin would control his glucose, sure, but it doesn't have proven mortality benefit in HFrEF.",
}

BAD (added knowledge):
{
  "body": "Metformin is not indicated for heart failure per ESC guidelines. SGLT2 inhibitors demonstrate mortality reduction in EMPEROR-Reduced trial.",
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

    // Try to parse JSON (could be object or array)
    let parsed: any

    // Check if it's an array
    if (jsonText.trim().startsWith('[')) {
      const arrayMatch = jsonText.match(/\[[\s\S]*\]/)
      if (!arrayMatch) {
        throw new Error('No JSON array found in response')
      }
      parsed = { blocks: JSON.parse(arrayMatch[0]) }
    } else {
      // It's an object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsed = JSON.parse(jsonMatch[0])
    }

    // Ensure IDs are strings
    if (parsed.blocks) {
      parsed.blocks = parsed.blocks.map((block: any) => ({
        ...block,
        id: String(block.id), // Convert numeric IDs to strings
      }))
    }

    return parsed
  } catch (error) {
    console.error('Failed to parse API response:', content.text)
    throw new Error('Failed to parse diagram update')
  }
}
