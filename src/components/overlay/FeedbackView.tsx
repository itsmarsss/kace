import { useState } from 'react'
import { X, Workflow, List, RefreshCw, AlertTriangle } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from '../diagram/DiagramBlock'
import DiagramFlow from '../diagram/DiagramFlow'

export default function FeedbackView() {
  const { diagramBlocks, expertBlocks, overallFeedback, score, showFeedbackModal, dispatch } = useMode()
  const [studentLayout, setStudentLayout] = useState<'1d' | '2d'>('1d')
  const [expertLayout, setExpertLayout] = useState<'1d' | '2d'>('1d')
  const [studentLayoutKey, setStudentLayoutKey] = useState(0)
  const [expertLayoutKey, setExpertLayoutKey] = useState(0)

  if (!showFeedbackModal) return null

  // Find missing blocks
  const missingBlocks = expertBlocks.filter((expertBlock) => {
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

  const renderDiagramSection = (
    title: string,
    blocks: any[],
    layout: '1d' | '2d',
    setLayout: (layout: '1d' | '2d') => void,
    layoutKey: number,
    setLayoutKey: (key: number) => void,
    showFeedback: boolean = false
  ) => {
    const is2D = layout === '2d'

    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div>
            <div className="font-['DM_Sans',sans-serif] text-[13px] font-semibold text-[var(--text-primary)]">
              {title}
            </div>
            <div className="font-['DM_Sans',sans-serif] text-[10px] text-[var(--text-tertiary)]">
              {blocks.length} blocks
            </div>
          </div>

          {/* Layout toggle */}
          <div className="flex gap-1 rounded-[var(--r-sm)] bg-[var(--muted-bg)] p-[2px]">
            <button
              onClick={() => setLayout('1d')}
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
              onClick={() => setLayout('2d')}
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
              onClick={() => setLayoutKey(layoutKey + 1)}
              className="flex h-7 cursor-pointer items-center gap-1 rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-medium text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
              title="Re-organize diagram layout"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>

        {/* Diagram area */}
        <div className={`relative flex-1 ${is2D ? '' : 'overflow-y-auto overflow-x-hidden p-4'}`}>
          {blocks.length === 0 ? (
            <div className="flex h-full items-center justify-center p-5 text-center font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-tertiary)]">
              No blocks to display
            </div>
          ) : is2D ? (
            <DiagramFlow key={layoutKey} blocks={blocks} />
          ) : (
            <div className="flex flex-col gap-4">
              {blocks.map((block, index) => (
                <DiagramBlock key={block.id} block={block} index={index} showFeedback={showFeedback} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-[var(--surface)]">
      {/* Top bar with overall feedback */}
      <div className="flex flex-col border-b border-[var(--border)] bg-[var(--surface)]">
        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="mb-1 font-['DM_Sans',sans-serif] text-[20px] font-bold text-[var(--text-primary)]">
                Clinical Reasoning Analysis
              </h1>
              <p className="text-[12px] text-[var(--text-tertiary)]">
                Compare your reasoning with the ideal approach
              </p>
            </div>
            {score > 0 && (
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBg()}`}>
                <div className={`text-[20px] font-bold ${getScoreColor()}`}>{score}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--r-sm)] border-none bg-transparent text-[var(--text-tertiary)] transition-all hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Overall feedback */}
        {overallFeedback && (
          <div className="mx-6 mb-4 rounded-[var(--r)] border border-[var(--teal-border)] bg-[var(--teal-light)] p-4">
            <div className="mb-1 font-['DM_Sans',sans-serif] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--teal)]">
              Overall Assessment
            </div>
            <div className="font-['DM_Sans',sans-serif] text-[13px] leading-[1.7] text-[var(--text-primary)]">
              {overallFeedback}
            </div>
          </div>
        )}

        {/* Missing blocks warning */}
        {missingBlocks.length > 0 && (
          <div className="mx-6 mb-4 rounded-[var(--r)] border border-[var(--amber-border)] bg-[var(--amber-light)] p-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--amber)]">
              <AlertTriangle size={14} />
              {missingBlocks.length} critical consideration{missingBlocks.length !== 1 ? 's' : ''} missing from
              your reasoning
            </div>
          </div>
        )}
      </div>

      {/* Main content - side by side diagrams */}
      <div className="flex flex-1 overflow-hidden">
        {/* Student's reasoning */}
        <div className="flex w-1/2 flex-col border-r border-[var(--border)]">
          {renderDiagramSection(
            'Your Reasoning',
            diagramBlocks,
            studentLayout,
            setStudentLayout,
            studentLayoutKey,
            setStudentLayoutKey,
            true // Show feedback on student blocks
          )}
        </div>

        {/* Ideal reasoning */}
        <div className="flex w-1/2 flex-col">
          {renderDiagramSection(
            'Ideal Reasoning',
            expertBlocks,
            expertLayout,
            setExpertLayout,
            expertLayoutKey,
            setExpertLayoutKey,
            false // No feedback on expert blocks
          )}
        </div>
      </div>
    </div>
  )
}
