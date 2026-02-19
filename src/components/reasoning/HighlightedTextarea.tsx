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
  const backdropRef = useRef<HTMLDivElement>(null)

  // Sync scroll between textarea and backdrop
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
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

  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'OBSERVATION':
        return 'var(--teal-light)'
      case 'INTERPRETATION':
        return 'var(--slate-light)'
      case 'CONSIDERATION':
        return 'var(--amber-light)'
      case 'CONTRAINDICATION':
        return 'var(--crimson-light)'
      case 'DECISION':
        return 'var(--green-light)'
      default:
        return 'transparent'
    }
  }

  const renderBackdrop = () => {
    // If no highlight, return empty backdrop with proper spacing
    if (
      !hoveredBlock ||
      hoveredBlock.sourceStart === undefined ||
      hoveredBlock.sourceEnd === undefined ||
      !value
    ) {
      return null
    }

    const { sourceStart, sourceEnd, type } = hoveredBlock
    const highlightColor = getHighlightColor(type)

    // Split text into parts
    const before = value.substring(0, sourceStart)
    const highlighted = value.substring(sourceStart, sourceEnd)
    const after = value.substring(sourceEnd)

    return (
      <>
        <span style={{ opacity: 0 }}>{before}</span>
        <mark
          style={{
            backgroundColor: highlightColor,
            color: 'transparent',
            margin: 0,
            padding: 0,
            border: 'none',
          }}
        >
          {highlighted}
        </mark>
        <span style={{ opacity: 0 }}>{after}</span>
      </>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Backdrop with highlights */}
      <div
        ref={backdropRef}
        className="absolute inset-0 overflow-hidden font-['DM_Sans',sans-serif]"
        style={{
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          padding: '13px 16px',
          fontSize: '14px',
          lineHeight: '1.7',
          borderRadius: 'var(--r)',
          border: '1px solid transparent', // Match textarea border
        }}
        aria-hidden="true"
      >
        {renderBackdrop()}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`hide-scrollbar relative h-full w-full resize-none bg-transparent font-['DM_Sans',sans-serif] ${className}`}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          color: 'var(--text-primary)',
          zIndex: 1,
          padding: '13px 16px',
          fontSize: '14px',
          lineHeight: '1.7',
          borderRadius: 'var(--r)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      />
    </div>
  )
}
