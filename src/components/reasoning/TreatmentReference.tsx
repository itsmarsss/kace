import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useMode } from '../../context/ModeProvider'

interface TreatmentCategory {
  name: string
  treatments: string[]
}

const TREATMENT_CATEGORIES: TreatmentCategory[] = [
  {
    name: 'Pharmacological',
    treatments: ['SGLT2i', 'GLP-1 RA', 'Metformin', 'Dual GIP/GLP-1 RA', 'TZD'],
  },
  {
    name: 'Insulin',
    treatments: ['Basal analogs', 'NPH', 'Prandial analogs', 'Inhaled insulin'],
  },
  {
    name: 'Surgery',
    treatments: ['Bariatric surgery'],
  },
  {
    name: 'Holistic',
    treatments: ['MNT', 'Diet', 'Aerobic exercise', 'Resistance training', 'DSMES'],
  },
  {
    name: 'Other',
    treatments: ['Other'],
  },
]

export default function TreatmentReference() {
  const { selectedDrugs, isSubmitted, difficulty, dispatch } = useMode()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter categories based on difficulty
  const getAvailableCategories = () => {
    if (difficulty === 'easy') {
      return TREATMENT_CATEGORIES.filter((cat) => cat.name === 'Pharmacological')
    } else if (difficulty === 'medium') {
      return TREATMENT_CATEGORIES.filter((cat) => cat.name === 'Pharmacological' || cat.name === 'Insulin')
    }
    // Hard mode: all categories
    return TREATMENT_CATEGORIES
  }

  const availableCategories = getAvailableCategories()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTreatment = (treatment: string) => {
    if (isSubmitted) return
    dispatch({ type: 'TOGGLE_DRUG', payload: treatment })
  }

  const currentCategory = availableCategories.find((cat) => cat.name === selectedCategory)

  return (
    <div className="mb-2.5">
      {/* Category dropdown */}
      <div className="mb-1.5 flex items-center gap-2">
        <div className="label-caps text-[9px]">TREATMENT OPTIONS</div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => !isSubmitted && setIsOpen(!isOpen)}
            disabled={isSubmitted}
            className={`px-2.5 py-[3px] pl-2 ${
              isOpen ? 'bg-[var(--teal-light)]' : 'bg-[var(--card)]'
            } rounded-[var(--r-xs)] border border-[var(--border)] ${
              isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'
            } flex min-w-[140px] items-center gap-1.5 font-['DM_Sans'] text-[11px] font-medium text-[var(--text-primary)] transition-all duration-150`}
          >
            {selectedCategory || 'Select category'}
            <ChevronDown size={11} className="ml-auto" />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] z-[100] min-w-[160px] rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--card)] p-1 shadow-[var(--shadow-md)]">
              {availableCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setIsOpen(false)
                  }}
                  className={`w-full px-2 py-[5px] ${
                    selectedCategory === category.name
                      ? 'bg-[var(--teal-light)]'
                      : 'bg-transparent hover:bg-[var(--teal-light)]'
                  } cursor-pointer rounded-[var(--r-xs)] border-none font-['DM_Sans'] text-[11px] ${
                    selectedCategory === category.name ? 'font-semibold' : 'font-normal'
                  } text-left text-[var(--text-primary)] transition-all duration-[120ms]`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Treatment options for selected category */}
      {currentCategory && (
        <div className="mb-2 flex flex-wrap gap-1">
          {currentCategory.treatments.map((treatment) => {
            const isSelected = selectedDrugs.includes(treatment)
            return (
              <button
                key={treatment}
                onClick={() => toggleTreatment(treatment)}
                disabled={isSubmitted}
                className={`px-2 py-[3px] ${
                  isSelected
                    ? 'border-[var(--teal-dark)] bg-[var(--teal)]'
                    : 'border-[var(--border)] bg-[var(--muted-bg)] hover:bg-[var(--teal-light)] hover:text-[var(--teal-dark)]'
                } rounded-[var(--r-xs)] border ${
                  isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'
                } font-['DM_Sans'] text-[10px] font-medium ${
                  isSelected ? 'text-white' : 'text-[var(--text-secondary)]'
                } transition-all duration-150`}
              >
                {treatment}
              </button>
            )
          })}
        </div>
      )}

      {/* Selected treatments summary */}
      {selectedDrugs.length > 0 && (
        <div>
          <div className="label-caps mb-1 text-[8px]">SELECTED</div>
          <div className="flex flex-wrap gap-1">
            {selectedDrugs.map((drug) => (
              <button
                key={drug}
                onClick={() => toggleTreatment(drug)}
                disabled={isSubmitted}
                className={`rounded-[var(--r-xs)] border border-[var(--teal-dark)] bg-[var(--teal)] px-1.5 py-[2px] ${
                  isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[var(--teal-dark)]'
                } flex items-center gap-[3px] font-['DM_Sans'] text-[10px] font-medium text-white transition-all duration-150`}
              >
                {drug}
                {!isSubmitted && <X size={9} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
