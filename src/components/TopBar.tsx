import { Play, Square } from 'lucide-react'
import { useMode } from '../context/ModeProvider'
import { compareReasoning } from '../utils/compareReasoning'

export default function TopBar() {
  const {
    isPlaying,
    playDemo,
    stopDemo,
    sessionState,
    dispatch,
    currentCase,
    diagramBlocks,
    mode,
  } = useMode()

  const handleShowExpertAnalysis = () => {
    // Compute comparison between user's reasoning and expert reasoning
    const comparison = compareReasoning(diagramBlocks, currentCase.expertBlocks)

    // Show overlay with comparison result
    dispatch({ type: 'SHOW_OVERLAY', payload: comparison })
  }

  return (
    <header className="flex h-[52px] items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5">
      {/* Logo */}
      <div className="flex items-center gap-[6px]">
        <h1 className="font-['DM_Sans',sans-serif] text-[17px] font-bold tracking-[-0.01em] text-[var(--teal-dark)]">
          KaCE
        </h1>
        <span className="ml-[6px] text-[10px] font-normal text-[var(--text-tertiary)]">
          Clinical Reasoning Coach
        </span>
      </div>

      {/* Divider */}
      <div className="h-[18px] w-[1px] bg-[var(--border-md)]" />

      {/* Patient name */}
      <span className="font-['DM_Sans',sans-serif] text-[13px] font-medium text-[var(--text-primary)]">
        {currentCase.patient.name}
      </span>

      {/* Patient badge */}
      <span className="rounded-full border border-[var(--border-md)] bg-[var(--muted-bg)] px-[10px] py-[2px] font-['DM_Sans',sans-serif] text-[10px] text-[var(--text-tertiary)]">
        {currentCase.patient.age}M
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* View Expert Analysis button (appears after diagram builds) */}
      {sessionState === 'reviewed' && (
        <>
          <button
            onClick={handleShowExpertAnalysis}
            className="rounded-[6px] border-none bg-[var(--teal)] px-[14px] py-[7px] font-['DM_Sans',sans-serif] text-[11px] font-semibold text-white transition-all hover:bg-[var(--teal-dark)]"
          >
            View Expert Analysis
          </button>

          <div className="h-[18px] w-[1px] bg-[var(--border-md)]" />
        </>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1 rounded-[6px] bg-[var(--muted-bg)] p-[2px]">
        <button
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'demo' })}
          className={`rounded-[4px] border-none px-3 py-[5px] font-['DM_Sans',sans-serif] text-[10px] font-semibold transition-all ${
            mode === 'demo'
              ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
              : 'bg-transparent text-[var(--text-tertiary)]'
          }`}
        >
          Demo
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'live' })}
          className={`rounded-[4px] border-none px-3 py-[5px] font-['DM_Sans',sans-serif] text-[10px] font-semibold transition-all ${
            mode === 'live'
              ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
              : 'bg-transparent text-[var(--text-tertiary)]'
          }`}
        >
          Live
        </button>
      </div>

      {/* Demo button (only show in demo mode) */}
      {mode === 'demo' && (
        <button
          onClick={isPlaying ? stopDemo : playDemo}
          className={`flex items-center gap-[5px] rounded-[6px] px-3 py-[6px] font-['DM_Sans',sans-serif] text-[11px] font-semibold tracking-wide transition-all ${
            isPlaying
              ? 'border border-[var(--crimson-border)] bg-[var(--crimson-light)] text-[var(--crimson)]'
              : 'border border-[rgba(73,198,185,0.35)] bg-[#EDFAF8] text-[var(--teal-dark)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Square size={12} fill="currentColor" />
              Stop Demo
            </>
          ) : (
            <>
              <Play size={12} fill="currentColor" />
              Run Demo
            </>
          )}
        </button>
      )}
    </header>
  )
}
