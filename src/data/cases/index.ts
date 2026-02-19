import { james } from './james'
import { maria } from './maria'
import { ahmed } from './ahmed'
import { sophie } from './sophie'

export const allCases = {
  james,
  maria,
  ahmed,
  sophie,
} as const

export type CaseId = keyof typeof allCases

export const caseList = [
  {
    id: 'james' as const,
    name: 'James',
    age: 61,
    sex: 'M',
    specialty: 'Cardiology/Endocrinology',
    description: 'Type 2 Diabetes with HFrEF and recent MI',
    avatar: 'james',
  },
  {
    id: 'maria' as const,
    name: 'Maria',
    age: 47,
    sex: 'F',
    specialty: 'Respiratory',
    description: 'Acute pneumonia with underlying COPD',
    avatar: 'maria',
  },
  {
    id: 'ahmed' as const,
    name: 'Ahmed',
    age: 58,
    sex: 'M',
    specialty: 'Nephrology/Cardiology',
    description: 'Resistant hypertension with Stage 3b CKD',
    avatar: 'ahmed',
  },
  {
    id: 'sophie' as const,
    name: 'Sophie',
    age: 72,
    sex: 'F',
    specialty: 'Cardiology/Neurology',
    description: 'New-onset atrial fibrillation with stroke risk',
    avatar: 'sophie',
  },
] as const

export function getCase(id: CaseId) {
  return allCases[id]
}
