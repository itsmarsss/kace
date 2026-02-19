import { forwardRef } from 'react'
import { getBlockStyle, getBlockTypeClass } from './blockTypes'
import { useMode } from '../../context/ModeProvider'
import BlockFeedback from './BlockFeedback'

interface DiagramBlockProps {
  block: any
  index: number
  diffState?: string | null
  showFeedback?: boolean
}

const DiagramBlock = forwardRef<HTMLDivElement, DiagramBlockProps>(
  ({ block, index, diffState, showFeedback = false }, ref) => {
    const { dispatch } = useMode()
    const style = getBlockStyle(block.type)
    const typeClass = getBlockTypeClass(block.type)

    // Get color class based on block type
    const colorClass =
      block.type === 'OBSERVATION'
        ? 'text-[var(--teal)]'
        : block.type === 'INTERPRETATION'
          ? 'text-[var(--slate)]'
          : block.type === 'CONSIDERATION'
            ? 'text-[var(--amber)]'
            : block.type === 'CONTRAINDICATION'
              ? 'text-[var(--crimson)]'
              : 'text-[var(--green)]' // DECISION

    const handleMouseEnter = () => {
      dispatch({ type: 'SET_HOVERED_BLOCK', payload: block })
    }

    const handleMouseLeave = () => {
      dispatch({ type: 'SET_HOVERED_BLOCK', payload: null })
    }

    const handleDoubleClick = () => {
      dispatch({ type: 'SET_SELECTED_BLOCK', payload: block })
    }

    return (
      <div
        ref={ref}
        className={`diagram-block ${typeClass} ${diffState ? `block--${diffState}` : ''} cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)]`}
        style={{ animationDelay: `${index * 150}ms` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
      >
        {/* Type label */}
        <div
          className={`block-type-label mb-1 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] ${colorClass}`}
        >
          {style.label}
          {block.type === 'DECISION' && ' ✓'}
        </div>

        {/* Title */}
        <div className="block-title mb-[5px] font-['DM_Sans',sans-serif] text-[14px] font-semibold leading-[1.35] text-[var(--text-primary)]">
          {block.title}
        </div>

        {/* Body */}
        <div className="block-body font-['DM_Sans',sans-serif] text-[12px] font-normal leading-[1.55] text-[var(--text-secondary)]">
          {block.body}
        </div>

        {/* Feedback */}
        {showFeedback && block.feedback && <BlockFeedback feedback={block.feedback} />}
      </div>
    )
  }
)

DiagramBlock.displayName = 'DiagramBlock'

export default DiagramBlock

// Add these styles to globals.css:
// .diagram-block {
//   background: var(--card);
//   border: 1px solid [set dynamically];
//   border-top: 3px solid [set dynamically];
//   border-radius: var(--r);
//   padding: 12px 14px;
//   box-shadow: var(--shadow-sm);
//   width: 100%;
//   position: relative;
//   z-index: 1;
//   animation: blockIn 0.38s cubic-bezier(0.4, 0, 0.2, 1) both;
// }

// .block--OBSERVATION {
//   background: var(--teal-light);
//   border-color: var(--teal-border);
//   border-top-color: var(--teal);
// }
// .block--INTERPRETATION {
//   background: var(--slate-light);
//   border-color: var(--slate-border);
//   border-top-color: var(--slate);
// }
// .block--CONSIDERATION {
//   background: var(--amber-light);
//   border-color: var(--amber-border);
//   border-top-color: var(--amber);
// }
// .block--CONTRAINDICATION {
//   background: var(--crimson-light);
//   border-color: var(--crimson-border);
//   border-top-color: var(--crimson);
// }
// .block--DECISION {
//   background: var(--green-light);
//   border-color: var(--green-border);
//   border-top-color: var(--green);
//   box-shadow: var(--shadow-sm), 0 0 0 1px var(--green-border);
// }

// /* Diff states for expert overlay */
// .block--match {
//   box-shadow: var(--shadow-sm), 0 0 0 2px var(--green);
// }
// .block--miss {
//   box-shadow: var(--shadow-sm), 0 0 0 2px var(--amber);
//   opacity: 0.6;
//   border-style: dashed;
// }
// .block--wrong {
//   box-shadow: var(--shadow-sm), 0 0 0 2px var(--crimson);
// }
