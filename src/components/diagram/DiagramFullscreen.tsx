import { X, Maximize2 } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramFlow from './DiagramFlow'

export function DiagramFullscreenButton() {
  const { diagramOpen, dispatch } = useMode()

  if (!diagramOpen) return null

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM_FULLSCREEN' })}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: 'var(--r-sm)',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-tertiary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Maximize2 size={14} />
    </button>
  )
}

export function DiagramFullscreen() {
  const { showDiagramFullscreen, diagramBlocks, dispatch } = useMode()

  if (!showDiagramFullscreen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          height: '60px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Reasoning Diagram — Fullscreen
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM_FULLSCREEN' })}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <X size={14} />
          Close
        </button>
      </div>

      <div style={{ height: 'calc(100vh - 60px)' }}>
        <DiagramFlow blocks={diagramBlocks} />
      </div>
    </div>
  )
}
