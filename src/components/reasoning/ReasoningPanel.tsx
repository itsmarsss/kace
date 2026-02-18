import CaseIntroCard from './CaseIntroCard'
import ReasoningInput from './ReasoningInput'

export default function ReasoningPanel() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Scrollable top area with case intro */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <CaseIntroCard />
      </div>

      {/* Fixed bottom input area */}
      <ReasoningInput />
    </div>
  )
}
