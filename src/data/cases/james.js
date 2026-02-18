export const james = {
  id: 'james',
  patient: {
    name: 'James',
    age: 61,
    sex: 'M',
    avatar: 'james',
  },

  // Case intro prompt shown in CaseIntroCard
  introPrompt:
    'James is a 61-year-old man with newly diagnosed Type 2 Diabetes (HbA1c 9.1%). He presents with classic symptoms of polyuria, polydipsia, and fatigue. Review his full clinical picture below, then provide your complete reasoning for selecting an initial medication.',

  // Patient speech lines for TTS navigation
  speechLines: [
    "I've been feeling really tired for the past few months, and I'm constantly thirsty. I'm up several times a night to use the bathroom.",
    'My doctor told me I have diabetes now. I had a heart attack about eight months ago, so I'm a bit worried about adding more medications.',
    "I get short of breath when I walk up stairs. It's gotten worse since my heart attack. I just want to make sure whatever medication we choose is safe for my heart.",
  ],

  // All vitals visible immediately in Patient Panel
  basicVitals: [
    { name: 'BP', value: '148/92', unit: 'mmHg', flag: 'caution' },
    { name: 'HR', value: '78', unit: 'bpm', flag: null },
    { name: 'Temp', value: '37.1', unit: '°C', flag: null },
    { name: 'SpO₂', value: '98', unit: '%', flag: null },
    { name: 'BMI', value: '33.2', unit: 'kg/m²', flag: 'caution' },
    { name: 'Weight', value: '98', unit: 'kg', flag: null },
  ],

  labsVitals: [
    { name: 'HbA1c', value: '9.1', unit: '%', flag: 'critical' },
    { name: 'eGFR', value: '52', unit: 'mL/min', flag: 'caution' },
    { name: 'Creatinine', value: '1.4', unit: 'mg/dL', flag: 'caution' },
    { name: 'BMP', value: 'WNL', unit: '', flag: null },
  ],

  historyVitals: [
    {
      label: 'CARDIAC',
      text: '<strong>NSTEMI 8 months ago</strong> — PCI with drug-eluting stent in LAD. Currently on DAPT (aspirin + clopidogrel).',
      flag: 'critical',
    },
    {
      label: 'ECHO (3mo ago)',
      text: 'EF <strong>35%</strong>, dilated LV — <strong>HFrEF</strong> confirmed.',
      flag: 'critical',
    },
  ],

  // System context for API analysis prompt
  systemContext: `Patient: James, 61M, newly diagnosed Type 2 Diabetes.

Clinical Data:
- HbA1c: 9.1% (uncontrolled)
- BMI: 33.2 (obese class I)
- BP: 148/92 mmHg (hypertensive)
- eGFR: 52 mL/min (CKD Stage 3a)
- Creatinine: 1.4 mg/dL

Cardiac History:
- NSTEMI 8 months ago, LAD stent (PCI)
- Currently on DAPT
- Recent echo: EF 35% — HFrEF confirmed

Symptoms:
- Polyuria, polydipsia, fatigue (classic T2DM presentation)
- Exertional dyspnea (cardiac)`,

  // Expert reasoning blocks for comparison
  expertBlocks: [
    {
      id: 'e1',
      type: 'OBSERVATION',
      title: 'HFrEF with reduced ejection fraction',
      body: 'Patient has confirmed HFrEF (EF 35%) from recent echocardiogram, placing him at high risk for cardiovascular mortality.',
      connects_to: ['e2'],
    },
    {
      id: 'e2',
      type: 'OBSERVATION',
      title: 'Post-MI status (8 months)',
      body: 'Recent NSTEMI with LAD stent indicates established coronary artery disease and ongoing cardiovascular risk.',
      connects_to: ['e3'],
    },
    {
      id: 'e3',
      type: 'INTERPRETATION',
      title: 'Cardiac risk supersedes glycemic urgency',
      body: 'While HbA1c 9.1% requires treatment, the HFrEF diagnosis is the primary driver for medication selection. Cardiovascular benefit takes precedence over pure glycemic efficacy.',
      connects_to: ['e4', 'e5'],
    },
    {
      id: 'e4',
      type: 'CONSIDERATION',
      title: 'Metformin — standard first-line',
      body: 'Metformin is guideline-recommended first-line for T2DM and is safe at eGFR 52. However, it offers no proven cardiovascular mortality benefit.',
      connects_to: ['e6'],
    },
    {
      id: 'e5',
      type: 'CONSIDERATION',
      title: 'SGLT2i — cardioprotective',
      body: 'SGLT2 inhibitors (especially empagliflozin) have proven mortality benefit in HFrEF, supported by EMPEROR-Reduced trial. Also improve glycemic control.',
      connects_to: ['e6'],
    },
    {
      id: 'e6',
      type: 'CONTRAINDICATION',
      title: 'GLP-1 RA — less HFrEF evidence',
      body: 'While GLP-1 agonists have cardiovascular benefits, the HFrEF mortality data is strongest for SGLT2 inhibitors. Semaglutide is not contraindicated but is not first choice here.',
      connects_to: ['e7'],
    },
    {
      id: 'e7',
      type: 'DECISION',
      title: 'Empagliflozin as primary agent',
      body: 'Empagliflozin addresses both T2DM and HFrEF with proven mortality reduction. Dosing is safe at eGFR 52. This is the evidence-based choice for this patient profile.',
      connects_to: [],
    },
  ],

  // Expert insight for overlay footer
  expertInsight:
    'The key decision point here is recognizing that HFrEF is the dominant clinical problem, not diabetes. While metformin is standard first-line for T2DM, this patient's cardiac comorbidity requires prioritizing medications with proven cardiovascular mortality benefit. Empagliflozin from the EMPEROR-Reduced trial is the evidence-based choice for patients with HFrEF and T2DM.',

  // Calibration data for overlay
  expertCalibration: {
    confidence: 5,
    alignment: 92,
  },

  // Demo script for v3 single-submission workflow
  demoScript: [
    { action: 'caseLoad', delay: 500 },
    { action: 'ttsAutoPlay', delay: 800 },
    { action: 'startTyping', delay: 2500 },
    {
      action: 'typeText',
      text: "Patient presents with classic T2DM symptoms and HbA1c 9.1%. Initial instinct is metformin as first-line, but I need to consider comorbidities.\n\nKey findings:\n- eGFR 52 (CKD Stage 3a) — metformin dose would need adjustment but is still safe\n- BP 148/92 — hypertensive, suggests need for medication with BP benefits\n- Post-MI 8mo ago — this changes everything. Need cardioprotective agent.\n- HFrEF with EF 35% — THIS is the critical finding.\n\nWith confirmed HFrEF, the patient needs an SGLT2 inhibitor for proven mortality benefit. Empagliflozin is supported by EMPEROR-Reduced trial for HFrEF patients. It also treats his diabetes and helps with BP.\n\nMetformin would be fine for glycemic control but doesn't address his cardiac risk, which is the primary concern here.",
      delay: 100,
    },
    { action: 'selectDrug', drug: 'Empagliflozin', delay: 800 },
    { action: 'setConfidence', value: 5, delay: 600 },
    { action: 'submit', delay: 1200 },
    { action: 'buildDiagram', delay: 1800 },
  ],
}
