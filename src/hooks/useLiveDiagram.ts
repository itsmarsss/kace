import { useEffect, useRef, useCallback, useState } from 'react'
import { useMode } from '../context/ModeProvider'
import { updateDiagramWithGemini } from '../services/gemini'

interface DiagramSnapshot {
  text: string
  drugs: string[]
  confidence: number
  timestamp: number
}

/**
 * Hook for live diagram generation as user types
 * Intelligently triggers based on content changes and natural breakpoints
 * Only active in live mode before submission
 */
export function useLiveDiagram() {
  const {
    reasoningText,
    selectedDrugs,
    confidence,
    diagramBlocks,
    currentCase,
    mode,
    isSubmitted,
    dispatch,
  } = useMode()

  const lastSnapshotRef = useRef<DiagramSnapshot | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const scheduledTimeRef = useRef<number>(0) // When the next trigger is scheduled
  const stepCounterRef = useRef(0)

  const [isGenerating, setIsGenerating] = useState(false)
  const [countdown, setCountdown] = useState(0) // Seconds until next auto-trigger

  const generateDiagram = useCallback(
    async (snapshot: DiagramSnapshot) => {
      if (isGenerating) return

      const previousSnapshot = lastSnapshotRef.current
      const previousText = previousSnapshot?.text || ''
      const newText = snapshot.text

      // Check if there are meaningful changes
      const textDiff = newText.length - previousText.length
      const hasSignificantTextChange = Math.abs(textDiff) >= 100 // At least 100 chars changed
      const hasDrugChange =
        previousSnapshot && previousSnapshot.drugs.join(',') !== snapshot.drugs.join(',')

      // Only generate if we have significant changes
      if (!hasSignificantTextChange && !hasDrugChange) {
        console.log('[Live Diagram] Skipping - insufficient changes:', { textDiff })
        return
      }

      if (!snapshot.text.trim()) return

      setIsGenerating(true)
      setCountdown(0) // Clear countdown while generating

      try {
        // Increment step counter
        stepCounterRef.current += 1
        const currentStep = stepCounterRef.current

        // Compute what changed
        const textDiff = computeTextDiff(previousSnapshot?.text || '', snapshot.text)

        console.log('[Live Diagram] Generating update:', {
          step: currentStep,
          previousLength: previousSnapshot?.text.length || 0,
          newLength: snapshot.text.length,
          diff: textDiff,
          selectedDrugs: snapshot.drugs,
        })

        // Call Gemini API to update diagram (fast & cheap for live updates)
        const result = await updateDiagramWithGemini({
          previousText: previousSnapshot?.text || '',
          newText: snapshot.text,
          textDiff,
          currentBlocks: diagramBlocks,
          caseContext: currentCase.systemContext,
          selectedDrugs: snapshot.drugs,
        })

        // Update diagram with new blocks
        dispatch({ type: 'DIAGRAM_READY', payload: result.blocks })

        lastSnapshotRef.current = snapshot
      } catch (error) {
        console.error('[Live Diagram] Generation failed:', error)
        // Don't show error to user for live updates - just log it
      } finally {
        setIsGenerating(false)
      }
    },
    [isGenerating, diagramBlocks, currentCase, dispatch]
  )

  // Throttle snapshot capture to every 8-15 seconds
  useEffect(() => {
    // Only run in live mode and before submission
    if (mode !== 'live' || isSubmitted) {
      setCountdown(0)
      return
    }

    // Clear existing timeout and countdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    // Don't generate if text is empty or too short
    if (!reasoningText.trim() || reasoningText.length < 100) {
      setCountdown(0)
      return
    }

    // Don't schedule if already generating
    if (isGenerating) {
      return
    }

    // Detect if user finished a natural thought (paragraph or sentence)
    const endsWithParagraph = /\n\n\s*$/.test(reasoningText)
    const endsWithSentence = /[.!?]\s*$/.test(reasoningText)
    const hasNaturalBreak = endsWithParagraph || endsWithSentence

    // Use shorter delay if at natural break, longer otherwise
    const delay = hasNaturalBreak ? 8000 : 15000 // 8s or 15s

    // Track when the next trigger is scheduled
    scheduledTimeRef.current = Date.now() + delay

    // Schedule snapshot after period of inactivity
    timeoutRef.current = setTimeout(() => {
      const snapshot: DiagramSnapshot = {
        text: reasoningText,
        drugs: selectedDrugs,
        confidence,
        timestamp: Date.now(),
      }

      generateDiagram(snapshot)
    }, delay)

    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((scheduledTimeRef.current - Date.now()) / 1000))
      setCountdown(remaining)

      if (remaining === 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
      }
    }, 1000)

    // Set initial countdown
    setCountdown(Math.ceil(delay / 1000))

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [reasoningText, selectedDrugs, confidence, mode, isSubmitted, isGenerating, generateDiagram])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // Manual trigger function
  const triggerNow = useCallback(() => {
    if (mode !== 'live' || isSubmitted || !reasoningText.trim()) {
      return
    }

    // Clear scheduled auto-update
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }
    setCountdown(0)

    const snapshot: DiagramSnapshot = {
      text: reasoningText,
      drugs: selectedDrugs,
      confidence,
      timestamp: Date.now(),
    }

    generateDiagram(snapshot)
  }, [mode, isSubmitted, reasoningText, selectedDrugs, confidence, generateDiagram])

  return { triggerNow, isGenerating, countdown }
}

/**
 * Compute a simple text diff showing what was added/removed
 */
function computeTextDiff(oldText: string, newText: string): string {
  if (!oldText) {
    return `Added: "${newText.substring(0, 100)}..."`
  }

  // Simple approach: show what was appended
  if (newText.startsWith(oldText)) {
    const added = newText.substring(oldText.length)
    return `Appended: "${added.substring(0, 100)}${added.length > 100 ? '...' : ''}"`
  }

  // Text was modified (not just appended)
  return `Modified: ${oldText.length} → ${newText.length} chars`
}
