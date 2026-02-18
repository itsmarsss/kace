// Keyword extraction for graph nodes
const KEYWORD_NODES = {
  // Cardiovascular
  hfref: { label: 'HFrEF', color: 'red', x: 0.5, y: 0.65 },
  'heart failure': { label: 'HFrEF', color: 'red', x: 0.5, y: 0.65 },
  mi: { label: 'Post-MI', color: 'red', x: 0.72, y: 0.48 },
  nstemi: { label: 'Post-MI', color: 'red', x: 0.72, y: 0.48 },
  'myocardial infarction': { label: 'Post-MI', color: 'red', x: 0.72, y: 0.48 },

  // Medications
  metformin: { label: 'Metformin', color: 'green', x: 0.3, y: 0.35 },
  empagliflozin: { label: 'Empagliflozin', color: 'green', x: 0.7, y: 0.7 },
  'sglt2': { label: 'SGLT2i', color: 'green', x: 0.68, y: 0.72 },
  'glp-1': { label: 'GLP-1', color: 'green', x: 0.45, y: 0.4 },
  liraglutide: { label: 'GLP-1', color: 'green', x: 0.45, y: 0.4 },

  // Labs/Vitals
  egfr: { label: 'eGFR 52', color: 'amber', x: 0.65, y: 0.28 },
  ckd: { label: 'CKD', color: 'amber', x: 0.65, y: 0.3 },
  hba1c: { label: 'HbA1c 9.1%', color: 'amber', x: 0.35, y: 0.25 },
  'renal function': { label: 'Renal', color: 'amber', x: 0.63, y: 0.3 },

  // Vitals
  hypertension: { label: 'HTN', color: 'blue', x: 0.22, y: 0.52 },
  htn: { label: 'HTN', color: 'blue', x: 0.22, y: 0.52 },
  'blood pressure': { label: 'BP 148/92', color: 'blue', x: 0.22, y: 0.52 },
}

export function extractKeywords(text) {
  const lowerText = text.toLowerCase()
  const nodes = []

  for (const [keyword, node] of Object.entries(KEYWORD_NODES)) {
    if (lowerText.includes(keyword)) {
      // Check if node already exists
      const exists = nodes.some((n) => n.label === node.label)
      if (!exists) {
        nodes.push(node)
      }
    }
  }

  return nodes
}
