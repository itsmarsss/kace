import { Lock, CheckCircle2, ClipboardList } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'

export default function VitalButtons() {
  const { currentCase, revealedVitals, unlockedVitals, requestVital, isInputDisabled } = useMode()

  const vitals = currentCase.vitals

  const getButtonState = (vitalKey) => {
    const isRevealed = revealedVitals.includes(vitalKey)
    const isUnlocked = unlockedVitals.includes(vitalKey)

    if (isRevealed) return 'revealed'
    if (!isUnlocked) return 'locked'
    return 'unlocked'
  }

  const handleClick = (vitalKey) => {
    const state = getButtonState(vitalKey)
    if (state === 'unlocked' && !isInputDisabled) {
      requestVital(vitalKey)
    }
  }

  return (
    <div className="space-y-2">
      {Object.keys(vitals).map((vitalKey) => {
        const vital = vitals[vitalKey]
        const state = getButtonState(vitalKey)

        const styles = {
          unlocked: {
            background: 'transparent',
            border: '1px solid var(--border-md)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            badgeBg: 'rgba(58,110,168,0.1)',
            badgeColor: 'var(--blue)',
            badgeText: 'Request',
          },
          locked: {
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-tertiary)',
            cursor: 'not-allowed',
            opacity: '0.35',
            badgeBg: 'var(--muted-bg)',
            badgeColor: 'var(--text-tertiary)',
            badgeText: 'Locked',
          },
          revealed: {
            background: 'var(--green-light)',
            border: '1px solid var(--green-border)',
            color: 'var(--green)',
            cursor: 'default',
            badgeBg: 'rgba(45,155,111,0.1)',
            badgeColor: 'var(--green)',
            badgeText: '✓ Done',
          },
        }

        const style = styles[state]

        return (
          <button
            key={vitalKey}
            onClick={() => handleClick(vitalKey)}
            disabled={state !== 'unlocked'}
            className="w-full px-[10px] py-[7px] rounded-[7px] flex items-center justify-between text-left text-[11px] transition-all duration-[180ms]"
            style={{
              background: style.background,
              border: style.border,
              color: style.color,
              cursor: style.cursor,
              opacity: style.opacity,
            }}
          >
            <span className="flex items-center gap-2">
              {state === 'locked' && <Lock size={11} />}
              {state === 'revealed' && <CheckCircle2 size={11} />}
              {state === 'unlocked' && <ClipboardList size={11} />}
              {vital.label}
            </span>

            <span
              className="text-[9px] px-[7px] py-[1px] rounded-full"
              style={{
                background: style.badgeBg,
                color: style.badgeColor,
              }}
            >
              {style.badgeText}
            </span>
          </button>
        )
      })}
    </div>
  )
}
