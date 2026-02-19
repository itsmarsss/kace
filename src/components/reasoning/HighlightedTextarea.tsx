import { useRef, useEffect } from 'react'
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

  // Find text in reasoning with fuzzy matching
  const findTextPosition = (searchText: string, fullText: string): { start: number; end: number } | null => {
    if (!searchText || !fullText) return null

    // 1. Try exact match
    let index = fullText.indexOf(searchText)
    if (index !== -1) {
      return { start: index, end: index + searchText.length }
    }

    // 2. Try case-insensitive match
    const lowerSearch = searchText.toLowerCase()
    const lowerText = fullText.toLowerCase()
    index = lowerText.indexOf(lowerSearch)
    if (index !== -1) {
      return { start: index, end: index + searchText.length }
    }

    // 3. Try normalized whitespace match
    const normalizeWhitespace = (str: string) => str.replace(/\s+/g, ' ').trim()
    const normalizedSearch = normalizeWhitespace(searchText)
    const normalizedLowerSearch = normalizedSearch.toLowerCase()

    // Search through the text with normalized whitespace
    for (let i = 0; i <= fullText.length - normalizedSearch.length; i++) {
      const candidate = fullText.substring(i, i + normalizedSearch.length * 2) // Check longer window
      const normalizedCandidate = normalizeWhitespace(candidate).toLowerCase()

      if (normalizedCandidate.startsWith(normalizedLowerSearch)) {
        // Find the actual end position
        let endPos = i
        let matchedChars = 0
        const searchChars = normalizedSearch.length

        while (endPos < fullText.length && matchedChars < searchChars) {
          if (!/\s/.test(fullText[endPos]) || !/\s/.test(normalizedSearch[matchedChars])) {
            matchedChars++
          }
          endPos++
        }

        return { start: i, end: endPos }
      }
    }

    // 4. Try finding best partial match (at least 80% of the text)
    const minMatchLength = Math.floor(searchText.length * 0.8)
    for (let len = searchText.length; len >= minMatchLength; len--) {
      const substring = searchText.substring(0, len).toLowerCase()
      index = lowerText.indexOf(substring)
      if (index !== -1) {
        return { start: index, end: index + len }
      }
    }

    return null
  }

  // Scroll to highlighted text when hovering over a block
  useEffect(() => {
    if (hoveredBlock && textareaRef.current && hoveredBlock.sourceText && value) {
      const textarea = textareaRef.current

      // Find the actual position using the same fuzzy matching
      const position = findTextPosition(hoveredBlock.sourceText, value)

      if (position) {
        // Calculate approximate line position
        const beforeText = value.substring(0, position.start)
        const lines = beforeText.split('\n').length
        const lineHeight = 14 * 1.7 // font-size * line-height
        const targetScroll = (lines - 3) * lineHeight // Scroll to show context above

        // Smooth scroll to the target position
        textarea.scrollTop = Math.max(0, targetScroll)
      }
    }
  }, [hoveredBlock, value])

  const renderBackdrop = () => {
    // If no highlight or no source text, return empty
    if (!hoveredBlock || !value || !hoveredBlock.sourceText) {
      return null
    }

    const { sourceText, type } = hoveredBlock
    const highlightColor = getHighlightColor(type)

    // Find the text position using fuzzy matching
    const position = findTextPosition(sourceText, value)

    if (!position) {
      // Couldn't find the text, don't highlight
      return null
    }

    const { start, end } = position

    // Split text into parts
    const before = value.substring(0, start)
    const highlighted = value.substring(start, end)
    const after = value.substring(end)

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
