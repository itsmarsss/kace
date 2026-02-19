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

  const systemPrompt = `You are extracting the student's reasoning into structured blocks. Your job is to ORGANIZE what they said, NOT to improve, correct, or add clinical knowledge.

CRITICAL RULES:
- Use the student's OWN WORDS and phrasing as much as possible
- Do NOT add information the student didn't mention
- Do NOT correct mistakes or misconceptions
- Do NOT enhance their reasoning with additional clinical knowledge
- Just organize their thoughts into blocks

BLOCK TYPES (categorize what they said):
- OBSERVATION: When student notes findings, vitals, labs, history ("I see...", "Looking at...", "Patient has...")
- INTERPRETATION: When student analyzes or connects ideas ("This means...", "So...", "This changes...")
- CONSIDERATION: When student considers treatment options ("Thinking about...", "Could use...", "What about...")
- CONTRAINDICATION: When student rules something out ("Can't use...", "Worried about...", "Rule out...")
- DECISION: When student makes a choice ("Decision:", "Going with...", "I choose...", "Final answer...")

EXTRACTION APPROACH:
- Title: Short summary using student's key phrase (their words, not yours)
- Body: Extract 2-3 sentences directly from what they wrote, staying faithful to their language
- Don't paraphrase into more formal/correct clinical language
- If student says "pretty high" keep "pretty high", don't change to "significantly elevated"
- If student makes an error, capture the error - we'll evaluate later

REQUIRED FIELDS:
- id: "b1", "b2", etc.
- type: from list above
- title: student's key phrase (max 8 words)
- body: extracted from student's text (2-3 sentences, their words)
- connects_to: logical flow IDs
- step: sequential order
- addedAt: ${Date.now()}

Return ONLY valid JSON. No markdown.

Example of GOOD extraction (faithful to student):
Student wrote: "HbA1c at 9.1%. That's pretty high, definitely needs treatment."
Block: {
  "title": "HbA1c pretty high, needs treatment",
  "body": "HbA1c at 9.1%. That's pretty high, definitely needs treatment.",
  "type": "OBSERVATION"
}

Example of BAD extraction (adding interpretation):
Block: {
  "title": "Severely uncontrolled hyperglycemia", ← NOT what student said
  "body": "HbA1c 9.1% represents poor glycemic control requiring immediate pharmacologic intervention.", ← Too formal, added knowledge
  "type": "OBSERVATION"
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

  const systemPrompt = `You are extracting the student's NEW reasoning and updating their diagram. Use their OWN WORDS - do not improve or correct their thinking.

PREVIOUS TEXT:
${params.previousText}

NEW TEXT ADDED:
${params.textDiff}

CURRENT BLOCKS:
${JSON.stringify(params.currentBlocks, null, 2)}

TREATMENTS SELECTED: ${params.selectedDrugs.join(', ') || 'None yet'}

YOUR JOB: Extract new reasoning from the added text and add it as new blocks. Keep all existing blocks unchanged unless the student explicitly revised that specific thought.

CRITICAL RULES:
- Use student's EXACT WORDS and phrasing
- Do NOT add clinical knowledge they didn't mention
- Do NOT correct their mistakes
- Do NOT enhance or formalize their language
- Just extract and organize what they actually wrote

BLOCK TYPES:
- OBSERVATION: Student notes findings ("I see...", "Looking at...")
- INTERPRETATION: Student analyzes ("This means...", "So...")
- CONSIDERATION: Student considers options ("Thinking about...", "Could use...")
- CONTRAINDICATION: Student rules out ("Can't use...", "Rule out...")
- DECISION: Student makes choice ("Decision:", "Going with...", "I choose...")

WHEN TO ADD NEW BLOCKS:
- Student introduces a new finding or observation
- Student draws a new conclusion
- Student considers a new treatment option
- Student rules something out
- Student makes a decision

WHEN TO KEEP EXISTING BLOCKS:
- Unless student explicitly corrects or revises a previous thought, keep all existing blocks as-is

REQUIRED FIELDS:
- id: keep existing, use next available for new ("b1", "b2"...)
- type: from list above
- title: student's key phrase (max 8 words, their language)
- body: directly from student's text (2-3 sentences, their exact words)
- connects_to: logical flow
- step: highest existing step + 1 for all new blocks
- addedAt: ${Date.now()}

Return ONLY valid JSON. No markdown.

GOOD extraction: "Wait, let me check his history... Oh. NSTEMI 8 months ago."
→ title: "Wait - NSTEMI 8 months ago", body: Uses student's exact surprised reaction

BAD extraction: "Recent myocardial infarction requiring consideration"
→ Too formal, loses student's discovery moment and tone`

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
