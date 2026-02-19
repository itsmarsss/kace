import { useCallback } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import { useAnalysis } from '../../hooks/useAnalysis'
import { useLiveDiagram } from '../../hooks/useLiveDiagram'
import { useSTT } from '../../hooks/useSTT'
import ConfidenceSlider from '../input/ConfidenceSlider'
import TreatmentReference from './TreatmentReference'
import HighlightedTextarea from './HighlightedTextarea'

export default function ReasoningInput() {
  const { reasoningText, selectedDrugs, isSubmitted, isAnalyzing, mode, showFeedbackModal, dispatch } =
    useMode()
  const { submitReasoning } = useAnalysis()
  const { triggerNow, isGenerating, countdown } = useLiveDiagram()

  // Handle final speech transcript
  const handleFinalTranscript = useCallback(
    (text: string) => {
      if (!isSubmitted) {
        dispatch({
          type: 'SET_REASONING_TEXT',
          payload: reasoningText + text,
        })
      }
    },
    [isSubmitted, dispatch, reasoningText]
  )

  const { isListening, interimTranscript, toggleListening } = useSTT(handleFinalTranscript)

  // Auto-resize textarea - disabled since we want it to fill container
  // useEffect(() => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = 'auto'
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
  //   }
  // }, [reasoningText])

  const handleSubmit = async () => {
    if (isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()) {
      return
    }

    // In live mode, call API to analyze reasoning
    if (mode === 'live') {
      await submitReasoning()
    } else {
      // In demo mode, just dispatch SUBMIT (diagram built by demo script)
      dispatch({ type: 'SUBMIT' })
    }
  }

  const handleViewAnalysis = () => {
    if (mode === 'demo') {
      // Simulate brief analyzing state in demo
      dispatch({ type: 'SET_ANALYZING', payload: true })
      setTimeout(() => {
        dispatch({ type: 'SET_ANALYZING', payload: false })
        dispatch({ type: 'SHOW_FEEDBACK_MODAL' })
      }, 1200)
    } else {
      // In live mode, just show the feedback
      dispatch({ type: 'SHOW_FEEDBACK_MODAL' })
    }
  }

  // Show analyzing state
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-10">
        {/* Spinner */}
        <div className="h-7 w-7 animate-spin rounded-full border-[2.5px] border-[var(--muted-bg)] border-t-[var(--teal)]" />

        {/* Primary text */}
        <div className="font-['DM_Sans',sans-serif] text-[13px] font-medium text-[var(--text-secondary)]">
          Analyzing your reasoning...
        </div>

        {/* Secondary text */}
        <div className="font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-tertiary)]">
          Building your reasoning diagram
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col border-t border-[var(--border)] bg-[var(--surface)]">
      {/* Treatment Options Reference with built-in selection */}
      <div className="flex-shrink-0 px-5 pb-0 pt-4">
        <TreatmentReference />
      </div>

      {/* Reasoning Textarea */}
      <div className="flex flex-1 flex-col px-5 pb-3">
        <div className="label-caps mb-2 flex flex-shrink-0 items-center justify-between">
          <span>YOUR REASONING</span>
          {!isSubmitted && (
            <button
              onClick={toggleListening}
              disabled={isSubmitted}
              className={`rounded-[var(--r-sm)] p-1.5 transition-all duration-150 ${
                isListening
                  ? 'bg-[var(--crimson)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--crimson-dark)]'
                  : 'bg-[var(--muted-bg)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
              }`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}
        </div>
        <HighlightedTextarea
          value={reasoningText + (interimTranscript ? interimTranscript : '')}
          onChange={(value) =>
            dispatch({
              type: 'SET_REASONING_TEXT',
              payload: value,
            })
          }
          readOnly={isSubmitted}
          placeholder="Walk through your reasoning. Which findings do you consider most significant? What did you rule out and why? What drives your drug selection?"
          className={`rounded-[var(--r)] shadow-[var(--shadow-sm)] outline-none transition-all duration-150 ${
            isSubmitted
              ? 'cursor-default border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--text-secondary)]'
              : 'cursor-text border border-[var(--border-md)] bg-[var(--card)] text-[var(--text-primary)]'
          }`}
          onFocus={(e) => {
            if (!isSubmitted) {
              e.target.style.borderColor = 'var(--teal)'
              e.target.style.boxShadow = '0 0 0 3px var(--teal-glow), var(--shadow-sm)'
            }
          }}
          onBlur={(e) => {
            if (!isSubmitted) {
              e.target.style.borderColor = 'var(--border-md)'
              e.target.style.boxShadow = 'var(--shadow-sm)'
            }
          }}
        />
      </div>

      {/* Confidence Slider + Buttons */}
      <div className="flex flex-shrink-0 items-center justify-between gap-4 px-5 pb-5">
        <ConfidenceSlider disabled={isSubmitted} />

        <div className="flex gap-2">
          {/* Manual diagram update button (live mode only) */}
          {mode === 'live' && !isSubmitted && (
            <button
              onClick={triggerNow}
              disabled={isGenerating || reasoningText.length < 100}
              className={`rounded-[var(--r-sm)] border border-[var(--border-md)] bg-transparent px-4 py-[10px] font-['DM_Sans',sans-serif] text-[13px] font-semibold transition-all duration-150 ${
                isGenerating || reasoningText.length < 100
                  ? 'cursor-not-allowed text-[var(--text-tertiary)]'
                  : 'cursor-pointer text-[var(--teal)] hover:bg-[var(--teal-light)]'
              }`}
              title="Manually update diagram (or wait for auto-update)"
            >
              {isGenerating
                ? 'Updating...'
                : countdown > 0
                  ? `Update Diagram (${countdown}s)`
                  : 'Update Diagram'}
            </button>
          )}

          {/* Submit / View Analysis button */}
          {isSubmitted && !showFeedbackModal ? (
            <button
              onClick={handleViewAnalysis}
              className="min-w-[180px] cursor-pointer rounded-[var(--r-sm)] border-none bg-[var(--teal)] px-5 py-[10px] font-['DM_Sans',sans-serif] text-[13px] font-semibold text-white shadow-[var(--shadow-md)] transition-all duration-150 hover:-translate-y-px hover:bg-[var(--teal-dark)]"
            >
              View Analysis →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()}
              className={`min-w-[180px] rounded-[var(--r-sm)] border-none px-5 py-[10px] font-['DM_Sans',sans-serif] text-[13px] font-semibold transition-all duration-150 ${
                isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()
                  ? 'cursor-not-allowed bg-[var(--muted-bg)] text-[var(--text-tertiary)] shadow-none'
                  : 'cursor-pointer bg-[var(--teal)] text-white shadow-[var(--shadow-md)] hover:-translate-y-px hover:bg-[var(--teal-dark)]'
              }`}
            >
              Analyze Reasoning →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
