import { useState, useCallback, useRef, useEffect } from 'react'
import { getCartesiaSTT } from '../services/cartesiaSTT'

/**
 * Custom hook for Speech-to-Text using Cartesia streaming STT
 * @param onFinalTranscript - Callback when final transcript is received
 * @returns {Object} STT controls and state
 */
export function useSTT(onFinalTranscript?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const sttRef = useRef<any>(null)
  const shouldListenRef = useRef(false)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (sttRef.current) {
        sttRef.current.disconnect()
      }
    }
  }, [])

  const startListening = useCallback(async () => {
    try {
      console.log('[useSTT] Starting listening')
      shouldListenRef.current = true

      // Get or create Cartesia STT instance
      const stt = getCartesiaSTT()
      sttRef.current = stt

      // Set up callbacks
      stt.options.onTranscript = (text: string, isFinal: boolean) => {
        if (isFinal) {
          console.log('[useSTT] Final transcript:', text)
          setInterimTranscript('')
          onFinalTranscript?.(text)
        } else {
          console.log('[useSTT] Interim transcript:', text)
          setInterimTranscript(text)
        }
      }

      stt.options.onError = (error: Error) => {
        console.error('[useSTT] Error:', error)
        setIsListening(false)
        setInterimTranscript('')
        shouldListenRef.current = false
      }

      stt.options.onComplete = () => {
        console.log('[useSTT] Complete')
        setIsListening(false)
        setInterimTranscript('')
      }

      // Start recording
      await stt.startRecording()
      setIsListening(true)
    } catch (error) {
      console.error('[useSTT] Failed to start:', error)
      setIsListening(false)
      shouldListenRef.current = false
    }
  }, [onFinalTranscript])

  const stopListening = useCallback(() => {
    console.log('[useSTT] Stopping listening')
    shouldListenRef.current = false

    if (sttRef.current) {
      sttRef.current.stopRecording()
    }

    setIsListening(false)
    setInterimTranscript('')
  }, [])

  const toggleListening = useCallback(async () => {
    if (isListening) {
      stopListening()
    } else {
      await startListening()
    }
  }, [isListening, startListening, stopListening])

  return { isListening, interimTranscript, toggleListening }
}
