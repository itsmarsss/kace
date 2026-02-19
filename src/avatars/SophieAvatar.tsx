export function SophieAvatar({ state = 'default', size = 96 }) {
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
      <circle cx="48" cy="48" r="48" fill="#E8D9D9" />
      <path d="M18 82 Q30 74 48 74 Q66 74 78 82 L78 96 L18 96 Z" fill="#4A5B6F" />
      <rect x="37" y="66" width="22" height="18" rx="4" fill="#C8A89A" />
      <ellipse cx="48" cy="42" rx="26" ry="30" fill="#D8B8A8" />
      <ellipse cx="22" cy="43" rx="4" ry="5.5" fill="#C8A89A" />
      <ellipse cx="74" cy="43" rx="4" ry="5.5" fill="#C8A89A" />
      {/* Gray/silver hair - styled, older appearance */}
      <path d="M22 29 Q24 13 48 13 Q72 13 74 29 Q67 21 48 20 Q29 21 22 29Z" fill="#9B9B9B" />
      <ellipse cx="25" cy="30" rx="4" ry="5" fill="#B8B8B8" opacity="0.8" />
      <ellipse cx="71" cy="30" rx="4" ry="5" fill="#B8B8B8" opacity="0.8" />
      {/* Hair waves and texture - older styling */}
      <path d="M28 26 Q32 15 42 14" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M54 14 Q64 15 68 26" stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Eyebrows - lighter, with age lines */}
      <path d="M33 32 Q37 30 42 31" stroke="#8B8B8B" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 31 Q59 30 63 32" stroke="#8B8B8B" strokeWidth="2" strokeLinecap="round" />
      {/* Age lines/wrinkles around eyes */}
      <path d="M27 38 Q28 41 27 44" stroke="#B8A89A" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M69 38 Q68 41 69 44" stroke="#B8A89A" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Eyes - warm, kind expression */}
      <ellipse cx="37" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="37" cy="40" r="3" fill="#5B7A8B" />
      <circle cx="38.2" cy="38.8" r="1.1" fill="white" />
      <ellipse cx="59" cy="40" rx="5.5" ry="4.5" fill="white" />
      <circle cx="59" cy="40" r="3" fill="#5B7A8B" />
      <circle cx="60.2" cy="38.8" r="1.1" fill="white" />
      {/* Nose - age-appropriate shape */}
      <circle cx="45" cy="50" r="1.6" fill="#B8A89A" opacity="0.6" />
      <circle cx="51" cy="50" r="1.6" fill="#B8A89A" opacity="0.6" />
      {/* Mouth - gentle smile lines */}
      <path
        d="M40 59 Q48 61 56 59"
        stroke="#A89A8A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Smile lines/crow's feet */}
      <path
        d="M31 37 Q29 40 30 44"
        stroke="#B8A89A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M65 37 Q67 40 66 44"
        stroke="#B8A89A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Subtle age spots - optional detail */}
      <circle cx="60" cy="52" r="1" fill="#B8A89A" opacity="0.4" />
      <circle cx="35" cy="54" r="0.8" fill="#B8A89A" opacity="0.3" />
    </svg>
  )
}
