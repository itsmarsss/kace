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
    "My doctor told me I have diabetes now. I had a heart attack about eight months ago, so I'm a bit worried about adding more medications.",
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

  // Student blocks (built during demo) with feedback
  studentBlocks: [
    {
      id: 'd1',
      type: 'OBSERVATION',
      title: 'Uncontrolled T2DM presentation',
      body: 'HbA1c 9.1% with classic symptoms (polyuria, polydipsia, fatigue). Clear indication for pharmacotherapy.',
      connects_to: ['d4'],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
    {
      id: 'd2',
      type: 'CONSIDERATION',
      title: 'Metformin - standard first-line',
      body: 'eGFR 52 allows metformin use with dose monitoring. Standard guideline-recommended approach.',
      connects_to: ['d4'],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: ['Good to consider first-line, but need to evaluate if this is the best choice given comorbidities'],
      },
    },
    {
      id: 'd3',
      type: 'OBSERVATION',
      title: 'HFrEF with recent MI',
      body: 'EF 35% confirms heart failure. NSTEMI 8 months ago with LAD stent. High cardiovascular risk.',
      connects_to: ['d4'],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
    {
      id: 'd4',
      type: 'INTERPRETATION',
      title: 'Cardiac risk supersedes glycemic urgency',
      body: 'HFrEF is the dominant clinical problem. Must prioritize cardiovascular mortality benefit over pure glycemic efficacy.',
      connects_to: ['d5', 'd6'],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
    {
      id: 'd5',
      type: 'CONSIDERATION',
      title: 'SGLT2i - proven HFrEF benefit',
      body: 'Empagliflozin has demonstrated mortality reduction in HFrEF (EMPEROR-Reduced). Also provides glycemic control and BP benefits.',
      connects_to: ['d7'],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
    {
      id: 'd6',
      type: 'CONTRAINDICATION',
      title: 'GLP-1 RA - less compelling in HFrEF',
      body: 'While GLP-1 agonists have cardiovascular benefits, HFrEF mortality data is strongest for SGLT2 inhibitors.',
      connects_to: ['d7'],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: ['Could strengthen by citing specific trial comparisons'],
      },
    },
    {
      id: 'd7',
      type: 'DECISION',
      title: 'Empagliflozin as primary agent',
      body: 'Addresses both T2DM and HFrEF with proven mortality reduction. eGFR 52 is safe. Evidence-based choice.',
      connects_to: [],
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
  ],

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

  // Overall feedback for the analysis
  overallFeedback: `Excellent clinical reasoning. You correctly identified HFrEF as the dominant clinical problem and prioritized cardiovascular mortality benefit over pure glycemic control. Your systematic approach of first considering metformin (standard first-line), then recognizing the cardiac history, and pivoting to SGLT2i based on EMPEROR-Reduced trial data demonstrates strong evidence-based decision making.

Key strengths:
- Recognized the significance of HFrEF (EF 35%) and recent MI
- Understood that cardiac risk supersedes glycemic urgency
- Correctly applied SGLT2i trial data (EMPEROR-Reduced) to this clinical scenario
- Appropriately ruled out alternatives with clear reasoning

Minor suggestions:
- Could have explicitly mentioned monitoring for euglycemic DKA with SGLT2i
- Consider mentioning the role of metformin as potential add-on therapy`,

  score: 94,

  // Expert insight for overlay footer
  expertInsight:
    "The key decision point here is recognizing that HFrEF is the dominant clinical problem, not diabetes. While metformin is standard first-line for T2DM, this patient's cardiac comorbidity requires prioritizing medications with proven cardiovascular mortality benefit. Empagliflozin from the EMPEROR-Reduced trial is the evidence-based choice for patients with HFrEF and T2DM.",

  // Calibration data for overlay
  expertCalibration: {
    confidence: 5,
    alignment: 92,
  },

  // Demo script for v3 - incremental reasoning with live diagram building
  demoScript: [
    { action: 'caseLoad', delay: 300 },
    { action: 'ttsAutoPlay', delay: 400 },

    // Chunk 1: Initial observations
    {
      action: 'typeText',
      text: "Okay, looking at James... 61 years old, newly diagnosed T2DM with HbA1c at 9.1%. That's pretty high, definitely needs treatment. Classic symptoms too - polyuria, polydipsia, fatigue. Textbook presentation.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd1',
        type: 'OBSERVATION',
        title: 'Uncontrolled T2DM presentation',
        body: 'HbA1c 9.1% with classic symptoms (polyuria, polydipsia, fatigue). Clear indication for pharmacotherapy.',
        connects_to: [],
      },
      delay: 800,
    },

    // Chunk 2: Initial medication consideration
    {
      action: 'appendText',
      text: "My first thought is metformin - it's the standard first-line for T2DM. Looking at his kidney function... eGFR is 52, that's CKD stage 3a. Metformin is still safe here, would just need to watch the dose. So far so good.\n\n",
      delay: 1000,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd2',
        type: 'CONSIDERATION',
        title: 'Metformin - standard first-line',
        body: 'eGFR 52 allows metformin use with dose monitoring. Standard guideline-recommended approach.',
        connects_to: [],
      },
      delay: 800,
    },

    // Chunk 3: Discovering cardiac history
    {
      action: 'appendText',
      text: "Wait, let me check his history... Oh. NSTEMI 8 months ago. That's significant. He's got a stent in his LAD, on dual antiplatelet therapy. And his echo shows... EF 35%? That's HFrEF. Heart failure with reduced ejection fraction.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd3',
        type: 'OBSERVATION',
        title: 'HFrEF with recent MI',
        body: 'EF 35% confirms heart failure. NSTEMI 8 months ago with LAD stent. High cardiovascular risk.',
        connects_to: ['d4'],
      },
      delay: 800,
    },

    // Chunk 4: Connecting dots
    {
      action: 'appendText',
      text: "Okay this changes everything. He doesn't just need glucose control - he needs a medication that will help his heart failure. HFrEF has high mortality risk. The diabetes is important but the cardiac status is what's going to kill him if we don't address it.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd4',
        type: 'INTERPRETATION',
        title: 'Cardiac risk supersedes glycemic urgency',
        body: 'HFrEF is the dominant clinical problem. Must prioritize cardiovascular mortality benefit over pure glycemic efficacy.',
        connects_to: ['d5', 'd6'],
      },
      delay: 800,
    },
    { action: 'updateBlockConnection', from: 'd1', to: 'd4', delay: 300 },
    { action: 'updateBlockConnection', from: 'd2', to: 'd4', delay: 300 },

    // Chunk 5: Reconsidering options
    {
      action: 'appendText',
      text: "So metformin would control his glucose, sure, but it doesn't have proven mortality benefit in HFrEF. I need to think about SGLT2 inhibitors here. The EMPEROR-Reduced trial showed empagliflozin reduces mortality in HFrEF patients. That's the evidence I need.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd5',
        type: 'CONSIDERATION',
        title: 'SGLT2i - proven HFrEF benefit',
        body: 'Empagliflozin has demonstrated mortality reduction in HFrEF (EMPEROR-Reduced). Also provides glycemic control and BP benefits.',
        connects_to: ['d7'],
      },
      delay: 800,
    },

    // Chunk 6: Ruling out alternatives
    {
      action: 'appendText',
      text: "What about GLP-1 agonists? They have CV benefits too... but the data for HFrEF specifically is strongest with SGLT2 inhibitors. SGLT2i is the class with the mortality benefit in this exact patient population. That's what the evidence says.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd6',
        type: 'CONTRAINDICATION',
        title: 'GLP-1 RA - less compelling in HFrEF',
        body: 'While GLP-1 agonists have cardiovascular benefits, HFrEF mortality data is strongest for SGLT2 inhibitors.',
        connects_to: ['d7'],
      },
      delay: 800,
    },

    // Chunk 7: Final decision
    {
      action: 'appendText',
      text: 'Decision: Empagliflozin. It treats his diabetes AND his heart failure. His eGFR of 52 is safe for SGLT2i. This is the evidence-based choice for a patient with both T2DM and HFrEF. The cardiac indication is actually the stronger reason here, the diabetes control is almost a bonus.',
      delay: 1200,
    },
    { action: 'selectDrug', drug: 'SGLT2i', delay: 600 },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd7',
        type: 'DECISION',
        title: 'Empagliflozin as primary agent',
        body: 'Addresses both T2DM and HFrEF with proven mortality reduction. eGFR 52 is safe. Evidence-based choice.',
        connects_to: [],
      },
      delay: 800,
    },

    // Final actions
    { action: 'setConfidence', value: 5, delay: 600 },
    { action: 'submit', delay: 800 },
    { action: 'buildDiagram', delay: 1000 },
  ],
}
