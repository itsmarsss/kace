import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for Speech-to-Text using Web Speech API
 * @returns {Object} STT controls and state
 */
export function useSTT(onFinalTranscript?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldListenRef = useRef(false)

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcriptPiece + ' '
        } else {
          interim += transcriptPiece
        }
      }

      if (final && onFinalTranscript) {
        onFinalTranscript(final)
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setIsListening(false)
        shouldListenRef.current = false
      }
    }

    recognition.onend = () => {
      setInterimTranscript('')
      // Restart if we should still be listening
      if (shouldListenRef.current) {
        try {
          recognition.start()
        } catch (error) {
          console.error('Failed to restart recognition:', error)
        }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition

    return () => {
      shouldListenRef.current = false
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onFinalTranscript])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setInterimTranscript('')
      shouldListenRef.current = true
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      shouldListenRef.current = false
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript('')
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  }
}
