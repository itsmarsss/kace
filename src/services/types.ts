export interface DiagramBlock {
  id: string
  type: 'OBSERVATION' | 'INTERPRETATION' | 'CONSIDERATION' | 'CONTRAINDICATION' | 'DECISION'
  title: string
  body: string
  connects_to: string[]
  step?: number
  addedAt?: number
  sourceStart?: number // Character index where cited text starts in reasoning
  sourceEnd?: number // Character index where cited text ends in reasoning
  sourceText?: string // The actual quoted text from reasoning
  feedback?: BlockFeedback // Analysis feedback for this block
}

export interface BlockFeedback {
  isCorrect: boolean // Is the reasoning in this block correct?
  issues?: string[] // What's wrong/inaccurate about this block
  suggestions?: string[] // What should be considered/improved
  timing?: 'early' | 'late' | 'appropriate' // Should this have been considered earlier/later?
  necessity?: 'necessary' | 'unnecessary' | 'missing' // Is this consideration necessary?
}

export interface AnalyzeReasoningRequest {
  reasoningText: string
  selectedDrugs: string[]
  confidence: number
  caseContext: string
}

export interface AnalyzeReasoningResponse {
  studentBlocks: DiagramBlock[] // Student's blocks with feedback
  expertBlocks: DiagramBlock[] // Ideal reasoning blocks
  overallFeedback: string // General feedback summary
  score: number // Overall score 0-100
}
