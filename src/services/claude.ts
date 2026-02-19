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

  const systemPrompt = `You are an expert clinical educator analyzing a medical student's reasoning. You will:
1. Extract and evaluate their reasoning into structured blocks
2. Provide detailed feedback on each block
3. Generate the ideal reasoning blocks showing correct clinical thinking as a connected graph

BLOCK TYPES:
- OBSERVATION: Identifies findings, vitals, labs, history
- INTERPRETATION: Analyzes, connects ideas, draws conclusions
- CONSIDERATION: Considers treatment options
- CONTRAINDICATION: Rules something out
- DECISION: Makes final choice

EVALUATION CRITERIA:
For each student block, assess:
- **Correctness**: Is the clinical reasoning accurate?
- **Timing**: Should this have been considered earlier/later in the reasoning?
- **Necessity**: Is this consideration necessary, unnecessary, or is something missing?
- **Issues**: What specific problems exist (incorrect facts, flawed logic, missing info)?
- **Suggestions**: What would improve this block?

REQUIRED OUTPUT STRUCTURE:
{
  "studentBlocks": [
    {
      "id": "s1",
      "type": "OBSERVATION",
      "title": "...",
      "body": "...",
      "connects_to": ["s2"],
      "step": 1,
      "addedAt": ${Date.now()},
      "sourceText": "exact quote from student reasoning",
      "feedback": {
        "isCorrect": true/false,
        "issues": ["specific problem 1", "specific problem 2"],
        "suggestions": ["how to improve"],
        "timing": "early" | "late" | "appropriate",
        "necessity": "necessary" | "unnecessary" | "missing"
      }
    }
  ],
  "expertBlocks": [
    {
      "id": "e1",
      "type": "OBSERVATION",
      "title": "Initial Patient Assessment",
      "body": "Comprehensive description of key findings...",
      "connects_to": ["e2", "e3"],
      "step": 1,
      "addedAt": ${Date.now()}
    },
    {
      "id": "e2",
      "type": "INTERPRETATION",
      "title": "Analysis of Findings",
      "body": "Clinical interpretation...",
      "connects_to": ["e4"],
      "step": 2,
      "addedAt": ${Date.now()}
    }
  ],
  "overallFeedback": "2-3 paragraph summary of student's reasoning quality",
  "score": 85
}

FEEDBACK RULES:
- Be constructive and educational
- Point out both strengths and weaknesses
- Suggest specific improvements
- Consider the clinical context
- Note when reasoning order matters

Return ONLY this JSON structure.`

  const userPrompt = `Clinical Case Context:
${request.caseContext}

Student's Complete Reasoning:
${request.reasoningText}

Selected Treatments: ${request.selectedDrugs.join(', ') || 'None selected'}
Confidence Level: ${request.confidence}/5

EXISTING BLOCKS (created by initial analysis):
${JSON.stringify(request.existingBlocks, null, 2)}

TASK:
1. For each existing block above, add a "feedback" property with your evaluation
2. IMPORTANT: Preserve the original block IDs, titles, bodies, and all other properties
3. Only ADD the feedback object - do not change anything else
4. Create separate ideal reasoning blocks in expertBlocks array
5. Provide overall feedback and a score (0-100)

EXPERT BLOCKS REQUIREMENTS:
- Create approximately ${request.existingBlocks.length} expert blocks (similar granularity to student)
- Each expert block MUST have a "connects_to" array showing logical flow to next blocks
- Use IDs like "e1", "e2", "e3", etc.
- Build a coherent reasoning graph (not just a linear chain)
- Show how observations lead to interpretations, interpretations lead to considerations, etc.
- Include step numbers that show the logical order
- The expert blocks should demonstrate the IDEAL clinical reasoning process for this case

Example expert block connections:
- e1 (initial observation) -> connects_to: ["e2", "e3"] (splits to multiple interpretations)
- e2 (interpretation) -> connects_to: ["e4"] (leads to consideration)
- e3 (interpretation) -> connects_to: ["e4", "e5"] (leads to multiple considerations)
- e4 (consideration) -> connects_to: ["e6"] (leads to decision)

Return the studentBlocks array with the SAME blocks but with feedback added.
Focus on educational feedback that helps the student improve their clinical reasoning skills.`

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

    // Ensure IDs are strings for both student and expert blocks
    if (parsed.studentBlocks) {
      parsed.studentBlocks = parsed.studentBlocks.map((block: any) => ({
        ...block,
        id: String(block.id),
      }))
    }
    if (parsed.expertBlocks) {
      parsed.expertBlocks = parsed.expertBlocks.map((block: any) => ({
        ...block,
        id: String(block.id),
      }))
    }

    // Handle legacy format (just blocks array)
    if (parsed.blocks && !parsed.studentBlocks) {
      parsed.studentBlocks = parsed.blocks.map((block: any) => ({
        ...block,
        id: String(block.id),
      }))
      parsed.expertBlocks = []
      parsed.overallFeedback = ''
      parsed.score = 0
    }

    return parsed
  } catch (error) {
    console.error('Failed to parse Claude response:', content.text)
    throw new Error('Failed to parse reasoning analysis')
  }
}
