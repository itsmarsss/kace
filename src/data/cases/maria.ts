export const maria = {
  id: 'maria',
  patient: {
    name: 'Maria',
    age: 47,
    sex: 'F',
    avatar: 'maria',
  },

  introPrompt:
    'Maria is a 47-year-old woman presenting with acute-onset dyspnea, fever, and cough over the past 3 days. She has a 30 pack-year smoking history and mild COPD. Review her presentation and provide your clinical assessment and initial management approach.',

  speechLines: [
    "I started coughing three days ago, and it's gotten worse. I've got this fever, and I'm really struggling to catch my breath, especially when I move around.",
    "I've been smoking for a long time - I know I should quit. I was told I have mild COPD a few years ago, but I haven't been back to the doctor about it.",
    "The cough is producing this greenish mucus. I'm also feeling tired and achy. I just want to feel better and be able to breathe normally again.",
  ],

  basicVitals: [
    { name: 'BP', value: '136/88', unit: 'mmHg', flag: null },
    { name: 'HR', value: '102', unit: 'bpm', flag: 'caution' },
    { name: 'Temp', value: '38.7', unit: '°C', flag: 'critical' },
    { name: 'SpO₂', value: '92', unit: '%', flag: 'caution' },
    { name: 'RR', value: '24', unit: 'breaths/min', flag: 'caution' },
    { name: 'BMI', value: '28.1', unit: 'kg/m²', flag: null },
  ],

  labsVitals: [
    { name: 'WBC', value: '14.2', unit: 'K/µL', flag: 'critical' },
    { name: 'CRP', value: '78', unit: 'mg/L', flag: 'critical' },
    { name: 'Creatinine', value: '0.9', unit: 'mg/dL', flag: null },
    { name: 'O₂ Sat (room air)', value: '92%', unit: '', flag: 'caution' },
  ],

  historyVitals: [
    {
      label: 'PULMONARY',
      text: '<strong>Mild COPD</strong> — diagnosed 3 years ago, not on maintenance therapy. <strong>30 pack-year smoking history</strong> (still active). No prior pneumonia.',
      flag: 'caution',
    },
    {
      label: 'IMAGING (CXR today)',
      text: '<strong>Infiltrate in RLL</strong> with air bronchograms — consistent with bacterial pneumonia.',
      flag: 'critical',
    },
  ],

  systemContext: `Patient: Maria, 47F, acute pneumonia with COPD.

Clinical Data:
- Temperature: 38.7°C (fever)
- O₂ saturation: 92% on room air
- RR: 24 breaths/min (tachypneic)
- HR: 102 bpm (tachycardic)
- WBC: 14.2 K/µL (elevated)
- CRP: 78 mg/L (markedly elevated)

Pulmonary History:
- Mild COPD (diagnosed 3 years ago, untreated)
- 30 pack-year smoking history (active smoker)
- No prior pneumonia episodes

Current Presentation:
- 3-day progressive dyspnea, fever, productive cough (greenish sputum)
- Fatigue and myalgias
- CXR shows RLL infiltrate with air bronchograms`,

  studentBlocks: [
    {
      id: 'd1',
      type: 'OBSERVATION',
      title: 'Community-acquired pneumonia (CAP)',
      body: 'Classic acute presentation: fever, productive cough, dyspnea, infiltrate on CXR. Meets CURB-65 criteria, warrants antibiotics.',
      connects_to: ['d2'],
      sourceText: 'She has all the hallmarks of CAP - fever for 3 days, productive cough with green sputum, dyspnea, and CXR shows infiltrate. Clear pneumonia here.',
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
      type: 'OBSERVATION',
      title: 'CURB-65 severity assessment',
      body: 'Temperature 38.7°C (C), RR 24 (U), Creatinine normal, BP 136/88. Score = 1 (low risk). Oral antibiotics acceptable, but monitor closely.',
      connects_to: ['d3'],
      sourceText: 'Let me check the CURB-65 score... She has fever and tachypnea, so that\'s 2 points. Creatinine is normal, BP is okay, she\'s not confused. Score is 1-2, so low to intermediate risk.',
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
    {
      id: 'd3',
      type: 'CONSIDERATION',
      title: 'COPD as a complication factor',
      body: 'Underlying mild COPD and active smoking increase risk of severe infection and poor outcomes. Need to account for this in treatment approach.',
      connects_to: ['d4'],
      sourceText: 'She\'s got COPD on top of this, and she\'s still smoking. That\'s a complication. COPD patients tend to do worse with pneumonia - they already have compromised lung function.',
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
      title: 'Need broad empiric coverage for CAP',
      body: 'Given COPD background, oral first-line amoxicillin-clavulanate covers atypicals and S. pneumoniae. Consider respiratory fluoroquinolone for COPD patients.',
      connects_to: ['d5', 'd6'],
      sourceText: 'For CAP in COPD patients, I need to think about coverage. Amoxicillin-clavulanate is standard, but levofloxacin covers both typical and atypical organisms, which is good for COPD patients.',
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
      title: 'Levofloxacin - respiratory fluoroquinolone',
      body: 'Covers S. pneumoniae, H. influenzae, and atypical organisms. Good lung penetration. First-line for COPD with CAP per guidelines.',
      connects_to: ['d7'],
      sourceText: 'Levofloxacin is a respiratory fluoroquinolone - it covers the bacteria we worry about in COPD: pneumococcus, H. flu, and atypicals. And it has good lung penetration.',
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
      type: 'CONSIDERATION',
      title: 'Supportive care - oxygen therapy',
      body: 'SpO₂ 92% is borderline. Consider supplemental O₂ to target >94%, and monitor respiratory status closely given COPD background.',
      connects_to: ['d7'],
      sourceText: 'Her oxygen saturation is 92%, which is concerning given she already has COPD. I should probably give her supplemental oxygen to get her to at least 94%.',
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
    {
      id: 'd7',
      type: 'DECISION',
      title: 'Levofloxacin + supportive care + smoking cessation',
      body: 'Initiate levofloxacin 750mg daily for CAP with COPD coverage. Supplemental O₂ to maintain SpO₂ >94%. Counsel on smoking cessation. Follow-up CXR in 2-4 weeks.',
      connects_to: [],
      sourceText: 'Plan: Start levofloxacin 750mg once daily for 5 days. Give her oxygen to keep her saturation up. Strongly counsel on smoking cessation - this is a wake-up call for her.',
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [],
      },
    },
  ],

  expertBlocks: [
    {
      id: 'e1',
      type: 'OBSERVATION',
      title: 'Community-acquired pneumonia diagnosis',
      body: 'Acute presentation with fever (38.7°C), productive cough, dyspnea, and CXR infiltrate clearly indicates CAP.',
      connects_to: ['e2'],
    },
    {
      id: 'e2',
      type: 'OBSERVATION',
      title: 'CURB-65 score = 1 (low risk)',
      body: 'Temperature and respiratory rate elevated, but creatinine normal, BP stable, not confused. Low-risk criteria met for outpatient management.',
      connects_to: ['e3'],
    },
    {
      id: 'e3',
      type: 'CONSIDERATION',
      title: 'COPD as significant modifying factor',
      body: 'Underlying COPD with active 30 pack-year smoking history increases risk of treatment failure and poor outcomes. Requires more aggressive coverage than standard CAP.',
      connects_to: ['e4', 'e5'],
    },
    {
      id: 'e4',
      type: 'CONSIDERATION',
      title: 'Respiratory fluoroquinolone first-line',
      body: 'Levofloxacin or moxifloxacin preferred in COPD patients due to broad spectrum (S. pneumoniae, H. influenzae, atypicals) and excellent lung penetration.',
      connects_to: ['e6'],
    },
    {
      id: 'e5',
      type: 'CONSIDERATION',
      title: 'Oxygen supplementation strategy',
      body: 'SpO₂ 92% indicates hypoxemia. Target SpO₂ >94% with supplemental oxygen while monitoring for hypercapnia risk in COPD.',
      connects_to: ['e6'],
    },
    {
      id: 'e6',
      type: 'DECISION',
      title: 'Levofloxacin + oxygen + smoking counseling',
      body: 'Initiate levofloxacin 750mg once daily for CAP-COPD. Supplement oxygen to maintain SpO₂ >94%. Provide strong smoking cessation counseling as part of COPD management strategy.',
      connects_to: [],
    },
  ],

  overallFeedback: `Solid clinical approach to an acute infection with good comorbidity awareness. You recognized the CAP diagnosis and correctly identified COPD as a complicating factor requiring broader antibiotic coverage.

Key strengths:
- Correctly identified CAP and applied CURB-65 assessment
- Recognized COPD as a modifier requiring respiratory fluoroquinolone coverage
- Good attention to oxygen supplementation strategy
- Appropriate consideration of smoking cessation

Areas for improvement:
- Could have emphasized the COPD-specific coverage earlier in your reasoning
- Consider mentioning outpatient follow-up plan more explicitly
- Could discuss monitoring parameters for treatment response

Next steps:
- Ensure patient compliance with antibiotic course (full 5 days)
- Arrange follow-up CXR in 2-4 weeks to confirm resolution
- Proactively address smoking cessation at every encounter`,

  score: 85,

  expertInsight:
    'The critical insight here is recognizing that COPD transforms this from a standard CAP case into one requiring higher-coverage antibiotics. Respiratory fluoroquinolones are preferred in COPD patients because they cover not just typical CAP pathogens but also atypical organisms and gram-negatives. Additionally, the underlying COPD demands careful oxygen management to maintain oxygenation without causing CO2 retention.',

  expertCalibration: {
    confidence: 4,
    alignment: 88,
  },

  demoScript: [
    { action: 'caseLoad', delay: 300 },
    { action: 'ttsAutoPlay', delay: 400 },

    {
      action: 'typeText',
      text: "Maria, 47, acute presentation with 3-day fever, productive cough with green sputum, and dyspnea. SpO2 is 92, she's tachypneic at 24, and her CXR shows an infiltrate in the right lower lobe. Classic pneumonia picture here.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd1',
        type: 'OBSERVATION',
        title: 'Community-acquired pneumonia (CAP)',
        body: 'Classic acute presentation: fever, productive cough, dyspnea, infiltrate on CXR. Meets CURB-65 criteria, warrants antibiotics.',
        connects_to: [],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "Let me assess severity with CURB-65. She has confusion? No. Urea elevated? No. Respiratory rate... 24, so that's elevated. BP is 136/88, that's fine. Age... she's 47, so under 65. Creatinine is normal. Score is low - around 1. That means outpatient treatment is reasonable.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd2',
        type: 'OBSERVATION',
        title: 'CURB-65 severity assessment',
        body: 'Temperature 38.7°C (C), RR 24 (U), Creatinine normal, BP 136/88. Score = 1 (low risk). Oral antibiotics acceptable, but monitor closely.',
        connects_to: [],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "But wait - she has COPD. Mild COPD, but it's there. And she's still smoking - 30 pack-year history, actively smoking. That changes things. COPD patients with pneumonia tend to do worse. They already have compromised lung function, and they're at higher risk for treatment failure.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd3',
        type: 'CONSIDERATION',
        title: 'COPD as a complication factor',
        body: 'Underlying mild COPD and active smoking increase risk of severe infection and poor outcomes. Need to account for this in treatment approach.',
        connects_to: ['d4'],
      },
      delay: 800,
    },
    { action: 'updateBlockConnection', from: 'd1', to: 'd3', delay: 300 },
    { action: 'updateBlockConnection', from: 'd2', to: 'd3', delay: 300 },

    {
      action: 'appendText',
      text: "For standard CAP, amoxicillin-clavulanate would be fine. But in COPD? I need broader coverage. I'm thinking respiratory fluoroquinolone here - levofloxacin. It covers pneumococcus, H. influenzae, AND atypical organisms, which is important in COPD patients.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd4',
        type: 'INTERPRETATION',
        title: 'Need broad empiric coverage for CAP',
        body: 'Given COPD background, oral first-line amoxicillin-clavulanate covers atypicals and S. pneumoniae. Consider respiratory fluoroquinolone for COPD patients.',
        connects_to: ['d5', 'd6'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: 'Levofloxacin 750mg once daily - covers all the bases, good lung penetration. And her oxygen saturation is 92%, which is low for someone with COPD. I should give her supplemental oxygen to get her to 94% or higher.\n\n',
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd5',
        type: 'CONSIDERATION',
        title: 'Levofloxacin - respiratory fluoroquinolone',
        body: 'Covers S. pneumoniae, H. influenzae, and atypical organisms. Good lung penetration. First-line for COPD with CAP per guidelines.',
        connects_to: ['d7'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: 'And she needs to understand that this is a wake-up call about smoking. Every time she gets pneumonia, COPD gets worse. Smoking cessation counseling needs to be part of the plan.',
      delay: 1200,
    },
    { action: 'selectDrug', drug: 'Fluoroquinolone', delay: 600 },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd6',
        type: 'CONSIDERATION',
        title: 'Supportive care - oxygen therapy',
        body: 'SpO₂ 92% is borderline. Consider supplemental O₂ to target >94%, and monitor respiratory status closely given COPD background.',
        connects_to: ['d7'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: 'Decision: Levofloxacin 750mg daily for 5 days, oxygen supplementation to maintain SpO2 above 94%, and strong smoking cessation counseling. Follow-up CXR in a few weeks to confirm resolution.',
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd7',
        type: 'DECISION',
        title: 'Levofloxacin + supportive care + smoking cessation',
        body: 'Initiate levofloxacin 750mg daily for CAP with COPD coverage. Supplemental O₂ to maintain SpO₂ >94%. Counsel on smoking cessation. Follow-up CXR in 2-4 weeks.',
        connects_to: [],
      },
      delay: 800,
    },

    { action: 'setConfidence', value: 4, delay: 600 },
    { action: 'submit', delay: 800 },
    { action: 'buildDiagram', delay: 1000 },
  ],
};
