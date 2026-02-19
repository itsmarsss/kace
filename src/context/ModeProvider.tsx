import { createContext, useContext, useReducer, useCallback, useRef, Dispatch } from 'react'
import { james } from '../data/cases/james'
import { ComparisonResult } from '../utils/compareReasoning'
import { DiagramBlock } from '../services/api'

interface ModeState {
  mode: 'demo' | 'live'
  isPlaying: boolean
  reasoningText: string
  confidence: number
  selectedDrugs: string[]
  sessionState: 'idle' | 'analyzing' | 'reviewed' | 'expert'
  isAnalyzing: boolean
  isSubmitted: boolean
  diagramBlocks: DiagramBlock[] // Student's blocks (with feedback in live mode)
  expertBlocks: DiagramBlock[] // Expert/ideal blocks
  overallFeedback: string // Overall analysis feedback
  score: number // Overall score 0-100
  showExpertDiagram: boolean // Toggle between student and expert diagram
  showFeedbackModal: boolean // Show detailed feedback modal
  diagramOpen: boolean
  diagramLayout: '1d' | '2d'
  showOverlay: boolean
  showPatientFullscreen: boolean
  showDiagramFullscreen: boolean
  currentSpeechLine: number
  comparisonResult: ComparisonResult | null
  hoveredBlock: DiagramBlock | null
  selectedBlock: DiagramBlock | null
}

interface ModeAction {
  type: string
  payload?: any
}

