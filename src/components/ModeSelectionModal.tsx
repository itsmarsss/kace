import { useMode } from '../context/ModeProvider'

export default function ModeSelectionModal() {
  const { showModeModal, dispatch } = useMode()

  if (!showModeModal) return null

  const selectMode = (mode: 'demo' | 'live') => {
    dispatch({ type: 'SET_MODE', payload: mode })
    dispatch({ type: 'HIDE_MODE_MODAL' })
    // Show difficulty modal after mode selection
    dispatch({ type: 'SHOW_DIFFICULTY_MODAL' })
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[480px] rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)]">
        {/* Header */}
        <div className="mb-5 text-center">
          <h2 className="mb-2 font-['DM_Sans',sans-serif] text-[24px] font-bold text-[var(--text-primary)]">
            Welcome to KaCE
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)]">
            Choose how you'd like to use the clinical reasoning coach
          </p>
        </div>

        {/* Mode options */}
        <div className="space-y-3">
          {/* Demo */}
          <button
            onClick={() => selectMode('demo')}
            className="group w-full cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5 text-left transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-light)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-['DM_Sans',sans-serif] text-[18px] font-semibold text-[var(--text-primary)]">
                Demo Mode
              </span>
              <span className="rounded-[var(--r-xs)] bg-[var(--amber-light)] px-2.5 py-1 font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-wider text-[var(--amber)]">
                Preview
              </span>
            </div>
            <p className="mb-3 font-['DM_Sans',sans-serif] text-[13px] leading-[1.6] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              Watch a simulated clinical reasoning session with automated feedback. Perfect for understanding how the tool works.
            </p>
            <div className="flex items-center gap-2 font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-tertiary)]">
              <span>✓</span>
              <span>Pre-built case</span>
              <span>•</span>
              <span>Automated playthrough</span>
              <span>•</span>
              <span>Instant feedback</span>
            </div>
          </button>

          {/* Live */}
          <button
            onClick={() => selectMode('live')}
            className="group w-full cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5 text-left transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-light)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-['DM_Sans',sans-serif] text-[18px] font-semibold text-[var(--text-primary)]">
                Live Mode
              </span>
              <span className="rounded-[var(--r-xs)] bg-[var(--green-light)] px-2.5 py-1 font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-wider text-[var(--green)]">
                Interactive
              </span>
            </div>
            <p className="mb-3 font-['DM_Sans',sans-serif] text-[13px] leading-[1.6] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              Work through real cases with AI-powered analysis. Your reasoning is evaluated in real-time with personalized feedback.
            </p>
            <div className="flex items-center gap-2 font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-tertiary)]">
              <span>✓</span>
              <span>Real cases</span>
              <span>•</span>
              <span>Write your reasoning</span>
              <span>•</span>
              <span>AI feedback</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
