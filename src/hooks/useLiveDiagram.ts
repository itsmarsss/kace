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
  const stepCounterRef = useRef(0)
  const lastCheckedTextRef = useRef('') // Track text from last check

  // Store current values in refs for interval access
  const reasoningTextRef = useRef(reasoningText)
  const selectedDrugsRef = useRef(selectedDrugs)
  const confidenceRef = useRef(confidence)
  const diagramBlocksRef = useRef(diagramBlocks)

  const [isGenerating, setIsGenerating] = useState(false)
  const [countdown, setCountdown] = useState(0) // Seconds until next auto-trigger

  // Update refs when values change
  useEffect(() => {
    reasoningTextRef.current = reasoningText
    selectedDrugsRef.current = selectedDrugs
    confidenceRef.current = confidence
    diagramBlocksRef.current = diagramBlocks
  }, [reasoningText, selectedDrugs, confidence, diagramBlocks])

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
          currentBlocks: diagramBlocksRef.current,
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

  // Generate every 10 seconds regardless of edits
  useEffect(() => {
    // Only run in live mode and before submission
    if (mode !== 'live' || isSubmitted) {
      setCountdown(0)
      return
    }

    let nextTriggerTime = Date.now() + 10000

    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((nextTriggerTime - Date.now()) / 1000))
      setCountdown(remaining)
    }, 1000)

    // Generate every 10 seconds
    timeoutRef.current = setInterval(() => {
      const currentText = reasoningTextRef.current
      const currentDrugs = selectedDrugsRef.current
      const currentConfidence = confidenceRef.current

      // Skip if empty, too short, already generating, or no changes
      if (!currentText.trim() || currentText.length < 100 || isGenerating) {
        return
      }

      // Only generate if text has changed since last check
      if (currentText === lastCheckedTextRef.current) {
        return
      }

      lastCheckedTextRef.current = currentText

      const snapshot: DiagramSnapshot = {
        text: currentText,
        drugs: currentDrugs,
        confidence: currentConfidence,
        timestamp: Date.now(),
      }

      generateDiagram(snapshot)
      nextTriggerTime = Date.now() + 10000
    }, 10000) as any

    setCountdown(10)

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [mode, isSubmitted]) // Only depend on mode and submission status

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
