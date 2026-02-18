import { useEffect } from 'react'
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import { useTTS } from '../../hooks/useTTS'

export default function PatientSpeech() {
  const { currentCase, currentSpeechLine, isPlaying, dispatch } = useMode()
  const { isSpeaking, toggle } = useTTS()

  const speechLines = currentCase.speechLines || []
  const currentText = speechLines[currentSpeechLine] || ''

  // Auto-play TTS at demo start
  useEffect(() => {
    if (isPlaying && currentSpeechLine === 0 && currentText) {
      // Auto-play first line when demo starts
      const timer = setTimeout(() => {
        toggle(currentText)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isPlaying]) // Only run when isPlaying changes

  return (
    <div
      style={{
        padding: '12px 14px 14px',
        borderTop: '1px solid var(--border)',
        background: 'var(--teal-light)',
        flexShrink: 0,
      }}
    >
      {/* TTS control row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        {/* Speaker button with waveform */}
        <button
          onClick={() => toggle(currentText)}
          disabled={!currentText}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--r-sm)',
            background: 'transparent',
            color: 'var(--teal-dark)',
            border: '1px solid var(--teal-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentText ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            if (currentText) {
              e.currentTarget.style.background = 'var(--card)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {isSpeaking ? (
            // Waveform animation
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '12px' }}>
              <div
                style={{
                  width: '2px',
                  height: '12px',
                  background: 'var(--teal-dark)',
                  borderRadius: '2px',
                  animation: 'wavebar 0.8s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '2px',
                  height: '12px',
                  background: 'var(--teal-dark)',
                  borderRadius: '2px',
                  animation: 'wavebar 0.8s ease-in-out 0.15s infinite',
                }}
              />
              <div
                style={{
                  width: '2px',
                  height: '12px',
                  background: 'var(--teal-dark)',
                  borderRadius: '2px',
                  animation: 'wavebar 0.8s ease-in-out 0.30s infinite',
                }}
              />
            </div>
          ) : (
            <Volume2 size={12} />
          )}
        </button>

        {/* Line counter and navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => dispatch({ type: 'PREV_SPEECH_LINE' })}
            disabled={currentSpeechLine === 0}
            style={{
              width: '16px',
              height: '16px',
              border: 'none',
              background: 'transparent',
              color: currentSpeechLine === 0 ? 'var(--border-md)' : 'var(--text-tertiary)',
              cursor: currentSpeechLine === 0 ? 'not-allowed' : 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={14} />
          </button>

          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
            }}
          >
            {currentSpeechLine + 1} / {speechLines.length}
          </span>

          <button
            onClick={() => dispatch({ type: 'NEXT_SPEECH_LINE' })}
            disabled={currentSpeechLine === speechLines.length - 1}
            style={{
              width: '16px',
              height: '16px',
              border: 'none',
              background: 'transparent',
              color:
                currentSpeechLine === speechLines.length - 1
                  ? 'var(--border-md)'
                  : 'var(--text-tertiary)',
              cursor:
                currentSpeechLine === speechLines.length - 1 ? 'not-allowed' : 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Speech bubble */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--teal-border)',
          borderRadius: 'var(--r) var(--r) var(--r) 4px', // Flat bottom-left for tail
          padding: '10px 13px',
          position: 'relative',
        }}
      >
        {/* Tail pointing up (::before and ::after for bordered tail) */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '18px',
            width: 0,
            height: 0,
            border: '8px solid transparent',
            borderTopColor: 'var(--teal-border)',
            borderBottom: 0,
            borderLeft: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '19px',
            width: 0,
            height: 0,
            border: '7px solid transparent',
            borderTopColor: 'var(--card)',
            borderBottom: 0,
            borderLeft: 0,
          }}
        />

        {/* Speech text */}
        <p
          style={{
            fontFamily: '"Source Serif 4", serif',
            fontSize: '14px',
            fontStyle: 'italic',
            fontVariationSettings: '"opsz" 14',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          {currentText}
        </p>
      </div>
    </div>
  )
}
