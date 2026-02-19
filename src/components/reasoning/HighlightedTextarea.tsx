import { useRef, useEffect, useState } from 'react'
import { useMode } from '../../context/ModeProvider'

interface HighlightedTextareaProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  className?: string
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
}

export default function HighlightedTextarea({
  value,
  onChange,
  readOnly,
  placeholder,
  className,
  onFocus,
  onBlur,
}: HighlightedTextareaProps) {
  const { hoveredBlock } = useMode()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  // Sync scroll position between textarea and highlight layer
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      const scrollTop = textareaRef.current.scrollTop
      setScrollTop(scrollTop)
      highlightRef.current.scrollTop = scrollTop
    }
  }

  // Scroll to highlighted text when hovering over a block
  useEffect(() => {
    if (hoveredBlock && textareaRef.current && hoveredBlock.sourceStart !== undefined) {
      const textarea = textareaRef.current
      const start = hoveredBlock.sourceStart

      // Calculate approximate line position
      const beforeText = value.substring(0, start)
      const lines = beforeText.split('\n').length
      const lineHeight = 14 * 1.7 // font-size * line-height
      const targetScroll = (lines - 3) * lineHeight // Scroll to show context above

      // Smooth scroll to the target position
      textarea.scrollTop = Math.max(0, targetScroll)
    }
  }, [hoveredBlock, value])

  const renderHighlightedText = () => {
    if (!hoveredBlock || hoveredBlock.sourceStart === undefined || hoveredBlock.sourceEnd === undefined) {
      // No highlighting - render text (will be transparent via parent style)
      return <span>{value}&nbsp;</span>
    }

    const { sourceStart, sourceEnd } = hoveredBlock
    const before = value.substring(0, sourceStart)
    const highlighted = value.substring(sourceStart, sourceEnd)
    const after = value.substring(sourceEnd)

    return (
      <>
        <span>{before}</span>
        <mark className="bg-[var(--teal-light)]">{highlighted}</mark>
        <span>{after}&nbsp;</span>
      </>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Background layer with highlighted text */}
      <div
        ref={highlightRef}
        className="absolute inset-0 overflow-hidden whitespace-pre-wrap break-words font-['DM_Sans',sans-serif]"
        style={{
          pointerEvents: 'none',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          color: 'transparent',
          padding: '13px 16px',
          fontSize: '14px',
          lineHeight: '1.7',
          borderRadius: 'var(--r)',
        }}
      >
        {renderHighlightedText()}
      </div>

      {/* Actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`relative h-full w-full resize-none bg-transparent font-['DM_Sans',sans-serif] ${className}`}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          color: 'var(--text-primary)',
          zIndex: 1,
          padding: '13px 16px',
          fontSize: '14px',
          lineHeight: '1.7',
          borderRadius: 'var(--r)',
        }}
      />
    </div>
  )
}
