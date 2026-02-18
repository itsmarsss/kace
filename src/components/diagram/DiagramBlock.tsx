import { forwardRef } from 'react'
import { getBlockStyle, getBlockTypeClass } from './blockTypes'

const DiagramBlock = forwardRef(({ block, index, diffState }, ref) => {
  const style = getBlockStyle(block.type)
  const typeClass = getBlockTypeClass(block.type)

  return (
    <div
      ref={ref}
      className={`diagram-block ${typeClass} ${diffState ? `block--${diffState}` : ''}`}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Type label */}
      <div
        className="block-type-label"
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: style.color,
          marginBottom: '4px',
        }}
      >
        {style.label}
        {block.type === 'DECISION' && ' ✓'}
      </div>

      {/* Title */}
      <div
        className="block-title"
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: '1.35',
          marginBottom: '5px',
        }}
      >
        {block.title}
      </div>

      {/* Body */}
      <div
        className="block-body"
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--text-dim)',
          lineHeight: '1.55',
        }}
      >
        {block.body}
      </div>
    </div>
  )
})

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
