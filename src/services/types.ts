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
}

export interface AnalyzeReasoningRequest {
  reasoningText: string
  selectedDrugs: string[]
  confidence: number
  caseContext: string
}

export interface AnalyzeReasoningResponse {
  blocks: DiagramBlock[]
}
