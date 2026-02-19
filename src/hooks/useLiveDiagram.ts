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
 * Captures snapshots every 10-15 seconds and sends to Claude API
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

  const generateDiagram = useCallback(
    async (snapshot: DiagramSnapshot) => {
      if (isGeneratingRef.current) return

      const previousSnapshot = lastSnapshotRef.current
      const hasChanges =
        !previousSnapshot ||
        previousSnapshot.text !== snapshot.text ||
        previousSnapshot.drugs.join(',') !== snapshot.drugs.join(',')

      if (!hasChanges || !snapshot.text.trim()) return

      isGeneratingRef.current = true

      try {
        // Compute what changed
        const textDiff = computeTextDiff(previousSnapshot?.text || '', snapshot.text)

        console.log('[Live Diagram] Generating update:', {
          previousLength: previousSnapshot?.text.length || 0,
          newLength: snapshot.text.length,
          diff: textDiff,
        })

        // Call Claude API to update diagram
        const result = await updateDiagramIncremental({
          previousText: previousSnapshot?.text || '',
          newText: snapshot.text,
          textDiff,
          currentBlocks: diagramBlocks,
          caseContext: currentCase.systemContext,
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
    if (!reasoningText.trim() || reasoningText.length < 50) {
      return
    }

    // Schedule snapshot after 12 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      const snapshot: DiagramSnapshot = {
        text: reasoningText,
        drugs: selectedDrugs,
        confidence,
        timestamp: Date.now(),
      }

      generateDiagram(snapshot)
    }, 12000) // 12 seconds

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
