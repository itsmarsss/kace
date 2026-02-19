import { X, Maximize2 } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramFlow from './DiagramFlow'

export function DiagramFullscreenButton() {
  const { diagramOpen, dispatch } = useMode()

  if (!diagramOpen) return null

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM_FULLSCREEN' })}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--r-sm)] border-none bg-transparent text-[var(--text-tertiary)]"
    >
      <Maximize2 size={14} />
    </button>
  )
}

export function DiagramFullscreen() {
  const { showDiagramFullscreen, diagramBlocks, dispatch } = useMode()

  if (!showDiagramFullscreen) return null

  return (
    <div className="fixed inset-0 z-[300] bg-[var(--bg)]">
      <div className="flex h-[60px] items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6">
        <div className="font-['DM_Sans',sans-serif] text-base font-semibold text-[var(--text-primary)]">
          Reasoning Diagram — Fullscreen
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM_FULLSCREEN' })}
          className="flex cursor-pointer items-center gap-2 rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--card)] px-4 py-2"
        >
          <X size={14} />
          Close
        </button>
      </div>

      <div className="h-[calc(100vh-60px)]">
        <DiagramFlow blocks={diagramBlocks} />
      </div>
    </div>
  )
}
