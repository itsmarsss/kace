import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook for Text-to-Speech using Web Speech API
 * @returns {Object} TTS controls and state
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setVoicesLoaded(true)
      }
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!text || !voicesLoaded) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Small delay to ensure cancel completes
    setTimeout(() => {
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Select a male voice for James
      const voices = window.speechSynthesis.getVoices()
      const preferredVoiceNames = [
        'Alex', // macOS
        'Google US English Male',
        'Microsoft David Desktop',
        'Google UK English Male',
      ]

      let selectedVoice = voices.find((voice) =>
        preferredVoiceNames.some((name) => voice.name.includes(name))
      )

      // Fallback to any English male voice
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male')
        )
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      // Set voice properties
      utterance.rate = 0.95
      utterance.pitch = 0.9
      utterance.volume = 1.0

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      utterance.onerror = (event) => {
        console.error('[TTS] Speech synthesis error:', event)
        setIsSpeaking(false)
        utteranceRef.current = null
      }

      // Speak
      window.speechSynthesis.speak(utterance)
    }, 50)
  }, [voicesLoaded])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    utteranceRef.current = null
  }, [])

  const toggle = useCallback(
    (text: string) => {
      if (isSpeaking) {
        stop()
      } else {
        speak(text)
      }
    },
    [isSpeaking, speak, stop]
  )

  return { isSpeaking, speak, stop, toggle }
}
