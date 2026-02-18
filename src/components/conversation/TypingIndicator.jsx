export default function TypingIndicator({ variant = 'kacee' }) {
  if (variant === 'user') {
    return (
      <div className="flex items-center justify-end gap-[6px] py-1 px-1">
        <span className="text-[11px] italic" style={{ color: 'var(--text-mute)' }}>
          Learner is typing
        </span>
        <div className="flex items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[3px] h-[3px] rounded-full"
              style={{
                background: 'var(--text-mute)',
                animation: `tpulse 1.2s infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="px-[18px] py-[14px] w-fit"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: '2.5px solid var(--teal)',
        borderRadius: '0 var(--r) var(--r) var(--r)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center gap-[5px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[4px] h-[4px] rounded-full"
            style={{
              background: 'var(--teal)',
              animation: `tpulse 1.2s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
