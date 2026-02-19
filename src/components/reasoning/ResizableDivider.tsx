import { useState, useRef, useEffect } from 'react'

interface ResizableDividerProps {
  onResize: (topHeight: number) => void
}

export default function ResizableDivider({ onResize }: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      onResize(e.clientY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onResize])

  return (
    <div
      onMouseDown={() => setIsDragging(true)}
      className={`relative h-2 flex-shrink-0 cursor-row-resize ${
        isDragging
          ? 'bg-[var(--teal)]'
          : 'bg-[var(--border)] transition-colors duration-200 hover:bg-[var(--teal)]'
      }`}
    >
      {/* Drag handle indicator */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[3px] w-10 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[var(--border-md)]" />
    </div>
  )
}
