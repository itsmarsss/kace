import { useMode } from '../../context/ModeProvider'
import PatientAvatar from '../sidebar/PatientAvatar'
import VitalsGrid from './VitalsGrid'
import PatientSpeech from './PatientSpeech'
import { useTTS } from '../../hooks/useTTS'

export default function PatientPanel() {
  const { currentCase } = useMode()
  const { isSpeaking } = useTTS()

  return (
    <div
      style={{
        width: '260px',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Zone 1: Avatar */}
      <PatientAvatar
        caseId={currentCase.id}
        size={96}
        isSpeaking={isSpeaking}
      />

      {/* Zone 2: Vitals Grid (scrollable) */}
      <VitalsGrid />

      {/* Zone 3: Patient Speech + TTS */}
      <PatientSpeech />
    </div>
  )
}
