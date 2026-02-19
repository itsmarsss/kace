import { useMode } from '../../context/ModeProvider'
import { getBlockStyle } from './blockTypes'

export default function BlockDetailModal() {
  const { selectedBlock, diagramBlocks, dispatch } = useMode()

  if (!selectedBlock) return null

  const style = getBlockStyle(selectedBlock.type)

  // Find blocks that connect TO this block (incoming connections)
  const connectsFrom = diagramBlocks.filter((block) =>
    block.connects_to?.includes(selectedBlock.id)
  )

  const bgClass =
    selectedBlock.type === 'OBSERVATION'
      ? 'bg-[var(--teal-light)]'
      : selectedBlock.type === 'INTERPRETATION'
        ? 'bg-[var(--slate-light)]'
        : selectedBlock.type === 'CONSIDERATION'
          ? 'bg-[var(--amber-light)]'
          : selectedBlock.type === 'CONTRAINDICATION'
            ? 'bg-[var(--crimson-light)]'
            : 'bg-[var(--green-light)]' // DECISION

  const borderClass =
    selectedBlock.type === 'OBSERVATION'
      ? 'border-[var(--teal-border)]'
      : selectedBlock.type === 'INTERPRETATION'
        ? 'border-[var(--slate-border)]'
        : selectedBlock.type === 'CONSIDERATION'
          ? 'border-[var(--amber-border)]'
          : selectedBlock.type === 'CONTRAINDICATION'
            ? 'border-[var(--crimson-border)]'
            : 'border-[var(--green-border)]' // DECISION

  const borderTopClass =
    selectedBlock.type === 'OBSERVATION'
      ? 'border-t-[var(--teal)]'
      : selectedBlock.type === 'INTERPRETATION'
        ? 'border-t-[var(--slate)]'
        : selectedBlock.type === 'CONSIDERATION'
          ? 'border-t-[var(--amber)]'
          : selectedBlock.type === 'CONTRAINDICATION'
            ? 'border-t-[var(--crimson)]'
            : 'border-t-[var(--green)]' // DECISION

  const colorClass =
    selectedBlock.type === 'OBSERVATION'
      ? 'text-[var(--teal)]'
      : selectedBlock.type === 'INTERPRETATION'
        ? 'text-[var(--slate)]'
        : selectedBlock.type === 'CONSIDERATION'
          ? 'text-[var(--amber)]'
          : selectedBlock.type === 'CONTRAINDICATION'
            ? 'text-[var(--crimson)]'
            : 'text-[var(--green)]' // DECISION

  const handleClose = () => {
    dispatch({ type: 'SET_SELECTED_BLOCK', payload: null })
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className={`mx-5 w-full max-w-[600px] rounded-[var(--r-lg)] border border-t-[4px] p-[20px_24px] shadow-[var(--shadow-xl)] ${bgClass} ${borderClass} ${borderTopClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.12em] ${colorClass}`}
          >
            {style.label}
            {selectedBlock.type === 'DECISION' && ' ✓'}
          </div>
          <button
            onClick={handleClose}
            className="font-['DM_Sans',sans-serif] text-[20px] leading-none text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div className="mb-3 font-['DM_Sans',sans-serif] text-[18px] font-semibold leading-[1.35] text-[var(--text-primary)]">
          {selectedBlock.title}
        </div>

        {/* Body */}
        <div className="mb-4 font-['DM_Sans',sans-serif] text-[14px] font-normal leading-[1.65] text-[var(--text-secondary)]">
          {selectedBlock.body}
        </div>

        {/* Source text citation */}
        {selectedBlock.sourceText && (
          <div className="border-t border-[var(--border)] pt-4">
            <div className="mb-2 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Source from your reasoning
            </div>
            <div className="rounded-[var(--r-sm)] bg-[var(--surface)] p-[12px_14px] font-['DM_Sans',sans-serif] text-[13px] italic leading-[1.6] text-[var(--text-secondary)]">
              "{selectedBlock.sourceText}"
            </div>
          </div>
        )}

        {/* Incoming connections (connects from) */}
        {connectsFrom.length > 0 && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <div className="mb-2 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Connects from
            </div>
            <div className="flex flex-col gap-2">
              {connectsFrom.map((block) => {
                const blockStyle = getBlockStyle(block.type)

                // Get colors for the block
                const blockBgClass =
                  block.type === 'OBSERVATION'
                    ? 'bg-[var(--teal-light)]'
                    : block.type === 'INTERPRETATION'
                      ? 'bg-[var(--slate-light)]'
                      : block.type === 'CONSIDERATION'
                        ? 'bg-[var(--amber-light)]'
                        : block.type === 'CONTRAINDICATION'
                          ? 'bg-[var(--crimson-light)]'
                          : 'bg-[var(--green-light)]'

                const blockBorderClass =
                  block.type === 'OBSERVATION'
                    ? 'border-[var(--teal-border)]'
                    : block.type === 'INTERPRETATION'
                      ? 'border-[var(--slate-border)]'
                      : block.type === 'CONSIDERATION'
                        ? 'border-[var(--amber-border)]'
                        : block.type === 'CONTRAINDICATION'
                          ? 'border-[var(--crimson-border)]'
                          : 'border-[var(--green-border)]'

                const blockColorClass =
                  block.type === 'OBSERVATION'
                    ? 'text-[var(--teal)]'
                    : block.type === 'INTERPRETATION'
                      ? 'text-[var(--slate)]'
                      : block.type === 'CONSIDERATION'
                        ? 'text-[var(--amber)]'
                        : block.type === 'CONTRAINDICATION'
                          ? 'text-[var(--crimson)]'
                          : 'text-[var(--green)]'

                return (
                  <button
                    key={block.id}
                    onClick={() => dispatch({ type: 'SET_SELECTED_BLOCK', payload: block })}
                    className={`w-full cursor-pointer rounded-[var(--r-sm)] border p-[8px_12px] text-left transition-all duration-150 hover:shadow-[var(--shadow-md)] ${blockBgClass} ${blockBorderClass}`}
                  >
                    <div className={`mb-1 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] ${blockColorClass}`}>
                      {blockStyle.label}
                    </div>
                    <div className="font-['DM_Sans',sans-serif] text-[13px] font-medium text-[var(--text-primary)]">
                      {block.title}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Outgoing connections (connects to) */}
        {selectedBlock.connects_to && selectedBlock.connects_to.length > 0 && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <div className="mb-2 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Connects to
            </div>
            <div className="flex flex-col gap-2">
              {selectedBlock.connects_to.map((id) => {
                const connectedBlock = diagramBlocks.find((b) => b.id === id)
                if (!connectedBlock) return null

                const connectedStyle = getBlockStyle(connectedBlock.type)

                // Get colors for the connected block
                const connectedBgClass =
                  connectedBlock.type === 'OBSERVATION'
                    ? 'bg-[var(--teal-light)]'
                    : connectedBlock.type === 'INTERPRETATION'
                      ? 'bg-[var(--slate-light)]'
                      : connectedBlock.type === 'CONSIDERATION'
                        ? 'bg-[var(--amber-light)]'
                        : connectedBlock.type === 'CONTRAINDICATION'
                          ? 'bg-[var(--crimson-light)]'
                          : 'bg-[var(--green-light)]'

                const connectedBorderClass =
                  connectedBlock.type === 'OBSERVATION'
                    ? 'border-[var(--teal-border)]'
                    : connectedBlock.type === 'INTERPRETATION'
                      ? 'border-[var(--slate-border)]'
                      : connectedBlock.type === 'CONSIDERATION'
                        ? 'border-[var(--amber-border)]'
                        : connectedBlock.type === 'CONTRAINDICATION'
                          ? 'border-[var(--crimson-border)]'
                          : 'border-[var(--green-border)]'

                const connectedColorClass =
                  connectedBlock.type === 'OBSERVATION'
                    ? 'text-[var(--teal)]'
                    : connectedBlock.type === 'INTERPRETATION'
                      ? 'text-[var(--slate)]'
                      : connectedBlock.type === 'CONSIDERATION'
                        ? 'text-[var(--amber)]'
                        : connectedBlock.type === 'CONTRAINDICATION'
                          ? 'text-[var(--crimson)]'
                          : 'text-[var(--green)]'

                return (
                  <button
                    key={id}
                    onClick={() => dispatch({ type: 'SET_SELECTED_BLOCK', payload: connectedBlock })}
                    className={`w-full cursor-pointer rounded-[var(--r-sm)] border p-[8px_12px] text-left transition-all duration-150 hover:shadow-[var(--shadow-md)] ${connectedBgClass} ${connectedBorderClass}`}
                  >
                    <div className={`mb-1 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] ${connectedColorClass}`}>
                      {connectedStyle.label}
                    </div>
                    <div className="font-['DM_Sans',sans-serif] text-[13px] font-medium text-[var(--text-primary)]">
                      {connectedBlock.title}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
