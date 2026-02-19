export default function DiffNode({ type, title, body, animationDelay = 0 }) {
  const labels = {
    match: 'Match',
    miss: 'Missed',
    wrong: 'Diverged',
  }

  const label = labels[type] || labels.match

  // Define Tailwind classes for each type
  const bgClass =
    type === 'match'
      ? 'bg-[var(--green-light)]'
      : type === 'miss'
        ? 'bg-[var(--amber-light)]'
        : 'bg-[var(--crimson-light)]'
  const borderClass =
    type === 'match'
      ? 'border-[var(--green-border)]'
      : type === 'miss'
        ? 'border-[var(--amber-border)]'
        : 'border-[var(--crimson-border)]'
  const labelColorClass =
    type === 'match'
      ? 'text-[var(--green)]'
      : type === 'miss'
        ? 'text-[var(--amber)]'
        : 'text-[var(--crimson)]'

  return (
    <div
      className={`animate-[fadeUp_0.4s_both] rounded-[6px] border px-[14px] py-[11px] ${bgClass} ${borderClass}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className={`mb-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${labelColorClass}`}
      >
        {label}
      </div>

      <div className="mb-[3px] text-[12px] font-medium text-[var(--text-primary)]">{title}</div>

      <div className="text-[11px] text-[var(--text-secondary)]">{body}</div>
    </div>
  )
}
