export default function CaptionsBar() {
  return (
    <div
      className="px-5 py-[10px] text-center text-[11px] transition-all duration-300"
      style={{
        maxHeight: '38px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-mute)',
      }}
    >
      Captions placeholder — real-time reasoning hints appear here
    </div>
  )
}
