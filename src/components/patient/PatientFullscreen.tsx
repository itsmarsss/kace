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
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '28px',
        height: '28px',
        borderRadius: 'var(--r-sm)',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        color: 'var(--text-tertiary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--teal-light)'
        e.currentTarget.style.color = 'var(--teal-dark)'
        e.currentTarget.style.borderColor = 'var(--teal-border)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--card)'
        e.currentTarget.style.color = 'var(--text-tertiary)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeUp 0.3s ease',
      }}
    >
      <div
        style={{
          width: '600px',
          maxWidth: '90vw',
          height: '90vh',
          background: 'var(--surface)',
          borderRadius: 'var(--r)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PATIENT_FULLSCREEN' })}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
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
