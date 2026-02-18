import { useRef, useEffect } from 'react'
import { X, Workflow, List } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from './DiagramBlock'
import DiagramArrows from './DiagramArrows'
import DiagramFlow from './DiagramFlow'

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
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          color: 'var(--text-tertiary)',
        }}
      >
        Submit your reasoning to view the diagram
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '16px 18px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-tertiary)',
              marginBottom: '2px',
            }}
          >
            REASONING DIAGRAM
          </div>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
            }}
          >
            Your extracted reasoning
          </div>
        </div>

        {/* Layout toggle */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--muted-bg)',
            padding: '2px',
            borderRadius: 'var(--r-sm)',
          }}
        >
          <button
            onClick={() => dispatch({ type: 'SET_DIAGRAM_LAYOUT', payload: '1d' })}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: !is2D ? 'var(--surface)' : 'transparent',
              color: !is2D ? 'var(--text-primary)' : 'var(--text-tertiary)',
              borderRadius: 'var(--r-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              transition: 'all 0.15s',
              boxShadow: !is2D ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <List size={12} />
            Linear
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_DIAGRAM_LAYOUT', payload: '2d' })}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: is2D ? 'var(--surface)' : 'transparent',
              color: is2D ? 'var(--text-primary)' : 'var(--text-tertiary)',
              borderRadius: 'var(--r-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              transition: 'all 0.15s',
              boxShadow: is2D ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Workflow size={12} />
            Graph
          </button>
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DIAGRAM' })}
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            borderRadius: 'var(--r-xs)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--card-hover)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-tertiary)'
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Diagram scroll area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: is2D ? 'auto' : 'hidden',
          padding: '16px',
          position: 'relative',
        }}
      >
        {diagramBlocks.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            Analysis could not be completed. You can still view the expert
            comparison.
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                zIndex: 1,
              }}
            >
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
