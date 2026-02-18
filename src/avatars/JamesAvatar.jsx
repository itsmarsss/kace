export function JamesAvatar({ state = 'default', size = 72 }) {
  const criticalClass = state === 'critical' ? 'filter saturate-[0.7] brightness-[0.96]' : ''

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`patient-avatar-svg transition-all duration-300 ${criticalClass}`}
    >
      {/* Background */}
      <circle cx="36" cy="36" r="36" fill="#F5E6D3" />

      {/* Shirt collar — bottom of circle */}
      <path d="M14 62 Q22 56 36 56 Q50 56 58 62 L58 72 L14 72 Z" fill="#2C3E50" />

      {/* Neck */}
      <rect x="28" y="50" width="16" height="14" rx="3" fill="#D4956A" />

      {/* Head */}
      <ellipse cx="36" cy="32" rx="19" ry="22" fill="#D4956A" />

      {/* Ears */}
      <ellipse cx="17" cy="33" rx="3" ry="4" fill="#C4855A" />
      <ellipse cx="55" cy="33" rx="3" ry="4" fill="#C4855A" />

      {/* Hair */}
      <path
        d="M17 22 Q18 10 36 10 Q54 10 55 22 Q50 16 36 15 Q22 16 17 22Z"
        fill="#7A6E68"
      />

      {/* Grey temple highlights */}
      <ellipse cx="19" cy="23" rx="3" ry="4" fill="#9A8E88" opacity="0.7" />
      <ellipse cx="53" cy="23" rx="3" ry="4" fill="#9A8E88" opacity="0.7" />

      {/* Eyebrows — slight furrow */}
      <path
        d="M25 24 Q28 22 31 23"
        stroke="#5A4E48"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M41 23 Q44 22 47 24"
        stroke="#5A4E48"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <ellipse cx="28" cy="30" rx="4" ry="3.5" fill="white" />
      <circle cx="28" cy="30" r="2.2" fill="#4A3C34" />
      <circle cx="29" cy="29" r="0.8" fill="white" />

      <ellipse cx="44" cy="30" rx="4" ry="3.5" fill="white" />
      <circle cx="44" cy="30" r="2.2" fill="#4A3C34" />
      <circle cx="45" cy="29" r="0.8" fill="white" />

      {/* Nose */}
      <circle cx="34" cy="38" r="1.2" fill="#C4855A" opacity="0.6" />
      <circle cx="38" cy="38" r="1.2" fill="#C4855A" opacity="0.6" />

      {/* Mouth — neutral */}
      <path
        d="M30 44 Q36 46 42 44"
        stroke="#B8754A"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Subtle facial lines — age detail */}
      <path
        d="M24 42 Q26 43 27 45"
        stroke="#C4855A"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M45 42 Q46 43 48 45"
        stroke="#C4855A"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}
