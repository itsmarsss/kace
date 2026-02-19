export function AhmedAvatar({ state = 'default', size = 96 }) {
  const criticalClass = state === 'critical' ? 'filter saturate-[0.72] brightness-[0.95]' : ''

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`patient-avatar-svg transition-all duration-300 ${criticalClass}`}
    >
      <circle cx="48" cy="48" r="48" fill="#C4876A" />
      <path d="M18 82 Q30 74 48 74 Q66 74 78 82 L78 96 L18 96 Z" fill="#1F3B4D" />
      <rect x="37" y="66" width="22" height="18" rx="4" fill="#8B6F47" />
      <ellipse cx="48" cy="42" rx="26" ry="30" fill="#B8755A" />
      <ellipse cx="22" cy="43" rx="4" ry="5.5" fill="#A8654A" />
      <ellipse cx="74" cy="43" rx="4" ry="5.5" fill="#A8654A" />
      {/* Dark hair */}
      <path d="M22 29 Q24 13 48 13 Q72 13 74 29 Q67 21 48 20 Q29 21 22 29Z" fill="#1A1A1A" />
      <ellipse cx="25" cy="30" rx="4" ry="5" fill="#2A2A2A" opacity="0.8" />
      <ellipse cx="71" cy="30" rx="4" ry="5" fill="#2A2A2A" opacity="0.8" />
      {/* Hair texture */}
      <path d="M32 27 Q35 16 45 15" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M51 15 Q61 16 64 27" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Eyebrows - darker, fuller */}
      <path d="M33 32 Q37 29 42 30" stroke="#3A3034" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M54 30 Q59 29 63 32" stroke="#3A3034" strokeWidth="2.2" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="37" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="37" cy="40" r="3" fill="#2A1810" />
      <circle cx="38.2" cy="38.8" r="1.1" fill="white" />
      <ellipse cx="59" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="59" cy="40" r="3" fill="#2A1810" />
      <circle cx="60.2" cy="38.8" r="1.1" fill="white" />
      {/* Nose */}
      <circle cx="45" cy="50" r="1.8" fill="#9A6548" opacity="0.7" />
      <circle cx="51" cy="50" r="1.8" fill="#9A6548" opacity="0.7" />
      {/* Mouth - neutral/serious expression */}
      <path
        d="M40 59 Q48 60 56 59"
        stroke="#9A6548"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Facial hair - subtle beard shadow */}
      <path
        d="M25 58 Q25 62 28 63"
        stroke="#3A3034"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M68 58 Q68 62 65 63"
        stroke="#3A3034"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}