interface ModeContextType extends ModeState {
  dispatch: Dispatch<ModeAction>
  playDemo: () => void
  stopDemo: () => void
  currentCase: typeof james
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export const useMode = () => {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}

// Session states: 'idle' | 'analyzing' | 'reviewed' | 'expert'
const initialState: ModeState = {
  mode: 'demo', // 'demo' | 'live'
  isPlaying: false,
  reasoningText: '',
  confidence: 3,
  selectedDrugs: [],
  sessionState: 'idle',
  isAnalyzing: false,
  isSubmitted: false,
  diagramBlocks: [],
  expertBlocks: [],
  overallFeedback: '',
  score: 0,
  showExpertDiagram: false,
  showFeedbackModal: false,
  diagramOpen: false,
  diagramLayout: '1d', // '1d' | '2d'
  showOverlay: false,
  showPatientFullscreen: false,
  showDiagramFullscreen: false,
  currentSpeechLine: 0,
  comparisonResult: null,
  hoveredBlock: null,
  selectedBlock: null,
}

function modeReducer(state: ModeState, action: ModeAction): ModeState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload }

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }

    case 'SET_REASONING_TEXT':
      return { ...state, reasoningText: action.payload }

    case 'APPEND_REASONING_TEXT':
      return { ...state, reasoningText: state.reasoningText + action.payload }

    case 'SET_CONFIDENCE':
      return { ...state, confidence: action.payload }

    case 'SET_SELECTED_DRUGS':
      return { ...state, selectedDrugs: action.payload }

    case 'TOGGLE_DRUG':
      const isSelected = state.selectedDrugs.includes(action.payload)
      return {
        ...state,
        selectedDrugs: isSelected
          ? state.selectedDrugs.filter((d) => d !== action.payload)
          : [...state.selectedDrugs, action.payload],
      }

    case 'SET_SESSION_STATE':
      return { ...state, sessionState: action.payload }

    case 'SET_ANALYZING':
      return {
        ...state,
        isAnalyzing: action.payload,
        sessionState: action.payload ? 'analyzing' : state.sessionState,
      }

    case 'SUBMIT':
      return {
        ...state,
        isSubmitted: true,
        sessionState: 'analyzing',
        isAnalyzing: true,
      }

    case 'DIAGRAM_READY':
      return {
        ...state,
        isAnalyzing: false,
        sessionState: 'reviewed',
        diagramBlocks: action.payload.studentBlocks || action.payload, // Handle both new and legacy format
        expertBlocks: action.payload.expertBlocks || [],
        overallFeedback: action.payload.overallFeedback || '',
        score: action.payload.score || 0,
        diagramOpen: true,
        // Show feedback modal in live mode when we have feedback
        showFeedbackModal:
          state.mode === 'live' &&
          (action.payload.overallFeedback || action.payload.score > 0 || action.payload.expertBlocks?.length > 0),
      }

    case 'ADD_DIAGRAM_BLOCK':
      return {
        ...state,
        diagramBlocks: [...state.diagramBlocks, action.payload],
        diagramOpen: true,
      }

    case 'UPDATE_BLOCK_CONNECTION':
      return {
        ...state,
        diagramBlocks: state.diagramBlocks.map((block) =>
          block.id === action.payload.from
            ? { ...block, connects_to: [...(block.connects_to || []), action.payload.to] }
            : block
        ),
      }

    case 'ANALYSIS_FAILED':
      return {
        ...state,
        isAnalyzing: false,
        sessionState: 'reviewed',
        diagramBlocks: [],
        diagramOpen: false,
      }

    case 'TOGGLE_DIAGRAM':
      return { ...state, diagramOpen: !state.diagramOpen }

    case 'SET_DIAGRAM_LAYOUT':
      return { ...state, diagramLayout: action.payload }

    case 'SHOW_OVERLAY':
      return {
        ...state,
        showOverlay: true,
        sessionState: 'expert',
        comparisonResult: action.payload || null,
      }

    case 'HIDE_OVERLAY':
      return { ...state, showOverlay: false, sessionState: 'reviewed' }

    case 'TOGGLE_PATIENT_FULLSCREEN':
      return { ...state, showPatientFullscreen: !state.showPatientFullscreen }

    case 'TOGGLE_DIAGRAM_FULLSCREEN':
      return { ...state, showDiagramFullscreen: !state.showDiagramFullscreen }

    case 'SET_SPEECH_LINE':
      return { ...state, currentSpeechLine: action.payload }

    case 'NEXT_SPEECH_LINE':
      return {
        ...state,
        currentSpeechLine: Math.min(state.currentSpeechLine + 1, james.speechLines.length - 1),
      }

    case 'PREV_SPEECH_LINE':
      return {
        ...state,
        currentSpeechLine: Math.max(state.currentSpeechLine - 1, 0),
      }

    case 'SET_HOVERED_BLOCK':
      return { ...state, hoveredBlock: action.payload }

    case 'SET_SELECTED_BLOCK':
      return { ...state, selectedBlock: action.payload }

    case 'TOGGLE_EXPERT_DIAGRAM':
      return { ...state, showExpertDiagram: !state.showExpertDiagram }

    case 'SHOW_FEEDBACK_MODAL':
      return { ...state, showFeedbackModal: true }

    case 'HIDE_FEEDBACK_MODAL':
      return { ...state, showFeedbackModal: false }

    case 'RESET':
      return {
        ...initialState,
        mode: state.mode, // Preserve mode
      }

    default:
      return state
  }
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(modeReducer, initialState)
  const demoTimersRef = useRef<NodeJS.Timeout[]>([])

  // Demo playback engine for v3 workflow
  const playDemo = useCallback(() => {
    if (state.isPlaying) return

    // Reset state
    dispatch({ type: 'RESET' })

    // Clear any existing timers
    demoTimersRef.current.forEach((timer) => clearTimeout(timer))
    demoTimersRef.current = []

    dispatch({ type: 'SET_PLAYING', payload: true })

    // Execute demo script
    let cumulativeDelay = 0

    james.demoScript.forEach((step, stepIndex) => {
      const timer = setTimeout(() => {
        switch (step.action) {
          case 'caseLoad':
            // Case is loaded, panel visible
            break

          case 'ttsAutoPlay':
            // TTS will auto-play via PatientSpeech component
            break

          case 'startTyping':
            // Signal to start typing animation
            break

          case 'typeText':
            // Simulate typing in textarea
            dispatch({ type: 'SET_REASONING_TEXT', payload: step.text })
            break

          case 'appendText':
            // Append more text to textarea
            dispatch({ type: 'APPEND_REASONING_TEXT', payload: step.text })
            break

          case 'addDiagramBlock':
            // Add a single block to the diagram
            dispatch({ type: 'ADD_DIAGRAM_BLOCK', payload: step.block })
            break

          case 'updateBlockConnection':
            // Update a block's connections
            dispatch({
              type: 'UPDATE_BLOCK_CONNECTION',
              payload: { from: step.from, to: step.to },
            })
            break

          case 'selectDrug':
            dispatch({ type: 'TOGGLE_DRUG', payload: step.drug })
            break

          case 'setConfidence':
            dispatch({ type: 'SET_CONFIDENCE', payload: step.value })
            break

          case 'submit':
            dispatch({ type: 'SUBMIT' })
            break

          case 'buildDiagram':
            // In demo mode, use expert blocks as scripted diagram
            dispatch({ type: 'DIAGRAM_READY', payload: james.expertBlocks })
            break

          default:
            break
        }

        // Check if this is the last step
        if (stepIndex === james.demoScript.length - 1) {
          setTimeout(() => {
            dispatch({ type: 'SET_PLAYING', payload: false })
          }, 500)
        }
      }, cumulativeDelay)

      demoTimersRef.current.push(timer)
      cumulativeDelay += step.delay || 1200
    })
  }, [state.isPlaying])

  const stopDemo = useCallback(() => {
    demoTimersRef.current.forEach((timer) => clearTimeout(timer))
    demoTimersRef.current = []
    dispatch({ type: 'SET_PLAYING', payload: false })
    // Cancel any TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const value = {
    ...state,
    dispatch,
    playDemo,
    stopDemo,
    currentCase: james,
  }

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}
