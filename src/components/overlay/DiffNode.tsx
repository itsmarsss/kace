interface DiffNodeProps {
  type: 'match' | 'miss' | 'extra'
  title: string
  body: string
  animationDelay?: number
}

export default function DiffNode({ type, title, body, animationDelay = 0 }: DiffNodeProps) {
  const labels = {
    match: 'Match',
    miss: 'Missed',
    extra: 'Reconsidered',
  }

  const label = labels[type] || labels.match

  // Define styles for each diff type
  const bgClass =
    type === 'match'
      ? 'bg-[var(--green-light)]'
      : type === 'miss'
        ? 'bg-[var(--muted-bg)]'
        : 'bg-[var(--crimson-light)]'

  const borderStyle =
    type === 'match'
      ? 'border-solid border-[var(--green-border)]'
      : type === 'miss'
        ? 'border-dashed border-[var(--border-md)]'
        : 'border-solid border-[var(--crimson-border)]'

  const labelColorClass =
    type === 'match'
      ? 'text-[var(--green)]'
      : type === 'miss'
        ? 'text-[var(--text-tertiary)]'
        : 'text-[var(--crimson)]'

  const opacityClass = type === 'miss' ? 'opacity-60' : 'opacity-100'

  return (
    <div
      className={`animate-[fadeUp_0.4s_both] rounded-[6px] border px-[14px] py-[11px] ${bgClass} ${borderStyle} ${opacityClass}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-1 flex items-center gap-2">
        <div
          className={`text-[9px] font-semibold uppercase tracking-[0.1em] ${labelColorClass}`}
        >
          {label}
        </div>
        {type === 'extra' && (
          <span className="rounded-[4px] bg-[var(--crimson)] px-[6px] py-[2px] text-[8px] font-bold uppercase tracking-wider text-white">
            Reconsidered
          </span>
        )}
      </div>

      <div className="mb-[3px] text-[12px] font-medium text-[var(--text-primary)]">{title}</div>

      <div className="text-[11px] text-[var(--text-secondary)]">{body}</div>
    </div>
  )
}
