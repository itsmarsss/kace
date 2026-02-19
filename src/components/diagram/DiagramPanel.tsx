import { useState } from 'react'
import { X, Workflow, List, RefreshCw } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from './DiagramBlock'
import DiagramFlow from './DiagramFlow'
import { DiagramFullscreenButton } from './DiagramFullscreen'
import BlockDetailModal from './BlockDetailModal'

export default function DiagramPanel() {
  const {
    diagramBlocks,
    expertBlocks,
    showExpertDiagram,
    overallFeedback,
    score,
    mode,
    diagramOpen,
    diagramLayout,
    dispatch,
  } = useMode()
  const [layoutKey, setLayoutKey] = useState(0)

  const is2D = diagramLayout === '2d'
  const hasExpertDiagram = expertBlocks.length > 0
  const currentBlocks = showExpertDiagram ? expertBlocks : diagramBlocks

  const handleReLayout = () => {
    setLayoutKey((prev) => prev + 1)
  }

  const handleToggleDiagram = () => {
    dispatch({ type: 'TOGGLE_EXPERT_DIAGRAM' })
    setLayoutKey((prev) => prev + 1) // Force re-layout when switching
  }

  if (!diagramOpen) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface)] font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-tertiary)]">
        Submit your reasoning to view the diagram
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--surface)]">
      {/* Panel header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-[18px] pb-3 pt-4">
        <div className="flex-1">
          <div className="mb-[2px] font-['DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            REASONING DIAGRAM
          </div>
          <div className="font-['DM_Sans',sans-serif] text-[10px] text-[var(--text-tertiary)]">
            Your extracted reasoning
          </div>
        </div>

        {/* Layout toggle */}
        <div className="flex gap-1 rounded-[var(--r-sm)] bg-[var(--muted-bg)] p-[2px]">
          <button
            onClick={() => dispatch({ type: 'SET_DIAGRAM_LAYOUT', payload: '1d' })}
            className={`flex cursor-pointer items-center gap-1 rounded-[var(--r-xs)] border-none px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-medium transition-all duration-150 ${
              !is2D
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
                : 'bg-transparent text-[var(--text-tertiary)]'
            }`}
          >
            <List size={12} />
            Linear
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_DIAGRAM_LAYOUT', payload: '2d' })}
            className={`flex cursor-pointer items-center gap-1 rounded-[var(--r-xs)] border-none px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-medium transition-all duration-150 ${
              is2D
                ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
                : 'bg-transparent text-[var(--text-tertiary)]'
            }`}
          >
            <Workflow size={12} />
            Graph
          </button>
        </div>

        {/* Re-layout button (2D only) */}
        {is2D && (
          <button
            onClick={handleReLayout}
            className="flex h-7 cursor-pointer items-center gap-1 rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-medium text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
            title="Re-organize diagram layout"
          >
            <RefreshCw size={12} />
            Re-layout
          </button>
        )}

        {/* Student/Expert toggle (live mode only, when expert blocks exist) */}
        {mode === 'live' && hasExpertDiagram && (
          <button
            onClick={handleToggleDiagram}
            className={`flex h-7 cursor-pointer items-center gap-1 rounded-[var(--r-sm)] border px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-medium transition-all duration-150 ${
              showExpertDiagram
                ? 'border-[var(--green)] bg-[var(--green-light)] text-[var(--green)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--card-hover)]'
            }`}
            title={showExpertDiagram ? 'Showing ideal reasoning' : 'Showing your reasoning'}
          >
            {showExpertDiagram ? '✓ Ideal' : 'Show Ideal'}
          </button>
        )}

        <DiagramFullscreenButton />

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM' })}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-[var(--r-xs)] border-none bg-transparent text-[var(--text-tertiary)] transition-all duration-150 hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
        >
          <X size={14} />
        </button>
      </div>

      {/* Diagram scroll area */}
      <div className={`relative flex-1 ${is2D ? '' : 'overflow-y-auto overflow-x-hidden p-4'}`}>
        {currentBlocks.length === 0 ? (
          <div className="flex h-full items-center justify-center p-5 text-center font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-tertiary)]">
            Analysis could not be completed. You can still view the expert comparison.
          </div>
        ) : is2D ? (
          // 2D interactive canvas with React Flow - no padding, full height
          <DiagramFlow key={layoutKey} blocks={currentBlocks} />
        ) : (
          // 1D vertical layout (no arrows, just stacked blocks)
          <div className="flex flex-col gap-4">
            {currentBlocks.map((block, index) => (
              <DiagramBlock
                key={block.id}
                block={block}
                index={index}
                showFeedback={!showExpertDiagram && mode === 'live'}
              />
            ))}
          </div>
        )}

      </div>

      {/* Block detail modal (shows on double-click) */}
      <BlockDetailModal />
    </div>
  )
}
