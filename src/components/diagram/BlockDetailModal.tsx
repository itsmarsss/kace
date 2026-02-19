import { useMode } from '../../context/ModeProvider'
import { getBlockStyle } from './blockTypes'

export default function BlockDetailModal() {
  const { selectedBlock, dispatch } = useMode()

  if (!selectedBlock) return null

  const style = getBlockStyle(selectedBlock.type)

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

        {/* Connections */}
        {selectedBlock.connects_to && selectedBlock.connects_to.length > 0 && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <div className="mb-2 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Connects to
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedBlock.connects_to.map((id) => (
                <div
                  key={id}
                  className="rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-secondary)]"
                >
                  {id}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
