import { X, Maximize2 } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'
import PatientAvatar from '../sidebar/PatientAvatar'
import VitalsGrid from './VitalsGrid'
import PatientSpeech from './PatientSpeech'
import { useTTS } from '../../hooks/useTTS'

export function PatientFullscreenButton() {
  const { dispatch } = useMode()

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_PATIENT_FULLSCREEN' })}
      className="absolute right-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--card)] text-[var(--text-tertiary)] transition-all duration-150 hover:border-[var(--teal-border)] hover:bg-[var(--teal-light)] hover:text-[var(--teal-dark)]"
    >
      <Maximize2 size={14} />
    </button>
  )
}

export function PatientFullscreen() {
  const { showPatientFullscreen, dispatch, currentCase } = useMode()
  const { isSpeaking } = useTTS()

  if (!showPatientFullscreen) return null

  return (
    <div className="fixed inset-0 z-[300] flex animate-[fadeUp_0.3s_ease] items-center justify-center bg-[var(--bg)]">
      <div className="relative flex h-[90vh] w-[600px] max-w-[90vw] flex-col overflow-hidden rounded-[var(--r)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PATIENT_FULLSCREEN' })}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--card)] text-[var(--text-tertiary)]"
        >
          <X size={16} />
        </button>

        <PatientAvatar caseId={currentCase.id} size={96} isSpeaking={isSpeaking} />
        <VitalsGrid />
        <PatientSpeech />
      </div>
    </div>
  )
}
