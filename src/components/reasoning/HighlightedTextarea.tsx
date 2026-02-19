import { useRef, useEffect } from 'react'
import { useMode } from '../../context/ModeProvider'

interface HighlightedTextareaProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  className?: string
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void
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
  const editorRef = useRef<HTMLDivElement>(null)

  // Update contenteditable when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== value) {
      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      const start = range?.startOffset || 0

      editorRef.current.innerText = value

      // Restore cursor position
      if (range && editorRef.current.firstChild) {
        try {
          range.setStart(editorRef.current.firstChild, Math.min(start, value.length))
          range.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(range)
        } catch (e) {
          // Ignore if cursor restoration fails
        }
      }
    }
  }, [value])

  // Scroll to highlighted text when hovering over a block
  useEffect(() => {
    if (hoveredBlock && editorRef.current && hoveredBlock.sourceStart !== undefined) {
      const editor = editorRef.current
      const start = hoveredBlock.sourceStart

      // Calculate approximate line position
      const beforeText = value.substring(0, start)
      const lines = beforeText.split('\n').length
      const lineHeight = 14 * 1.7 // font-size * line-height
      const targetScroll = (lines - 3) * lineHeight // Scroll to show context above

      // Smooth scroll to the target position
      editor.scrollTop = Math.max(0, targetScroll)
    }
  }, [hoveredBlock, value])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerText
    onChange(newValue)
  }

  const renderContent = () => {
    if (
      !hoveredBlock ||
      hoveredBlock.sourceStart === undefined ||
      hoveredBlock.sourceEnd === undefined ||
      !value
    ) {
      return value || ''
    }

    // Get highlight color based on block type
    const highlightColor =
      hoveredBlock.type === 'OBSERVATION'
        ? 'var(--teal-light)'
        : hoveredBlock.type === 'INTERPRETATION'
          ? 'var(--slate-light)'
          : hoveredBlock.type === 'CONSIDERATION'
            ? 'var(--amber-light)'
            : hoveredBlock.type === 'CONTRAINDICATION'
              ? 'var(--crimson-light)'
              : 'var(--green-light)' // DECISION

    const { sourceStart, sourceEnd } = hoveredBlock
    const before = value.substring(0, sourceStart)
    const highlighted = value.substring(sourceStart, sourceEnd)
    const after = value.substring(sourceEnd)

    return (
      <>
        {before}
        <mark
          style={{
            backgroundColor: highlightColor,
            color: 'inherit',
            padding: 0,
            borderRadius: '2px',
          }}
        >
          {highlighted}
        </mark>
        {after}
      </>
    )
  }

  return (
    <div
      ref={editorRef}
      contentEditable={!readOnly}
      onInput={handleInput}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`hide-scrollbar relative h-full w-full resize-none overflow-auto font-['DM_Sans',sans-serif] ${className}`}
      style={{
        color: 'var(--text-primary)',
        padding: '13px 16px',
        fontSize: '14px',
        lineHeight: '1.7',
        borderRadius: 'var(--r)',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        outline: 'none',
      }}
      suppressContentEditableWarning
      data-placeholder={!value ? placeholder : undefined}
    >
      {renderContent()}
    </div>
  )
}
