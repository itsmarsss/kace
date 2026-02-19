import { useImperativeHandle, forwardRef } from 'react'
import { JamesAvatar } from '../../avatars/JamesAvatar'
import { MariaAvatar } from '../../avatars/MariaAvatar'
import { AhmedAvatar } from '../../avatars/AhmedAvatar'
import { SophieAvatar } from '../../avatars/SophieAvatar'
import { caseList } from '../../data/cases'

const AVATAR_MAP = {
  james: JamesAvatar,
  maria: MariaAvatar,
  ahmed: AhmedAvatar,
  sophie: SophieAvatar,
}

interface PatientAvatarProps {
  caseId: string
  size?: number
  state?: string
  isSpeaking?: boolean
}

const PatientAvatar = forwardRef<unknown, PatientAvatarProps>(function PatientAvatar(
  { caseId, size = 96, state = 'default', isSpeaking = false },
  ref
) {
  useImperativeHandle(ref, () => ({
    triggerPulse: () => {
      // Pulse animation now handled by speaking state
    },
  }))

  const AvatarSVG = AVATAR_MAP[caseId as keyof typeof AVATAR_MAP]
  const caseInfo = caseList.find((c) => c.id === caseId)

  return (
    <div className="flex flex-col items-center border-b border-[var(--border)] px-4 pb-4 pt-6">
      <div
        className={`relative h-[96px] w-[96px] overflow-hidden rounded-full bg-[var(--card)] shadow-[var(--shadow-sm)] transition-all duration-300 ${
          isSpeaking ? 'animate-[speakingPulse_1.4s_ease-in-out_infinite]' : ''
        }`}
        style={{ border: `1.5px solid ${isSpeaking ? 'var(--teal-border)' : 'var(--border-md)'}` }}
      >
        {AvatarSVG && <AvatarSVG state={state} size={size} />}
      </div>

      <div className="mt-3 font-['DM_Sans',sans-serif] text-[15px] font-semibold text-[var(--text-primary)]">
        {caseInfo?.name || caseId}
      </div>

      <div className="mt-[2px] text-[11px] text-[var(--text-tertiary)]">
        {caseInfo ? `${caseInfo.age}${caseInfo.sex}` : ''}
      </div>
    </div>
  )
})

export default PatientAvatar
