import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import { DiagramBlock } from '../../services/types'
import BlockFeedback from '../diagram/BlockFeedback'
import { getBlockStyle } from '../diagram/blockTypes'

export default function FeedbackModal() {
  const { diagramBlocks, expertBlocks, overallFeedback, score, showFeedbackModal, dispatch } = useMode()

  if (!showFeedbackModal) return null

  // Find missing blocks (expert blocks that don't have a corresponding student block)
  const missingBlocks = expertBlocks.filter((expertBlock) => {
    // Check if student has a similar block
    const hasMatch = diagramBlocks.some(
      (studentBlock) =>
        studentBlock.type === expertBlock.type &&
        (studentBlock.title.toLowerCase().includes(expertBlock.title.toLowerCase().substring(0, 15)) ||
          expertBlock.title.toLowerCase().includes(studentBlock.title.toLowerCase().substring(0, 15)))
    )
    return !hasMatch
  })

  const handleClose = () => {
    dispatch({ type: 'HIDE_FEEDBACK_MODAL' })
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-[var(--green)]'
    if (score >= 60) return 'text-[var(--amber)]'
    return 'text-[var(--crimson)]'
  }

  const getScoreBg = () => {
    if (score >= 80) return 'bg-[var(--green-light)]'
    if (score >= 60) return 'bg-[var(--amber-light)]'
    return 'bg-[var(--crimson-light)]'
  }

  const renderBlock = (block: DiagramBlock, showFeedback: boolean = false) => {
    const style = getBlockStyle(block.type)

    const bgClass =
      block.type === 'OBSERVATION'
        ? 'bg-[var(--teal-light)]'
        : block.type === 'INTERPRETATION'
          ? 'bg-[var(--slate-light)]'
          : block.type === 'CONSIDERATION'
            ? 'bg-[var(--amber-light)]'
            : block.type === 'CONTRAINDICATION'
              ? 'bg-[var(--crimson-light)]'
              : 'bg-[var(--green-light)]'

    const borderClass =
      block.type === 'OBSERVATION'
        ? 'border-[var(--teal-border)] border-t-[var(--teal)]'
        : block.type === 'INTERPRETATION'
          ? 'border-[var(--slate-border)] border-t-[var(--slate)]'
          : block.type === 'CONSIDERATION'
            ? 'border-[var(--amber-border)] border-t-[var(--amber)]'
            : block.type === 'CONTRAINDICATION'
              ? 'border-[var(--crimson-border)] border-t-[var(--crimson)]'
              : 'border-[var(--green-border)] border-t-[var(--green)]'

    const colorClass =
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
      <div
        className={`rounded-[var(--r)] border border-t-[3px] p-[12px_14px] shadow-[var(--shadow-sm)] ${bgClass} ${borderClass}`}
      >
        <div
          className={`mb-1 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] ${colorClass}`}
        >
          {style.label}
        </div>
        <div className="mb-[5px] font-['DM_Sans',sans-serif] text-[14px] font-semibold leading-[1.35] text-[var(--text-primary)]">
          {block.title}
        </div>
        <div className="font-['DM_Sans',sans-serif] text-[12px] leading-[1.55] text-[var(--text-secondary)]">
          {block.body}
        </div>
        {showFeedback && block.feedback && <BlockFeedback feedback={block.feedback} />}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-5 flex h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[var(--r-lg)] bg-[var(--surface)] shadow-[var(--shadow-xl)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="mb-1 font-['DM_Sans',sans-serif] text-[18px] font-semibold text-[var(--text-primary)]">
                Clinical Reasoning Analysis
              </h2>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Detailed feedback on your reasoning
              </p>
            </div>
            {score > 0 && (
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBg()}`}
              >
                <div className={`text-[20px] font-bold ${getScoreColor()}`}>{score}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--r-sm)] border-none bg-transparent text-[var(--text-tertiary)] transition-all hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overall Feedback */}
          {overallFeedback && (
            <div className="mb-6 rounded-[var(--r)] border border-[var(--teal-border)] bg-[var(--teal-light)] p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--teal)]">
                <Info size={14} />
                Overall Assessment
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[13px] leading-[1.7] text-[var(--text-primary)]">
                {overallFeedback}
              </div>
            </div>
          )}

          {/* Your Reasoning with Feedback */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="font-['DM_Sans',sans-serif] text-[14px] font-semibold text-[var(--text-primary)]">
                Your Reasoning
              </h3>
              <span className="text-[11px] text-[var(--text-tertiary)]">
                ({diagramBlocks.length} blocks)
              </span>
            </div>
            <div className="space-y-3">
              {diagramBlocks.map((block) => (
                <div key={block.id}>{renderBlock(block, true)}</div>
              ))}
            </div>
          </div>

          {/* Missing Critical Considerations */}
          {missingBlocks.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-[var(--amber)]" />
                <h3 className="font-['DM_Sans',sans-serif] text-[14px] font-semibold text-[var(--text-primary)]">
                  Missing Considerations
                </h3>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                  ({missingBlocks.length} blocks)
                </span>
              </div>
              <p className="mb-3 text-[12px] text-[var(--text-secondary)]">
                These important considerations should have been included in your reasoning:
              </p>
              <div className="space-y-3">
                {missingBlocks.map((block) => (
                  <div key={block.id}>{renderBlock(block, false)}</div>
                ))}
              </div>
            </div>
          )}

          {/* Good job message if score is high */}
          {score >= 80 && (
            <div className="mt-6 rounded-[var(--r)] border border-[var(--green-border)] bg-[var(--green-light)] p-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--green)]" />
                <div className="font-['DM_Sans',sans-serif] text-[13px] font-semibold text-[var(--green)]">
                  Excellent work!
                </div>
              </div>
              <div className="mt-1 text-[12px] text-[var(--text-secondary)]">
                Your clinical reasoning demonstrates strong analytical skills and comprehensive thinking.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">
          <button
            onClick={() => {
              handleClose()
              dispatch({ type: 'TOGGLE_EXPERT_DIAGRAM' })
            }}
            className="rounded-[var(--r-sm)] border border-[var(--green)] bg-[var(--green-light)] px-4 py-2 font-['DM_Sans',sans-serif] text-[12px] font-semibold text-[var(--green)] transition-all hover:bg-[var(--green)] hover:text-white"
          >
            View Ideal Reasoning
          </button>
          <button
            onClick={handleClose}
            className="rounded-[var(--r-sm)] border border-[var(--border)] bg-transparent px-4 py-2 font-['DM_Sans',sans-serif] text-[12px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--card-hover)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
