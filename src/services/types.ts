export interface DiagramBlock {
  id: string
  type: 'OBSERVATION' | 'INTERPRETATION' | 'CONSIDERATION' | 'CONTRAINDICATION' | 'DECISION'
  title: string
  body: string
  connects_to: string[]
  step?: number
  addedAt?: number
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
