export default function MessageKace({ message }) {
  return (
    <div className="animate-[fadeUp_0.32s_var(--ease-out)]">
      <div className="label-caps mb-1 pl-4" style={{ color: 'var(--gold)' }}>
        Kace
      </div>
      <div
        className="px-[18px] py-[14px] max-w-full"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderLeft: '2.5px solid var(--gold)',
          borderRadius: '0 var(--r) var(--r) var(--r)',
          boxShadow: 'var(--shadow-sm)',
          fontFamily: '"Playfair Display", serif',
          fontSize: '15px',
          lineHeight: '1.82',
          color: 'var(--text)',
        }}
      >
        {message}
      </div>
    </div>
  )
}
