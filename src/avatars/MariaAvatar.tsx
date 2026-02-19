export function MariaAvatar({ state = 'default', size = 96 }) {
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
      <circle cx="48" cy="48" r="48" fill="#E8D4C4" />
      <path d="M18 82 Q30 74 48 74 Q66 74 78 82 L78 96 L18 96 Z" fill="#2C5F7F" />
      <rect x="37" y="66" width="22" height="18" rx="4" fill="#D4956A" />
      <ellipse cx="48" cy="42" rx="26" ry="30" fill="#D8956A" />
      <ellipse cx="22" cy="43" rx="4" ry="5.5" fill="#C8855A" />
      <ellipse cx="74" cy="43" rx="4" ry="5.5" fill="#C8855A" />
      {/* Long dark hair */}
      <path d="M22 29 Q24 13 48 13 Q72 13 74 29 Q67 21 48 20 Q29 21 22 29Z" fill="#3A3A3A" />
      <ellipse cx="25" cy="30" rx="4" ry="5" fill="#4A4A4A" opacity="0.7" />
      <ellipse cx="71" cy="30" rx="4" ry="5" fill="#4A4A4A" opacity="0.7" />
      {/* Hair waves/texture */}
      <path d="M30 28 Q32 20 42 19" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M54 19 Q64 20 66 28" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Eyebrows */}
      <path d="M33 32 Q37 30 42 31" stroke="#5A4E48" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 31 Q59 30 63 32" stroke="#5A4E48" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="37" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="37" cy="40" r="3" fill="#6B4423" />
      <circle cx="38.2" cy="38.8" r="1.1" fill="white" />
      <ellipse cx="59" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="59" cy="40" r="3" fill="#6B4423" />
      <circle cx="60.2" cy="38.8" r="1.1" fill="white" />
      {/* Nose */}
      <circle cx="45" cy="50" r="1.6" fill="#C4855A" opacity="0.6" />
      <circle cx="51" cy="50" r="1.6" fill="#C4855A" opacity="0.6" />
      {/* Mouth - friendly smile */}
      <path
        d="M40 58 Q48 62 56 58"
        stroke="#B8754A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheek blush */}
      <path
        d="M28 50 Q26 54 28 58"
        stroke="#E8B8A8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M68 50 Q70 54 68 58"
        stroke="#E8B8A8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}
