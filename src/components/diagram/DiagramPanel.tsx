import { useRef, useEffect } from 'react'
import { X, Workflow, List } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from './DiagramBlock'
import DiagramArrows from './DiagramArrows'
import DiagramFlow from './DiagramFlow'
import { DiagramFullscreenButton } from './DiagramFullscreen'

export default function DiagramPanel() {
  const { diagramBlocks, diagramOpen, diagramLayout, dispatch } = useMode()
  const containerRef = useRef(null)
  const blockRefs = useRef([])

  // Initialize block refs array
  useEffect(() => {
    blockRefs.current = blockRefs.current.slice(0, diagramBlocks.length)
  }, [diagramBlocks])

  const is2D = diagramLayout === '2d'

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

        <DiagramFullscreenButton />

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM' })}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-[var(--r-xs)] border-none bg-transparent text-[var(--text-tertiary)] transition-all duration-150 hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
        >
          <X size={14} />
        </button>
      </div>

      {/* Diagram scroll area */}
      <div
        ref={containerRef}
        className={`relative flex-1 p-4 ${is2D ? 'overflow-auto' : 'overflow-y-auto overflow-x-hidden'}`}
      >
        {diagramBlocks.length === 0 ? (
          <div className="flex h-full items-center justify-center p-5 text-center font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-tertiary)]">
            Analysis could not be completed. You can still view the expert comparison.
          </div>
        ) : is2D ? (
          // 2D interactive canvas with React Flow
          <DiagramFlow blocks={diagramBlocks} />
        ) : (
          // 1D vertical layout
          <>
            {/* SVG arrows layer (behind blocks) */}
            <DiagramArrows
              blocks={diagramBlocks}
              blockRefs={blockRefs.current}
              containerRef={containerRef.current}
            />

            {/* Block cards */}
            <div className="relative z-[1] flex flex-col gap-4">
              {diagramBlocks.map((block, index) => (
                <DiagramBlock
                  key={block.id}
                  ref={(el) => (blockRefs.current[index] = el)}
                  block={block}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
