import { useState, useMemo } from 'react'
import { X, Workflow, List, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from '../diagram/DiagramBlock'
import DiagramFlow from '../diagram/DiagramFlow'
import CalibrationBars from './CalibrationBars'
import { compareDiagrams } from '../../utils/diffBlocks'

export default function FeedbackView() {
  const { diagramBlocks, expertBlocks, overallFeedback, score, showFeedbackModal, comparisonResult, dispatch } =
    useMode()
  const [studentLayout, setStudentLayout] = useState<'1d' | '2d'>('1d')
  const [expertLayout, setExpertLayout] = useState<'1d' | '2d'>('1d')
  const [studentLayoutKey, setStudentLayoutKey] = useState(0)
  const [expertLayoutKey, setExpertLayoutKey] = useState(0)

  if (!showFeedbackModal) return null

  // Calculate comparison using diffBlocks utility
  const comparison = useMemo(() => {
    return compareDiagrams(diagramBlocks, expertBlocks)
  }, [diagramBlocks, expertBlocks])

  // Calculate alignment percentage
  const alignmentPercent = useMemo(() => {
    const total = diagramBlocks.length + expertBlocks.length
    if (total === 0) return 0
    const matches = comparison.match.length
    // Calculate based on matched blocks vs total unique blocks
    return Math.round((matches / Math.max(diagramBlocks.length, expertBlocks.length)) * 100)
  }, [comparison, diagramBlocks.length, expertBlocks.length])

  // Map blocks to include diff state and feedback flags
  const studentBlocksWithDiff = useMemo(() => {
    return diagramBlocks.map((block) => {
      const isMatch = comparison.match.some((m) => m.id === block.id)
      const isWrong = comparison.wrong.some((w) => w.id === block.id)
      return {
        ...block,
        diffState: isMatch ? 'match' : isWrong ? 'wrong' : null,
        showFeedback: true, // Student blocks show feedback
      }
    })
  }, [diagramBlocks, comparison])

  const expertBlocksWithDiff = useMemo(() => {
    return expertBlocks.map((block) => {
      const isMissed = comparison.miss.some((m) => m.id === block.id)
      return {
        ...block,
        diffState: isMissed ? 'miss' : 'match',
        showFeedback: false, // Expert blocks don't show feedback
      }
    })
  }, [expertBlocks, comparison])

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
                <DiagramBlock
                  key={block.id}
                  block={block}
                  index={index}
                  showFeedback={showFeedback}
                  diffState={block.diffState}
                />
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

        {/* Comparison Statistics */}
        <div className="mx-6 mb-4 flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--green-border)] bg-[var(--green-light)] p-3">
            <CheckCircle size={18} className="text-[var(--green)]" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--green)]">
                Correct
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {comparison.match.length}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--amber-border)] bg-[var(--amber-light)] p-3">
            <AlertTriangle size={18} className="text-[var(--amber)]" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--amber)]">
                Missed
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {comparison.miss.length}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--crimson-border)] bg-[var(--crimson-light)] p-3">
            <XCircle size={18} className="text-[var(--crimson)]" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--crimson)]">
                Incorrect
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {comparison.wrong.length}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--teal-light)] text-[10px] font-bold text-[var(--teal)]">
              %
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Alignment
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {alignmentPercent}%
              </div>
            </div>
          </div>
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

        {/* Insights from comparison */}
        {comparisonResult?.insights && comparisonResult.insights.length > 0 && (
          <div className="mx-6 mb-4 space-y-2">
            {comparisonResult.insights.map((insight, index) => (
              <div
                key={index}
                className="rounded-[var(--r)] border border-l-[3px] border-[var(--teal-border)] border-l-[var(--teal)] bg-[var(--teal-light)] p-3 font-['DM_Sans',sans-serif] text-[13px] leading-[1.7] text-[var(--text-primary)]"
              >
                {insight}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content - side by side diagrams */}
      <div className="flex flex-1 overflow-hidden">
        {/* Student's reasoning */}
        <div className="flex w-1/2 flex-col border-r border-[var(--border)]">
          {renderDiagramSection(
            'Your Reasoning',
            studentBlocksWithDiff,
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
            expertBlocksWithDiff,
            expertLayout,
            setExpertLayout,
            expertLayoutKey,
            setExpertLayoutKey,
            false // No feedback on expert blocks
          )}
        </div>
      </div>

      {/* Confidence Calibration at bottom */}
      {comparisonResult && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4">
          <div className="mb-3 font-['DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Confidence Calibration
          </div>
          <CalibrationBars />
        </div>
      )}
    </div>
  )
}
