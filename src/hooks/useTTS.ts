import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for Text-to-Speech using Web Speech API
 * @returns {Object} TTS controls and state
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef(null)
  const voiceRef = useRef(null)

  useEffect(() => {
    // Voice list is async — cache preferred voice after it loads
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      // Prefer en-GB Daniel voice if available
      voiceRef.current =
        voices.find((v) => v.lang === 'en-GB' && /daniel/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null
    }

    window.speechSynthesis.onvoiceschanged = setVoice
    setVoice() // Call immediately in case already loaded

    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.88
    utterance.pitch = 0.95

    if (voiceRef.current) {
      utterance.voice = voiceRef.current
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
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
