import { useMode } from '../../context/ModeProvider'

interface ConfidenceSliderProps {
  disabled?: boolean
}

export default function ConfidenceSlider({ disabled }: ConfidenceSliderProps) {
  const { confidence, dispatch } = useMode()

  return (
    <div className="flex items-center gap-3">
      <div className="text-[10px] text-[var(--text-tertiary)]">Confidence</div>

      <input
        type="range"
        min="1"
        max="5"
        value={confidence}
        onChange={(e) => dispatch({ type: 'SET_CONFIDENCE', payload: parseInt(e.target.value) })}
        disabled={disabled}
        className="h-[3px] w-[140px] cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--border-strong) 0%, var(--teal) ${((confidence - 1) / 4) * 100}%, var(--muted-bg) ${((confidence - 1) / 4) * 100}%)`,
        }}
      />

      <div className="w-[12px] text-[11px] font-semibold text-[var(--teal-dark)]">{confidence}</div>
    </div>
  )
}
