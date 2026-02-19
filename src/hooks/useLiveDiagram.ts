import { useEffect, useRef, useCallback } from 'react'
import { useMode } from '../context/ModeProvider'
import { updateDiagramIncremental } from '../services/api'

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
  const isGeneratingRef = useRef(false)
  const stepCounterRef = useRef(0)

  const generateDiagram = useCallback(
    async (snapshot: DiagramSnapshot) => {
      if (isGeneratingRef.current) return

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

      isGeneratingRef.current = true

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

        // Call Claude API to update diagram
        const result = await updateDiagramIncremental({
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
        isGeneratingRef.current = false
      }
    },
    [diagramBlocks, currentCase, dispatch]
  )

  // Throttle snapshot capture to every 10-15 seconds
  useEffect(() => {
    // Only run in live mode and before submission
    if (mode !== 'live' || isSubmitted) {
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Don't generate if text is empty or too short
    if (!reasoningText.trim() || reasoningText.length < 100) {
      return
    }

    // Detect if user finished a natural thought (paragraph or sentence)
    const endsWithParagraph = /\n\n\s*$/.test(reasoningText)
    const endsWithSentence = /[.!?]\s*$/.test(reasoningText)
    const hasNaturalBreak = endsWithParagraph || endsWithSentence

    // Use shorter delay if at natural break, longer otherwise
    const delay = hasNaturalBreak ? 8000 : 15000 // 8s or 15s

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

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [reasoningText, selectedDrugs, confidence, mode, isSubmitted, generateDiagram])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Manual trigger function
  const triggerNow = useCallback(() => {
    if (mode !== 'live' || isSubmitted || !reasoningText.trim()) {
      return
    }

    const snapshot: DiagramSnapshot = {
      text: reasoningText,
      drugs: selectedDrugs,
      confidence,
      timestamp: Date.now(),
    }

    generateDiagram(snapshot)
  }, [mode, isSubmitted, reasoningText, selectedDrugs, confidence, generateDiagram])

  return { triggerNow, isGenerating: isGeneratingRef.current }
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
