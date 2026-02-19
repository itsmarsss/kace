import { useCallback } from 'react'
import { useMode } from '../context/ModeProvider'
import { analyzeReasoning } from '../services/api'

/**
 * Hook for analyzing user reasoning and generating diagram
 */
export function useAnalysis() {
  const { reasoningText, selectedDrugs, confidence, currentCase, dispatch } = useMode()

  const submitReasoning = useCallback(async () => {
    // Validation
    if (!reasoningText.trim()) {
      console.warn('No reasoning text to analyze')
      return
    }

    // Start analysis
    dispatch({ type: 'SUBMIT' })

    try {
      // Call API to analyze reasoning
      const result = await analyzeReasoning({
        reasoningText,
        selectedDrugs,
        confidence,
        caseContext: currentCase.systemContext,
      })

      // Update diagram with results
      dispatch({
        type: 'DIAGRAM_READY',
        payload: {
          studentBlocks: result.studentBlocks || result.blocks || [], // Handle legacy format
          expertBlocks: result.expertBlocks || [],
          overallFeedback: result.overallFeedback || '',
          score: result.score || 0,
        },
      })
    } catch (error) {
      console.error('Analysis failed:', error)

      // Show error state
      dispatch({
        type: 'ANALYSIS_FAILED',
      })

      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Analysis failed: ${error.message}`)
      } else {
        alert('Analysis failed. Please check your API key and try again.')
      }
    }
  }, [reasoningText, selectedDrugs, confidence, currentCase, dispatch])

  return {
    submitReasoning,
  }
}
