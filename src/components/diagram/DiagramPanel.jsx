import { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from './DiagramBlock'
import DiagramArrows from './DiagramArrows'

export default function DiagramPanel() {
  const { diagramBlocks, diagramOpen, dispatch } = useMode()
  const containerRef = useRef(null)
  const blockRefs = useRef([])

  // Initialize block refs array
  useEffect(() => {
    blockRefs.current = blockRefs.current.slice(0, diagramBlocks.length)
  }, [diagramBlocks])

  if (!diagramOpen) {
    return null
  }

  return (
    <div
      style={{
        width: diagramOpen ? '380px' : '0',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
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
        <div>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-mute)',
              marginBottom: '2px',
            }}
          >
            REASONING DIAGRAM
          </div>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              color: 'var(--text-mute)',
            }}
          >
            Your extracted reasoning
          </div>
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
            color: 'var(--text-mute)',
            cursor: 'pointer',
            borderRadius: 'var(--r-xs)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--card-hover)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-mute)'
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
              color: 'var(--text-mute)',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            Analysis could not be completed. You can still view the expert
            comparison.
          </div>
        ) : (
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
