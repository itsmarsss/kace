import { useState, useEffect, useRef } from 'react'
import { getCartesiaTTS } from '../services/cartesia'

/**
 * Custom hook for Text-to-Speech using Cartesia WebSocket streaming
 * @returns {Object} TTS controls and state
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const ttsRef = useRef(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (ttsRef.current) {
        ttsRef.current.disconnect()
      }
    }
  }, [])

  const speak = async (text) => {
    try {
      // Stop any ongoing speech
      if (ttsRef.current) {
        ttsRef.current.stop()
      }

      // Get or create Cartesia TTS instance
      const tts = getCartesiaTTS()
      ttsRef.current = tts

      setIsSpeaking(true)

      // Speak with Cartesia
      await tts.speak(text)

      // Update state when done
      setTimeout(() => {
        if (!tts.getIsPlaying()) {
          setIsSpeaking(false)
        }
      }, 500)
    } catch (error) {
      console.error('TTS error:', error)
      setIsSpeaking(false)
    }
  }

  const stop = () => {
    if (ttsRef.current) {
      ttsRef.current.stop()
    }
    setIsSpeaking(false)
  }

  const toggle = (text) => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text)
    }
  }

  return { isSpeaking, speak, stop, toggle }
}
