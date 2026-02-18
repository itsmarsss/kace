import { useMode } from '../../context/ModeProvider'

const DRUGS = ['Metformin', 'Empagliflozin', 'Liraglutide', 'Insulin']

export default function DrugPills() {
  const { selectedDrugs, setSelectedDrugs, isInputDisabled } = useMode()

  const toggleDrug = (drug) => {
    if (isInputDisabled) return

    if (selectedDrugs.includes(drug)) {
      setSelectedDrugs(selectedDrugs.filter((d) => d !== drug))
    } else {
      setSelectedDrugs([...selectedDrugs, drug])
    }
  }

  return (
    <div className="flex items-center gap-2 flex-1">
      {DRUGS.map((drug) => {
        const isSelected = selectedDrugs.includes(drug)

        return (
          <button
            key={drug}
            onClick={() => toggleDrug(drug)}
            disabled={isInputDisabled}
            className="text-[10px] px-[10px] py-[3px] rounded-full transition-all"
            style={{
              background: isSelected ? 'var(--teal-light)' : 'transparent',
              border: isSelected
                ? '1px solid var(--teal-border)'
                : '1px solid var(--border-md)',
              color: isSelected ? 'var(--teal-dark)' : 'var(--text-secondary)',
              cursor: isInputDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {drug}
          </button>
        )
      })}
    </div>
  )
}
