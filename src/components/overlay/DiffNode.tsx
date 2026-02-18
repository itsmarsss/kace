export default function DiffNode({ type, title, body, animationDelay = 0 }) {
  const styles = {
    match: {
      bg: 'var(--green-light)',
      border: 'var(--green-border)',
      labelColor: 'var(--green)',
      label: 'Match',
    },
    miss: {
      bg: 'var(--amber-light)',
      border: 'var(--amber-border)',
      labelColor: 'var(--amber)',
      label: 'Missed',
    },
    wrong: {
      bg: 'var(--crimson-light)',
      border: 'var(--crimson-border)',
      labelColor: 'var(--crimson)',
      label: 'Diverged',
    },
  }

  const style = styles[type] || styles.match

  return (
    <div
      className="px-[14px] py-[11px] rounded-[6px] animate-[fadeUp_0.4s_both]"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.1em] mb-1"
        style={{ color: style.labelColor }}
      >
        {style.label}
      </div>

      <div className="text-[12px] font-medium mb-[3px]" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>

      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
        {body}
      </div>
    </div>
  )
}
