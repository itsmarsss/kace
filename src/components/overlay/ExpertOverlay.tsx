import { X } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiffNode from './DiffNode'
import CalibrationBars from './CalibrationBars'

export default function ExpertOverlay() {
  const { showOverlay, dispatch, currentCase } = useMode()

  if (!showOverlay) return null

  return (
    <div className="fixed inset-0 z-[200] animate-[fadeUp_0.45s_var(--ease-in-out)] bg-[var(--bg)]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-7 py-[18px]">
        <div>
          <h2 className="mb-1 font-['Source_Serif_4',serif] text-[17px] font-semibold text-[var(--text-primary)] [font-variation-settings:'opsz'_17]">
            Expert Comparison
          </h2>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            See how your reasoning aligns with expert clinical thinking
          </p>
        </div>

        <button
          onClick={() => dispatch({ type: 'HIDE_OVERLAY' })}
          className="flex items-center gap-2 rounded-[6px] border border-[var(--border-md)] bg-transparent px-[14px] py-[6px] text-[11px] text-[var(--text-secondary)] transition-all"
        >
          <X size={14} />
          Return to case
        </button>
      </header>

      {/* Main content */}
      <div className="flex h-[calc(100%-80px)] overflow-hidden">
        {/* Learner trace */}
        <div className="flex-1 space-y-[10px] overflow-y-auto border-r border-[var(--border)] px-[26px] py-[22px]">
          <div className="label-caps mb-4 text-[var(--text-tertiary)]">Your Reasoning</div>

          {currentCase.expertTrace.map((item, index) => (
            <DiffNode
              key={index}
              type={item.type}
              title={item.title}
              body={item.body}
              animationDelay={index * 100}
            />
          ))}
        </div>

        {/* Expert trace */}
        <div className="flex-1 space-y-[10px] overflow-y-auto px-[26px] py-[22px]">
          <div className="label-caps mb-4 text-[var(--text-tertiary)]">Expert Reasoning</div>

          {currentCase.expertTrace
            .filter((item) => item.type === 'match')
            .map((item, index) => (
              <DiffNode
                key={index}
                type="match"
                title={item.title}
                body={item.body}
                animationDelay={index * 100 + 50}
              />
            ))}

          {/* Insight block */}
          <div className="mt-6 rounded-[10px] border border-l-[2.5px] border-[var(--teal-border)] border-l-[var(--teal)] bg-[var(--teal-light)] px-[18px] py-4 font-['Source_Serif_4',serif] text-[14px] leading-[1.78] text-[var(--text-primary)] [font-variation-settings:'opsz'_14]">
            Your reasoning captured the critical comorbidities. The key insight: in HFrEF + T2DM,
            cardiovascular benefit supersedes glycemic control as the primary treatment goal.
          </div>

          {/* Calibration */}
          <div className="mt-6">
            <div className="label-caps mb-3">Confidence Calibration</div>
            <CalibrationBars />
          </div>
        </div>
      </div>
    </div>
  )
}
