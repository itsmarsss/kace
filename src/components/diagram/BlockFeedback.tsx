import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { BlockFeedback as FeedbackType } from '../../services/types'

interface BlockFeedbackProps {
  feedback: FeedbackType
  compact?: boolean
}

export default function BlockFeedback({ feedback, compact = false }: BlockFeedbackProps) {
  const getStatusIcon = () => {
    if (feedback.isCorrect) {
      return <CheckCircle size={14} className="text-[var(--green)]" />
    }
    return <AlertCircle size={14} className="text-[var(--crimson)]" />
  }

  const getTimingIcon = () => {
    if (feedback.timing === 'early') {
      return <Clock size={12} className="text-[var(--amber)]" />
    }
    if (feedback.timing === 'late') {
      return <Clock size={12} className="text-[var(--crimson)]" />
    }
    return null
  }

  const getNecessityBadge = () => {
    if (feedback.necessity === 'unnecessary') {
      return (
        <span className="rounded-[4px] bg-[var(--amber-light)] px-[6px] py-[2px] text-[8px] font-bold uppercase tracking-wider text-[var(--amber)]">
          Extra
        </span>
      )
    }
    if (feedback.necessity === 'missing') {
      return (
        <span className="rounded-[4px] bg-[var(--crimson-light)] px-[6px] py-[2px] text-[8px] font-bold uppercase tracking-wider text-[var(--crimson)]">
          Incomplete
        </span>
      )
    }
    return null
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        {getTimingIcon()}
        {getNecessityBadge()}
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Feedback
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getTimingIcon()}
          {feedback.timing === 'early' && (
            <span className="text-[11px] text-[var(--amber)]">Should be later</span>
          )}
          {feedback.timing === 'late' && (
            <span className="text-[11px] text-[var(--crimson)]">Should be earlier</span>
          )}
          {getNecessityBadge()}
        </div>
      </div>

      {/* Issues */}
      {feedback.issues && feedback.issues.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--crimson)]">
            <AlertTriangle size={12} />
            Issues
          </div>
          <ul className="space-y-2">
            {feedback.issues.map((issue, i) => (
              <li
                key={i}
                className="text-[13px] leading-[1.7] text-[var(--text-secondary)] before:mr-2 before:content-['•']"
              >
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--green)]">
            Suggestions
          </div>
          <ul className="space-y-2">
            {feedback.suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="text-[13px] leading-[1.7] text-[var(--text-secondary)] before:mr-2 before:content-['→']"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
