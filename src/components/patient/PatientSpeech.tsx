import { useEffect, useRef } from 'react'
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import { useTTS } from '../../hooks/useTTS'

export default function PatientSpeech() {
  const { currentCase, currentSpeechLine, isPlaying, dispatch } = useMode()
  const { isSpeaking, toggle } = useTTS()
  const hasAutoPlayedRef = useRef(false)

  const speechLines = currentCase.speechLines || []
  const currentText = speechLines[currentSpeechLine] || ''

  // Reset auto-play flag when demo stops
  useEffect(() => {
    if (!isPlaying) {
      hasAutoPlayedRef.current = false
    }
  }, [isPlaying])

  // Auto-play TTS at demo start
  useEffect(() => {
    if (isPlaying && currentSpeechLine === 0 && currentText && !isSpeaking && !hasAutoPlayedRef.current) {
      // Auto-play first line when demo starts
      hasAutoPlayedRef.current = true
      const timer = setTimeout(() => {
        toggle(currentText)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentSpeechLine, currentText, isSpeaking, toggle])

  return (
    <div className="flex-shrink-0 border-t border-[var(--border)] bg-[var(--teal-light)] px-[14px] pb-[14px] pt-3">
      {/* TTS control row */}
      <div className="mb-2 flex items-center justify-between">
        {/* Speaker button with waveform */}
        <button
          onClick={() => toggle(currentText)}
          disabled={!currentText}
          className={`flex h-6 w-6 items-center justify-center rounded-[var(--r-sm)] border border-[var(--teal-border)] bg-transparent p-0 text-[var(--teal-dark)] transition-all duration-150 ${
            currentText ? 'cursor-pointer hover:bg-[var(--card)]' : 'cursor-not-allowed'
          }`}
        >
          {isSpeaking ? (
            // Waveform animation
            <div className="flex h-3 items-center gap-[2px]">
              <div className="h-3 w-[2px] animate-[wavebar_0.8s_ease-in-out_infinite] rounded-[2px] bg-[var(--teal-dark)]" />
              <div className="h-3 w-[2px] animate-[wavebar_0.8s_ease-in-out_0.15s_infinite] rounded-[2px] bg-[var(--teal-dark)]" />
              <div className="h-3 w-[2px] animate-[wavebar_0.8s_ease-in-out_0.30s_infinite] rounded-[2px] bg-[var(--teal-dark)]" />
            </div>
          ) : (
            <Volume2 size={12} />
          )}
        </button>

        {/* Line counter and navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'PREV_SPEECH_LINE' })}
            disabled={currentSpeechLine === 0}
            className={`flex h-4 w-4 items-center justify-center border-none bg-transparent p-0 ${
              currentSpeechLine === 0
                ? 'cursor-not-allowed text-[var(--border-md)]'
                : 'cursor-pointer text-[var(--text-tertiary)]'
            }`}
          >
            <ChevronLeft size={14} />
          </button>

          <span className="font-['DM_Sans',sans-serif] text-[10px] text-[var(--text-tertiary)]">
            {currentSpeechLine + 1} / {speechLines.length}
          </span>

          <button
            onClick={() => dispatch({ type: 'NEXT_SPEECH_LINE' })}
            disabled={currentSpeechLine === speechLines.length - 1}
            className={`flex h-4 w-4 items-center justify-center border-none bg-transparent p-0 ${
              currentSpeechLine === speechLines.length - 1
                ? 'cursor-not-allowed text-[var(--border-md)]'
                : 'cursor-pointer text-[var(--text-tertiary)]'
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Speech bubble */}
      <div className="relative rounded-[var(--r)_var(--r)_var(--r)_4px] border border-[var(--teal-border)] bg-[var(--card)] p-[10px_13px]">
        {/* Tail pointing up (::before and ::after for bordered tail) */}
        <div className="absolute bottom-[-8px] left-[18px] h-0 w-0 border-[8px] border-b-0 border-l-0 border-transparent border-t-[var(--teal-border)]" />
        <div className="absolute bottom-[-6px] left-[19px] h-0 w-0 border-[7px] border-b-0 border-l-0 border-transparent border-t-[var(--card)]" />

        {/* Speech text */}
        <p className="m-0 font-['Source_Serif_4',serif] text-[14px] italic leading-[1.65] text-[var(--text-secondary)] [font-variation-settings:'opsz'_14]">
          {currentText}
        </p>
      </div>
    </div>
  )
}
