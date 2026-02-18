import { useMode } from '../../context/ModeProvider'
import PatientAvatar from '../sidebar/PatientAvatar'
import VitalsGrid from './VitalsGrid'
import PatientSpeech from './PatientSpeech'
import { PatientFullscreenButton } from './PatientFullscreen'
import { useTTS } from '../../hooks/useTTS'

export default function PatientPanel() {
  const { currentCase } = useMode()
  const { isSpeaking } = useTTS()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <PatientFullscreenButton />
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
