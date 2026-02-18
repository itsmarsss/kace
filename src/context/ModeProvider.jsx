import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { james } from '../data/cases/james'

const ModeContext = createContext()

export const useMode = () => {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('demo') // 'demo' | 'live'
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState([])
  const [revealedVitals, setRevealedVitals] = useState([])
  const [unlockedVitals, setUnlockedVitals] = useState(['vitals']) // Start with vitals unlocked
  const [confidence, setConfidence] = useState(3)
  const [selectedDrugs, setSelectedDrugs] = useState([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [graphOpen, setGraphOpen] = useState(false)
  const [captionsOpen, setCaptionsOpen] = useState(true)
  const [graphNodes, setGraphNodes] = useState([])

  const demoTimersRef = useRef([])
  const currentStepRef = useRef(0)

  // Demo playback engine
  const playDemo = useCallback(() => {
    if (isPlaying) return

    // Reset state
    setMessages([])
    setRevealedVitals([])
    setUnlockedVitals(['vitals'])
    setConfidence(3)
    setSelectedDrugs([])
    setGraphNodes([])
    setShowOverlay(false)
    currentStepRef.current = 0

    // Clear any existing timers
    demoTimersRef.current.forEach(timer => clearTimeout(timer))
    demoTimersRef.current = []

    setIsPlaying(true)

    // Execute demo script with cumulative delay
    let cumulativeDelay = 0

    james.demoScript.forEach((step, stepIndex) => {
      const timer = setTimeout(() => {
        if (step.actor === 'Kace') {
          setMessages(prev => [...prev, {
            type: 'kace',
            text: step.message,
            timestamp: Date.now()
          }])
        } else if (step.actor === 'user') {
          setMessages(prev => [...prev, {
            type: 'user',
            text: step.message,
            timestamp: Date.now()
          }])

          if (step.confidence) {
            setConfidence(step.confidence)
          }
        } else if (step.actor === 'system') {
          if (step.action === 'showCase') {
            setMessages(prev => [...prev, {
              type: 'case-reveal',
              patient: james.patient,
              timestamp: Date.now()
            }])
          } else if (step.action === 'requestVital') {
            setRevealedVitals(prev => [...prev, step.key])
            setMessages(prev => [...prev, {
              type: 'vital-reveal',
              vitalKey: step.key,
              vitalData: james.vitals[step.key],
              timestamp: Date.now()
            }])
            // Add graph node
            const vital = james.vitals[step.key]
            if (vital.graphNode) {
              setGraphNodes(prev => [...prev, vital.graphNode])
            }
          } else if (step.action === 'unlockVital') {
            setUnlockedVitals(prev => [...prev, step.key])
          } else if (step.action === 'showOverlay') {
            setShowOverlay(true)
          }
        }

        // Check if this is the last step
        if (stepIndex === james.demoScript.length - 1) {
          setTimeout(() => setIsPlaying(false), 500)
        }
      }, cumulativeDelay)

      demoTimersRef.current.push(timer)
      cumulativeDelay += step.delay || 1200
    })
  }, [isPlaying])

  const stopDemo = useCallback(() => {
    demoTimersRef.current.forEach(timer => clearTimeout(timer))
    demoTimersRef.current = []
    setIsPlaying(false)
    currentStepRef.current = 0
  }, [])

  const sendMessage = useCallback((text) => {
    if (mode === 'demo') {
      // In demo mode, do nothing (script controls messages)
      return
    }

    // Live mode: add user message and call API
    setMessages(prev => [...prev, {
      type: 'user',
      text,
      timestamp: Date.now()
    }])

    // TODO: Call Claude API
    // For now, just echo back
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'kace',
        text: 'This is a placeholder response. API integration coming soon.',
        timestamp: Date.now()
      }])
    }, 1000)
  }, [mode])

  const requestVital = useCallback((key) => {
    if (mode === 'demo') {
      // Demo mode handles this via script
      return
    }

    // Live mode: reveal vital immediately
    if (!revealedVitals.includes(key)) {
      setRevealedVitals(prev => [...prev, key])
      setMessages(prev => [...prev, {
        type: 'vital-reveal',
        vitalKey: key,
        vitalData: james.vitals[key],
        timestamp: Date.now()
      }])
    }
  }, [mode, revealedVitals])

  const value = {
    mode,
    setMode,
    isPlaying,
    messages,
    revealedVitals,
    unlockedVitals,
    confidence,
    setConfidence,
    selectedDrugs,
    setSelectedDrugs,
    showOverlay,
    setShowOverlay,
    sidebarOpen,
    setSidebarOpen,
    graphOpen,
    setGraphOpen,
    captionsOpen,
    setCaptionsOpen,
    graphNodes,
    setGraphNodes,
    sendMessage,
    requestVital,
    playDemo,
    stopDemo,
    isInputDisabled: isPlaying,
    currentCase: james,
  }

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}
