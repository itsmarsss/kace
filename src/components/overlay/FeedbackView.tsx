import { useState, useMemo } from 'react'
import { X, Workflow, List, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import DiagramBlock from '../diagram/DiagramBlock'
import DiagramFlow from '../diagram/DiagramFlow'
import CalibrationBars from './CalibrationBars'

export default function FeedbackView() {
  const {
    diagramBlocks,
    expertBlocks,
    overallFeedback,
    score,
    showFeedbackModal,
    comparisonResult,
    isAnalyzing,
    dispatch,
  } = useMode()
  const [studentLayout, setStudentLayout] = useState<'1d' | '2d'>('1d')
  const [expertLayout, setExpertLayout] = useState<'1d' | '2d'>('1d')
  const [studentLayoutKey, setStudentLayoutKey] = useState(0)
  const [expertLayoutKey, setExpertLayoutKey] = useState(0)

  // All hooks must be called before any conditional returns!
  // Calculate feedback statistics from student blocks
  const feedbackStats = useMemo(() => {
    let accurate = 0
    let needsReview = 0
    let totalIssues = 0
    let totalSuggestions = 0

    diagramBlocks.forEach((block) => {
      if (block.feedback) {
        if (block.feedback.isCorrect) {
          accurate++
        } else {
          needsReview++
        }
        totalIssues += block.feedback.issues?.length || 0
        totalSuggestions += block.feedback.suggestions?.length || 0
      }
    })

    return { accurate, needsReview, totalIssues, totalSuggestions }
  }, [diagramBlocks])

  // Count additional insights from expert blocks
  const additionalInsights = expertBlocks.length

  // Early returns AFTER all hooks
  if (!showFeedbackModal) return null

  // Show analyzing loader
  if (isAnalyzing) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface)]">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--teal)]" />
          <div className="font-['DM_Sans',sans-serif] text-[16px] font-semibold text-[var(--text-primary)]">
            Analyzing your reasoning...
          </div>
          <div className="mt-2 font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-tertiary)]">
            Comparing with expert clinical thinking
          </div>
        </div>
      </div>
    )
  }

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
    setLayoutKey: (key: number) => void
  ) => {
    const is2D = layout === '2d'

    return (
      <div className="flex h-full flex-col">
        {/* Section header */}
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
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
        <div className={`relative flex-1 overflow-hidden ${is2D ? '' : 'overflow-y-auto p-4'}`}>
          {blocks.length === 0 ? (
            <div className="flex h-full items-center justify-center p-5 text-center font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-tertiary)]">
              No blocks to display
            </div>
          ) : is2D ? (
            <DiagramFlow key={layoutKey} blocks={blocks} />
          ) : (
            <div className="flex flex-col gap-4">
              {blocks.map((block, index) => (
                <DiagramBlock key={block.id} block={block} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-[var(--surface)]">
      {/* Top bar with overall feedback */}
      <div className="flex flex-shrink-0 flex-col border-b border-[var(--border)] bg-[var(--surface)]">
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
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBg()}`}
              >
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

        {/* Feedback Statistics */}
        <div className="mx-6 mb-4 flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--green-border)] bg-[var(--green-light)] p-3">
            <CheckCircle size={18} className="text-[var(--green)]" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--green)]">
                Accurate
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {feedbackStats.accurate}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--amber-border)] bg-[var(--amber-light)] p-3">
            <AlertTriangle size={18} className="text-[var(--amber)]" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--amber)]">
                Needs Review
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {feedbackStats.needsReview}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--teal-border)] bg-[var(--teal-light)] p-3">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--teal)] text-[10px] font-bold text-white">
              +
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--teal)]">
                Additional Insights
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {additionalInsights}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--slate-light)] text-[10px] font-bold text-[var(--slate)]">
              ✓
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Score
              </div>
              <div className="font-['DM_Sans',sans-serif] text-[16px] font-bold text-[var(--text-primary)]">
                {score}/100
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
      <div className="flex h-[calc(100vh-52px)] flex-shrink-0 overflow-hidden">
        {/* Student's reasoning */}
        <div className="flex h-full w-1/2 flex-col overflow-hidden border-r border-[var(--border)]">
          {renderDiagramSection(
            'Your Reasoning',
            diagramBlocks,
            studentLayout,
            setStudentLayout,
            studentLayoutKey,
            setStudentLayoutKey
          )}
        </div>

        {/* Ideal reasoning */}
        <div className="flex h-full w-1/2 flex-col overflow-hidden">
          {renderDiagramSection(
            'Ideal Reasoning',
            expertBlocks,
            expertLayout,
            setExpertLayout,
            expertLayoutKey,
            setExpertLayoutKey
          )}
        </div>
      </div>

      {/* Confidence Calibration at bottom */}
      {comparisonResult && (
        <div className="flex-shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4">
          <div className="mb-3 font-['DM_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Confidence Calibration
          </div>
          <CalibrationBars />
        </div>
      )}
    </div>
  )
}
