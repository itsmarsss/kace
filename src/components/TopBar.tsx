import { Play, Square } from 'lucide-react'
import { useMode } from '../context/ModeProvider'

export default function TopBar() {
  const { isPlaying, playDemo, stopDemo, sessionState, dispatch, currentCase } =
    useMode()

  return (
    <header
      className="h-[52px] flex items-center px-5 gap-3"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-[6px]">
        <h1
          className="text-[17px] font-bold tracking-[-0.01em]"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            color: 'var(--teal-dark)',
          }}
        >
          KaCE
        </h1>
        <span
          className="text-[10px] font-normal ml-[6px]"
          style={{ color: 'var(--text-mute)' }}
        >
          Clinical Reasoning Coach
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-[1px] h-[18px]"
        style={{ background: 'var(--border-md)' }}
      />

      {/* Patient name */}
      <span
        className="text-[13px] font-medium"
        style={{
          fontFamily: '"DM Sans", sans-serif',
          color: 'var(--text)',
        }}
      >
        {currentCase.patient.name}
      </span>

      {/* Patient badge */}
      <span
        className="text-[10px] px-[10px] py-[2px] rounded-full"
        style={{
          background: 'var(--muted-bg)',
          border: '1px solid var(--border-md)',
          color: 'var(--text-mute)',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {currentCase.patient.age}M
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* View Expert Analysis button (appears after diagram builds) */}
      {sessionState === 'reviewed' && (
        <>
          <button
            onClick={() => dispatch({ type: 'SHOW_OVERLAY' })}
            className="text-[11px] font-semibold px-[14px] py-[7px] rounded-[6px] transition-all"
            style={{
              background: 'var(--teal)',
              color: 'white',
              border: 'none',
              fontFamily: '"DM Sans", sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--teal-dark)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--teal)'
            }}
          >
            View Expert Analysis
          </button>

          <div
            className="w-[1px] h-[18px]"
            style={{ background: 'var(--border-md)' }}
          />
        </>
      )}

      {/* Demo button */}
      <button
        onClick={isPlaying ? stopDemo : playDemo}
        className="flex items-center gap-[5px] px-3 py-[6px] text-[11px] font-semibold rounded-[6px] tracking-wide transition-all"
        style={{
          background: isPlaying ? 'var(--crimson-light)' : '#EDFAF8',
          border: isPlaying
            ? '1px solid var(--crimson-border)'
            : '1px solid rgba(73, 198, 185, 0.35)',
          color: isPlaying ? 'var(--crimson)' : 'var(--teal-dark)',
          fontFamily: '"DM Sans", sans-serif',
        }}
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
    </header>
  )
}
