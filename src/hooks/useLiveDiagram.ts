import { useEffect, useRef, useCallback } from 'react'
import { useMode } from '../context/ModeProvider'

interface DiagramSnapshot {
  text: string
  drugs: string[]
  confidence: number
  timestamp: number
}

/**
 * Hook for live diagram generation as user types
 * Captures snapshots every 10-15 seconds and sends to Claude API
 */
export function useLiveDiagram() {
  const { reasoningText, selectedDrugs, confidence, diagramBlocks, dispatch } = useMode()

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

        // Prepare context for Claude
        const context = {
          previousText: previousSnapshot?.text || '',
          newText: snapshot.text,
          textDiff,
          currentDiagram: diagramBlocks,
          selectedDrugs: snapshot.drugs,
          confidence: snapshot.confidence,
          timestamp: snapshot.timestamp,
        }

        // TODO: Call Claude API
        // const updatedBlocks = await callClaudeAPI(context)
        console.log('[Live Diagram] Generating with context:', context)

        // For now, simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // TODO: Update diagram with new blocks
        // dispatch({ type: 'UPDATE_DIAGRAM', payload: updatedBlocks })

        lastSnapshotRef.current = snapshot
      } catch (error) {
        console.error('[Live Diagram] Generation failed:', error)
      } finally {
        isGeneratingRef.current = false
      }
    },
    [diagramBlocks, dispatch]
  )

  // Throttle snapshot capture to every 10-15 seconds
  useEffect(() => {
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
  }, [reasoningText, selectedDrugs, confidence, generateDiagram])

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
