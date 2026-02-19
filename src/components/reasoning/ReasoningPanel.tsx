import { useState, useCallback } from 'react'
import CaseIntroCard from './CaseIntroCard'
import ReasoningInput from './ReasoningInput'
import ResizableDivider from './ResizableDivider'

export default function ReasoningPanel() {
  const [topHeight, setTopHeight] = useState(35) // percentage

  const handleResize = useCallback((clientY: number) => {
    const panelElement = document.getElementById('reasoning-panel')
    if (!panelElement) return

    const rect = panelElement.getBoundingClientRect()
    const relativeY = clientY - rect.top
    const percentage = (relativeY / rect.height) * 100

    // Clamp between 20% and 70%
    const clampedPercentage = Math.max(20, Math.min(70, percentage))
    setTopHeight(clampedPercentage)
  }, [])

  return (
    <div id="reasoning-panel" className="flex h-full w-full flex-col bg-[var(--teal-light)]">
      {/* Top: Case Brief (scrollable) */}
      <div className="min-h-[20%] overflow-y-auto" style={{ height: `${topHeight}%` }}>
        <CaseIntroCard />
      </div>

      {/* Draggable divider */}
      <ResizableDivider onResize={handleResize} />

      {/* Bottom: Treatment Reference + Drug Selection + Reasoning (scrollable) */}
      <div className="min-h-[30%]" style={{ height: `${100 - topHeight}%` }}>
        <ReasoningInput />
      </div>
    </div>
  )
}
