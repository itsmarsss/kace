import { useMode } from '../../context/ModeProvider'

export default function ConfidenceSlider() {
  const { confidence, setConfidence, isInputDisabled } = useMode()

  return (
    <div className="flex items-center gap-3">
      <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
        Confidence
      </div>

      <input
        type="range"
        min="1"
        max="5"
        value={confidence}
        onChange={(e) => setConfidence(parseInt(e.target.value))}
        disabled={isInputDisabled}
        className="w-[140px] h-[3px] appearance-none rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(to right,
            var(--border-strong) 0%,
            var(--teal) ${((confidence - 1) / 4) * 100}%,
            var(--muted-bg) ${((confidence - 1) / 4) * 100}%)`,
        }}
      />

      <div className="text-[11px] font-semibold w-[12px]" style={{ color: 'var(--teal-dark)' }}>
        {confidence}
      </div>
    </div>
  )
}
