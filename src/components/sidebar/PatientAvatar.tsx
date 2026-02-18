import { useState, useImperativeHandle, forwardRef } from 'react'
import { JamesAvatar } from '../../avatars/JamesAvatar'

const AVATAR_MAP = {
  james: JamesAvatar,
}

const PatientAvatar = forwardRef(function PatientAvatar(
  { caseId, size = 96, state = 'default', isSpeaking = false },
  ref
) {
  useImperativeHandle(ref, () => ({
    triggerPulse: () => {
      // Pulse animation now handled by speaking state
    },
  }))

  const AvatarSVG = AVATAR_MAP[caseId]

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-4 border-b"
      style={{ borderColor: 'var(--border)' }}>
      <div
        className={`w-[96px] h-[96px] rounded-full overflow-hidden relative transition-all duration-300 ${
          isSpeaking ? 'animate-[speakingPulse_1.4s_ease-in-out_infinite]' : ''
        }`}
        style={{
          border: `1.5px solid ${isSpeaking ? 'var(--teal-border)' : 'var(--border-md)'}`,
          background: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {AvatarSVG && <AvatarSVG state={state} size={size} />}
      </div>

      <div
        className="mt-3 text-[15px] font-semibold"
        style={{ color: 'var(--text)', fontFamily: '"DM Sans", sans-serif' }}
      >
        {caseId === 'james' ? 'James' : caseId}
      </div>

      <div className="text-[11px] mt-[2px]" style={{ color: 'var(--text-mute)' }}>
        61M
      </div>
    </div>
  )
})

export default PatientAvatar
