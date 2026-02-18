import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DrugPills from '../input/DrugPills'
import ConfidenceSlider from '../input/ConfidenceSlider'

const DRUG_OPTIONS = [
  'Metformin',
  'Empagliflozin',
  'Semaglutide',
  'Glipizide',
  'Pioglitazone',
  'Insulin',
  'Other',
]

export default function ReasoningInput() {
  const {
    reasoningText,
    confidence,
    selectedDrugs,
    isSubmitted,
    isAnalyzing,
    sessionState,
    dispatch,
  } = useMode()

  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [reasoningText])

  const handleSubmit = async () => {
    if (isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()) {
      return
    }

    dispatch({ type: 'SUBMIT' })

    // In demo mode, diagram will be built by demo script
    // In live mode, would call API here via useAnalysis hook
    if (sessionState !== 'analyzing') {
      // Simulate API call delay in live mode
      // TODO: Replace with actual useAnalysis hook
      setTimeout(() => {
        dispatch({ type: 'ANALYSIS_FAILED' })
      }, 2000)
    }
  }

  // Show analyzing state
  if (isAnalyzing) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: '28px',
            height: '28px',
            border: '2.5px solid var(--muted-bg)',
            borderTopColor: 'var(--teal)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />

        {/* Primary text */}
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          Analyzing your reasoning...
        </div>

        {/* Secondary text */}
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
          }}
        >
          Building your reasoning diagram
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '16px 20px 20px',
      }}
    >
      {/* Drug Selection */}
      <div style={{ marginBottom: '16px' }}>
        <div className="label-caps" style={{ marginBottom: '8px' }}>
          DRUG SELECTION
        </div>
        <DrugPills drugs={DRUG_OPTIONS} disabled={isSubmitted} />
      </div>

      {/* Reasoning Textarea */}
      <div style={{ marginBottom: '14px' }}>
        <div className="label-caps" style={{ marginBottom: '8px' }}>
          YOUR REASONING
        </div>
        <textarea
          ref={textareaRef}
          value={reasoningText}
          onChange={(e) =>
            dispatch({ type: 'SET_REASONING_TEXT', payload: e.target.value })
          }
          readOnly={isSubmitted}
          placeholder="Walk through your reasoning. Which findings do you consider most significant? What did you rule out and why? What drives your drug selection?"
          style={{
            width: '100%',
            minHeight: '160px',
            background: isSubmitted ? 'var(--muted-bg)' : 'var(--card)',
            border: `1px solid ${isSubmitted ? 'var(--border)' : 'var(--border-md)'}`,
            borderRadius: 'var(--r)',
            padding: '13px 16px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            color: isSubmitted ? 'var(--text-secondary)' : 'var(--text-primary)',
            lineHeight: '1.7',
            resize: 'none',
            boxShadow: 'var(--shadow-sm)',
            outline: 'none',
            transition: 'all 0.15s',
            cursor: isSubmitted ? 'default' : 'text',
          }}
          onFocus={(e) => {
            if (!isSubmitted) {
              e.target.style.borderColor = 'var(--teal)'
              e.target.style.boxShadow =
                '0 0 0 3px var(--teal-glow), var(--shadow-sm)'
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

      {/* Confidence Slider + Submit Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <ConfidenceSlider disabled={isSubmitted} />

        <button
          onClick={handleSubmit}
          disabled={isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()}
          style={{
            background:
              isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()
                ? 'var(--muted-bg)'
                : 'var(--teal)',
            color:
              isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()
                ? 'var(--text-tertiary)'
                : 'white',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: 'var(--r-sm)',
            border: 'none',
            boxShadow:
              isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()
                ? 'none'
                : 'var(--shadow-md)',
            minWidth: '180px',
            cursor:
              isSubmitted || selectedDrugs.length === 0 || !reasoningText.trim()
                ? 'not-allowed'
                : 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitted && selectedDrugs.length > 0 && reasoningText.trim()) {
              e.currentTarget.style.background = 'var(--teal-dark)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitted && selectedDrugs.length > 0 && reasoningText.trim()) {
              e.currentTarget.style.background = 'var(--teal)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          Analyze Reasoning →
        </button>
      </div>
    </div>
  )
}
