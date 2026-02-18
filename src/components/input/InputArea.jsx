import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import ConfidenceSlider from './ConfidenceSlider'
import DrugPills from './DrugPills'

export default function InputArea() {
  const { isInputDisabled, sendMessage, mode } = useMode()
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (input.trim() && !isInputDisabled) {
      sendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="px-5 py-[14px] pb-[18px]"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -1px 0 var(--border)',
        opacity: isInputDisabled ? 0.45 : 1,
        pointerEvents: isInputDisabled ? 'none' : 'auto',
        cursor: isInputDisabled ? 'not-allowed' : 'default',
      }}
    >
      {/* Top row: Confidence + Drug Pills */}
      <div className="flex items-center gap-4 mb-3">
        <ConfidenceSlider />
        <DrugPills />
      </div>

      {/* Input row */}
      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Explain your reasoning..."
          disabled={isInputDisabled}
          className="flex-1 px-[14px] py-[11px] text-[13px] resize-none transition-all"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border-md)',
            borderRadius: 'var(--r)',
            color: 'var(--text)',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '44px',
            maxHeight: '110px',
            outline: 'none',
            fontFamily: '"Sora", sans-serif',
          }}
          rows={1}
        />

        {mode === 'live' && (
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isInputDisabled}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-[12px] transition-all"
            style={{
              background: 'var(--gold)',
              boxShadow: 'var(--shadow-md)',
              cursor: input.trim() && !isInputDisabled ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !isInputDisabled ? 1 : 0.5,
            }}
          >
            <ArrowUp size={16} color="white" />
          </button>
        )}
      </div>
    </div>
  )
}
