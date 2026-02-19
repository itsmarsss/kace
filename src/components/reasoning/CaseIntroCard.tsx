import { useMode } from '../../context/ModeProvider'

export default function CaseIntroCard() {
  const { currentCase } = useMode()

  return (
    <div className="mx-5 mb-3 mt-4 rounded-[var(--r-sm)] border border-l-[3px] border-[var(--border)] border-l-[var(--teal)] bg-[var(--card)] px-4 py-3">
      {/* Label */}
      <div className="label-caps mb-2 text-[9px] text-[var(--teal-dark)]">CASE BRIEF</div>

      {/* Prompt text */}
      <p className="m-0 font-['DM_Sans'] text-[13px] leading-[1.6] text-[var(--text-primary)]">
        {currentCase.introPrompt}
      </p>
    </div>
  )
}
