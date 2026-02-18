export default function MessageUser({ message }) {
  return (
    <div className="flex flex-col items-end animate-[fadeUp_0.32s_var(--ease-out)]">
      <div
        className="label-caps mb-1 pr-4 text-right"
        style={{ color: 'var(--text-mute)' }}
      >
        YOU
      </div>
      <div
        className="px-4 py-3 max-w-[88%]"
        style={{
          background: 'var(--teal-light)',
          border: '1px solid var(--teal-border)',
          borderRadius: 'var(--r) 0 var(--r) var(--r)',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          lineHeight: '1.65',
          color: 'var(--text)',
        }}
      >
        {message}
      </div>
    </div>
  )
}
