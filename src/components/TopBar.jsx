import { Play, Square, PanelLeft, Eye, BarChart3 } from 'lucide-react'
import { useMode } from '../context/ModeProvider'

export default function TopBar() {
  const {
    isPlaying,
    playDemo,
    stopDemo,
    sidebarOpen,
    setSidebarOpen,
    graphOpen,
    setGraphOpen,
    captionsOpen,
    setCaptionsOpen,
    currentCase,
  } = useMode()

  return (
    <header
      className="h-[52px] flex items-center px-5 gap-3"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1
          className="text-[16px] font-semibold tracking-wide"
          style={{
            fontFamily: '"Playfair Display", serif',
            color: 'var(--gold)',
          }}
        >
          Kace
        </h1>
        <span
          className="text-[10px] font-light"
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
      <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
        {currentCase.patient.name}
      </span>

      {/* Patient badge */}
      <span
        className="text-[10px] px-[10px] py-[2px] rounded-full"
        style={{
          background: 'var(--muted-bg)',
          border: '1px solid var(--border-md)',
          color: 'var(--text-mute)',
        }}
      >
        {currentCase.patient.age}M
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Toggle buttons */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="flex items-center gap-[5px] px-3 py-[6px] text-[11px] rounded-[7px] transition-all"
        style={{
          background: sidebarOpen ? 'var(--gold-light)' : 'transparent',
          border: sidebarOpen
            ? '1px solid var(--gold-border)'
            : '1px solid var(--border-md)',
          color: sidebarOpen ? 'var(--gold)' : 'var(--text-dim)',
        }}
      >
        <PanelLeft size={13} />
        Symptoms
      </button>

      <button
        onClick={() => setCaptionsOpen(!captionsOpen)}
        className="flex items-center gap-[5px] px-3 py-[6px] text-[11px] rounded-[7px] transition-all"
        style={{
          background: captionsOpen ? 'var(--gold-light)' : 'transparent',
          border: captionsOpen
            ? '1px solid var(--gold-border)'
            : '1px solid var(--border-md)',
          color: captionsOpen ? 'var(--gold)' : 'var(--text-dim)',
        }}
      >
        <Eye size={13} />
        Captions
      </button>

      <button
        onClick={() => setGraphOpen(!graphOpen)}
        className="flex items-center gap-[5px] px-3 py-[6px] text-[11px] rounded-[7px] transition-all"
        style={{
          background: graphOpen ? 'var(--gold-light)' : 'transparent',
          border: graphOpen
            ? '1px solid var(--gold-border)'
            : '1px solid var(--border-md)',
          color: graphOpen ? 'var(--gold)' : 'var(--text-dim)',
        }}
      >
        <BarChart3 size={13} />
        Thought Process
      </button>

      {/* Divider */}
      <div
        className="w-[1px] h-[18px]"
        style={{ background: 'var(--border-md)' }}
      />

      {/* Demo button */}
      <button
        onClick={isPlaying ? stopDemo : playDemo}
        className="flex items-center gap-[5px] px-3 py-[6px] text-[11px] font-semibold rounded-[7px] tracking-wide transition-all"
        style={{
          background: isPlaying ? 'var(--red-light)' : '#EEFAF4',
          border: isPlaying
            ? '1px solid var(--red-border)'
            : '1px solid rgba(45,155,111,0.3)',
          color: isPlaying ? 'var(--red)' : 'var(--green)',
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
