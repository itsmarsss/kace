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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--surface)]">
      <PatientFullscreenButton />
      {/* Zone 1: Avatar */}
      <PatientAvatar caseId={currentCase.id} size={96} isSpeaking={isSpeaking} />

      {/* Zone 2: Vitals Grid (scrollable) */}
      <VitalsGrid />

      {/* Zone 3: Patient Speech + TTS */}
      <PatientSpeech />
    </div>
  )
}
