export function JamesAvatar({ state = 'default', size = 96 }) {
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
      <circle cx="48" cy="48" r="48" fill="#F5E6D3" />
      <path d="M18 82 Q30 74 48 74 Q66 74 78 82 L78 96 L18 96 Z" fill="#1A2B3C" />
      <rect x="37" y="66" width="22" height="18" rx="4" fill="#D4956A" />
      <ellipse cx="48" cy="42" rx="26" ry="30" fill="#D4956A" />
      <ellipse cx="22" cy="43" rx="4" ry="5.5" fill="#C4855A" />
      <ellipse cx="74" cy="43" rx="4" ry="5.5" fill="#C4855A" />
      <path d="M22 29 Q24 13 48 13 Q72 13 74 29 Q67 21 48 20 Q29 21 22 29Z" fill="#7A6E68" />
      <ellipse cx="25" cy="30" rx="4" ry="5" fill="#9A8E88" opacity="0.7" />
      <ellipse cx="71" cy="30" rx="4" ry="5" fill="#9A8E88" opacity="0.7" />
      <path d="M33 32 Q37 29 42 30" stroke="#5A4E48" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 30 Q59 29 63 32" stroke="#5A4E48" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="37" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="37" cy="40" r="3" fill="#4A3C34" />
      <circle cx="38.2" cy="38.8" r="1.1" fill="white" />
      <ellipse cx="59" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="59" cy="40" r="3" fill="#4A3C34" />
      <circle cx="60.2" cy="38.8" r="1.1" fill="white" />
      <circle cx="45" cy="50" r="1.6" fill="#C4855A" opacity="0.6" />
      <circle cx="51" cy="50" r="1.6" fill="#C4855A" opacity="0.6" />
      <path
        d="M40 58 Q48 61 56 58"
        stroke="#B8754A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M31 55 Q34 57 35 60"
        stroke="#C4855A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M61 55 Q62 57 65 60"
        stroke="#C4855A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}
