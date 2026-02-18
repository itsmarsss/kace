import { X } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiffNode from './DiffNode'
import CalibrationBars from './CalibrationBars'

export default function ExpertOverlay() {
  const { showOverlay, dispatch, currentCase } = useMode()

  if (!showOverlay) return null

  return (
    <div
      className="fixed inset-0 z-[200] animate-[fadeUp_0.45s_var(--ease-in-out)]"
      style={{ background: 'var(--bg)' }}
    >
      {/* Header */}
      <header
        className="px-7 py-[18px] flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h2
            className="text-[17px] font-semibold mb-1"
            style={{
              fontFamily: '"Source Serif 4", serif',
              fontVariationSettings: '"opsz" 17',
              color: 'var(--text-primary)',
            }}
          >
            Expert Comparison
          </h2>
          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            See how your reasoning aligns with expert clinical thinking
          </p>
        </div>

        <button
          onClick={() => dispatch({ type: 'HIDE_OVERLAY' })}
          className="px-[14px] py-[6px] text-[11px] rounded-[6px] flex items-center gap-2 transition-all"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-md)',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={14} />
          Return to case
        </button>
      </header>

      {/* Main content */}
      <div className="flex h-[calc(100%-80px)] overflow-hidden">
        {/* Learner trace */}
        <div
          className="flex-1 px-[26px] py-[22px] overflow-y-auto space-y-[10px]"
          style={{ borderRight: '1px solid var(--border)' }}
        >
          <div className="label-caps mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Your Reasoning
          </div>

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
        <div className="flex-1 px-[26px] py-[22px] overflow-y-auto space-y-[10px]">
          <div className="label-caps mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Expert Reasoning
          </div>

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
          <div
            className="mt-6 px-[18px] py-4 rounded-[10px]"
            style={{
              background: 'var(--teal-light)',
              border: '1px solid var(--teal-border)',
              borderLeft: '2.5px solid var(--teal)',
              fontFamily: '"Source Serif 4", serif',
              fontSize: '14px',
              fontVariationSettings: '"opsz" 14',
              lineHeight: '1.78',
              color: 'var(--text-primary)',
            }}
          >
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
