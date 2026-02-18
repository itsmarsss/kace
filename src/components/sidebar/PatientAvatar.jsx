import { useState, useImperativeHandle, forwardRef } from 'react'
import { JamesAvatar } from '../../avatars/JamesAvatar'

const AVATAR_MAP = {
  james: JamesAvatar,
}

const PatientAvatar = forwardRef(function PatientAvatar(
  { caseId, size = 72, state = 'default' },
  ref
) {
  const [pulsing, setPulsing] = useState(false)

  useImperativeHandle(ref, () => ({
    triggerPulse: () => {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 1000)
    },
  }))

  const AvatarSVG = AVATAR_MAP[caseId]

  return (
    <div className="flex flex-col items-center py-5 px-4 pb-[14px] border-b"
      style={{ borderColor: 'var(--border)' }}>
      <div
        className={`w-[72px] h-[72px] rounded-full overflow-hidden relative transition-all ${
          pulsing ? 'animate-[avatarPulse_1s_ease_forwards]' : ''
        }`}
        style={{
          border: '1.5px solid var(--border-md)',
          background: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {AvatarSVG && <AvatarSVG state={state} size={size} />}
      </div>

      <div
        className="mt-[10px] text-[14px] font-semibold"
        style={{ color: 'var(--text)' }}
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
