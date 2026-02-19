import { useMode } from '../context/ModeProvider'

export default function DifficultyModal() {
  const { showDifficultyModal, dispatch } = useMode()

  if (!showDifficultyModal) return null

  const selectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty })
    dispatch({ type: 'HIDE_DIFFICULTY_MODAL' })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[500px] rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)]">
        {/* Header */}
        <div className="mb-5">
          <h2 className="mb-2 font-['DM_Sans',sans-serif] text-[24px] font-bold text-[var(--text-primary)]">
            Select Difficulty
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)]">
            Choose your challenge level. This affects which treatment options are available.
          </p>
        </div>

        {/* Difficulty options */}
        <div className="space-y-3">
          {/* Easy */}
          <button
            onClick={() => selectDifficulty('easy')}
            className="group w-full cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-light)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-['DM_Sans',sans-serif] text-[16px] font-semibold text-[var(--text-primary)]">
                Easy
              </span>
              <span className="rounded-[var(--r-xs)] bg-[var(--green-light)] px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-wider text-[var(--green)]">
                Recommended
              </span>
            </div>
            <p className="font-['DM_Sans',sans-serif] text-[12px] leading-[1.6] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              Focus on core pharmacological options only. Perfect for learning the fundamentals.
            </p>
            <div className="mt-2 font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-tertiary)]">
              Categories: Pharmacological
            </div>
          </button>

          {/* Medium */}
          <button
            onClick={() => selectDifficulty('medium')}
            className="group w-full cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-light)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-['DM_Sans',sans-serif] text-[16px] font-semibold text-[var(--text-primary)]">
                Medium
              </span>
            </div>
            <p className="font-['DM_Sans',sans-serif] text-[12px] leading-[1.6] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              Includes insulin therapy alongside pharmacological options. More treatment complexity.
            </p>
            <div className="mt-2 font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-tertiary)]">
              Categories: Pharmacological, Insulin
            </div>
          </button>

          {/* Hard */}
          <button
            onClick={() => selectDifficulty('hard')}
            className="group w-full cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-light)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-['DM_Sans',sans-serif] text-[16px] font-semibold text-[var(--text-primary)]">
                Hard
              </span>
              <span className="rounded-[var(--r-xs)] bg-[var(--crimson-light)] px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-wider text-[var(--crimson)]">
                Challenge
              </span>
            </div>
            <p className="font-['DM_Sans',sans-serif] text-[12px] leading-[1.6] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              All treatment categories available. Consider surgical, holistic, and alternative options.
            </p>
            <div className="mt-2 font-['DM_Sans',sans-serif] text-[11px] text-[var(--text-tertiary)]">
              Categories: All (Pharmacological, Insulin, Surgery, Holistic, Other)
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
