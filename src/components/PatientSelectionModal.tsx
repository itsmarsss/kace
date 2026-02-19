import { useMode } from '../context/ModeProvider'
import { caseList } from '../data/cases'

export default function PatientSelectionModal() {
  const { showPatientModal, dispatch, playDemo } = useMode()

  if (!showPatientModal) return null

  const selectPatient = (caseId: string) => {
    dispatch({ type: 'SET_SELECTED_CASE', payload: caseId })
    dispatch({ type: 'HIDE_PATIENT_MODAL' })
    dispatch({ type: 'SHOW_DIFFICULTY_MODAL' })
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[600px] rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)]">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-2 font-['DM_Sans',sans-serif] text-[24px] font-bold text-[var(--text-primary)]">
            Select a Patient Case
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)]">
            Choose a patient to work with. Each case presents a unique clinical challenge.
          </p>
        </div>

        {/* Patient cards grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {caseList.map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => selectPatient(caseItem.id)}
              className="group cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-light)] hover:shadow-[var(--shadow-md)]"
            >
              {/* Patient name and age */}
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-['DM_Sans',sans-serif] text-[16px] font-semibold text-[var(--text-primary)]">
                  {caseItem.name}
                </h3>
                <span className="font-['DM_Sans',sans-serif] text-[12px] text-[var(--text-tertiary)]">
                  {caseItem.age}y {caseItem.sex}
                </span>
              </div>

              {/* Description */}
              <p className="mb-2 font-['DM_Sans',sans-serif] text-[12px] leading-[1.5] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {caseItem.description}
              </p>

              {/* Specialty badge */}
              <div className="inline-block rounded-[var(--r-xs)] bg-[var(--border)] px-2 py-1 font-['DM_Sans',sans-serif] text-[10px] font-medium text-[var(--text-tertiary)]">
                {caseItem.specialty}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
