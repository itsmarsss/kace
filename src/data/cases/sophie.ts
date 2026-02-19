export const sophie = {
  id: 'sophie',
  patient: {
    name: 'Sophie',
    age: 72,
    sex: 'F',
    avatar: 'sophie',
  },

  introPrompt:
    'Sophie is a 72-year-old woman presenting with new-onset atrial fibrillation (heart rate 118 bpm, irregular). She has a history of hypertension and mild cognitive impairment. Assess her stroke and bleeding risk, and recommend an anticoagulation strategy.',

  speechLines: [
    "I noticed my heart racing and kind of fluttering this morning. It won't slow down. I'm feeling a bit dizzy and a little short of breath, but nothing too severe.",
    "I've had high blood pressure for many years, and I take medication for that. My doctor mentioned I might have some early memory issues, but I'm managing okay at home.",
    "I'm worried about what this fast heartbeat means. Are you going to give me a blood thinner? I've heard those can cause bleeding. I just want to know what's safe.",
  ],

  basicVitals: [
    { name: 'BP', value: '148/84', unit: 'mmHg', flag: 'caution' },
    { name: 'HR', value: '118', unit: 'bpm', flag: 'critical' },
    { name: 'Temp', value: '37.0', unit: '°C', flag: null },
    { name: 'SpO₂', value: '96', unit: '%', flag: null },
    { name: 'RR', value: '18', unit: 'breaths/min', flag: null },
    { name: 'BMI', value: '27.3', unit: 'kg/m²', flag: null },
  ],

  labsVitals: [
    { name: 'TSH', value: '2.4', unit: 'mIU/L', flag: null },
    { name: 'Troponin', value: '<0.01', unit: 'ng/mL', flag: null },
    { name: 'Creatinine', value: '0.9', unit: 'mg/dL', flag: null },
    { name: 'Hemoglobin', value: '13.2', unit: 'g/dL', flag: null },
  ],

  historyVitals: [
    {
      label: 'CARDIAC',
      text: '<strong>New-onset AF</strong> (this presentation). <strong>Hypertension x 15 years</strong> on lisinopril. <strong>No prior MI or HF</strong>. No valvular disease.',
      flag: 'critical',
    },
    {
      label: 'NEURO',
      text: '<strong>Mild cognitive impairment</strong> diagnosed 1 year ago. Lives independently, manages own medications. <strong>No prior stroke or TIA</strong>.',
      flag: 'caution',
    },
  ],

  systemContext: `Patient: Sophie, 72F, new-onset atrial fibrillation.

Clinical Data:
- Heart rate: 118 bpm (rapid, irregular)
- BP: 148/84 mmHg
- Temperature: 37.0°C (normal)
- Troponin: negative (no acute MI)
- TSH: normal (no thyroid cause)
- Creatinine: 0.9 mg/dL (normal renal function)

Cardiac History:
- New-onset AF (presentation today)
- No known structural heart disease
- Hypertension on lisinopril
- No prior cardiac events

Stroke Risk Factors:
- Age 72
- Female
- Hypertension
- New AF
- CHA2DS2-VASc score: 4 (moderate-high risk)

Bleeding Risk:
- Age 72 (minor factor)
- No prior GI bleeding
- Normal hemoglobin
- Mild cognitive impairment (concerning for fall risk)

Decision Point:
- Anticoagulation clearly indicated (CHA2DS2-VASc ≥2)
- Need to balance stroke prevention against bleeding and safety concerns`,

  studentBlocks: [
    {
      id: 'd1',
      type: 'OBSERVATION',
      title: 'New-onset atrial fibrillation diagnosis',
      body: 'Irregular HR 118 bpm with symptomatic presentation (palpitations, dizziness). Troponin negative, TSH normal. AF without acute cardiac cause.',
      connects_to: ['d2'],
      sourceText: 'Sophie has clear atrial fibrillation - heart rate is 118 and irregular. She\'s symptomatic with palpitations and dizziness. The troponin is negative and TSH is normal, so this isn\'t secondary to MI or thyroid disease.',
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
      title: 'CHA2DS2-VASc score assessment',
      body: 'Age 72 (1), Female (1), Hypertension (1), No diabetes (0), No prior stroke (0), No vascular disease (0), No age 65 doubling (already counted): Score = 3. Actually 4 with female modifier: high stroke risk.',
      connects_to: ['d3'],
      sourceText: 'Let me calculate her stroke risk. CHA2DS2-VASc: She\'s 72, so that\'s 1 point. Female is 1 point. Hypertension is 1 point. That puts her at 3-4, which is moderate to high stroke risk.',
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: ['CHA2DS2-VASc calculation slightly off but conclusion correct'],
        suggestions: ['Score is actually 4: age 72-74 (1) + female (1) + HTN (1) + vascular disease consideration'],
      },
    },
    {
      id: 'd3',
      type: 'INTERPRETATION',
      title: 'Anticoagulation clearly indicated',
      body: 'CHA2DS2-VASc ≥2 warrants anticoagulation in AF. No contraindications present (creatinine normal, no active bleeding, troponin negative).',
      connects_to: ['d4', 'd5'],
      sourceText: 'With a stroke risk score of 3-4, anticoagulation is definitely indicated. She doesn\'t have any contraindications - her kidney function is fine, she\'s not actively bleeding, no cardiac infarction.',
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
      type: 'CONSIDERATION',
      title: 'DOAC vs warfarin consideration',
      body: 'DOACs (dabigatran, apixaban, rivaroxaban) preferred over warfarin (better safety, no monitoring). Apixaban 5mg BID is safe choice with normal renal function.',
      connects_to: ['d6'],
      sourceText: 'Anticoagulation options: Warfarin is the old choice, but DOACs are better - less bleeding, no INR monitoring. Apixaban, dabigatran, rivaroxaban all work. I\'ll go with apixaban because it has favorable pharmacology.',
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
      title: 'Mild cognitive impairment - medication adherence concern',
      body: 'MCI increases fall risk and may affect medication adherence. Apixaban (twice daily) vs dabigatran (twice daily) requires planning. Consider involving caregiver in counseling.',
      connects_to: ['d6'],
      sourceText: 'The mild cognitive impairment worries me a bit. She needs to remember to take her anticoagulant twice daily. I should make sure she understands the importance, and maybe involve family in monitoring.',
      feedback: {
        isCorrect: true,
        timing: 'correct',
        necessity: 'necessary',
        issues: [],
        suggestions: [
          'Good attention to cognitive status. Consider confirming she can manage twice-daily dosing safely.',
        ],
      },
    },
    {
      id: 'd6',
      type: 'DECISION',
      title: 'Apixaban 5mg twice daily for stroke prevention',
      body: 'DOAC preferred over warfarin. Apixaban 5mg BID addresses stroke risk, safe with normal renal function. Counsel on adherence, fall precautions given MCI. Arrange follow-up.',
      connects_to: [],
      sourceText: 'My recommendation: Start apixaban 5mg twice daily. It\'s the safest DOAC for her, no monitoring needed. I\'ll emphasize the importance of taking it regularly, discuss fall prevention given her cognitive status, and arrange close follow-up.',
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
      title: 'New-onset atrial fibrillation',
      body: 'Symptomatic presentation with irregular HR 118 bpm. Negative troponin excludes acute MI. Normal TSH excludes thyroid disease. Diagnosis confirmed.',
      connects_to: ['e2'],
    },
    {
      id: 'e2',
      type: 'OBSERVATION',
      title: 'Stroke risk assessment (CHA2DS2-VASc)',
      body: 'Score of 4: Age 72-74 (1) + Female (1) + Hypertension (1) + Vascular disease consideration (1). Indicates high stroke risk requiring anticoagulation.',
      connects_to: ['e3'],
    },
    {
      id: 'e3',
      type: 'INTERPRETATION',
      title: 'Anticoagulation therapy mandatory',
      body: 'CHA2DS2-VASc ≥2 warrants anticoagulation in all AF patients. No contraindications present (normal renal function, no active bleeding, no valvular AF).',
      connects_to: ['e4', 'e5'],
    },
    {
      id: 'e4',
      type: 'CONSIDERATION',
      title: 'DOAC superiority over warfarin',
      body: 'DOACs (apixaban, dabigatran, rivaroxaban, edoxaban) have better safety profiles than warfarin with lower bleeding risk and no monitoring. Preferred first-line agents.',
      connects_to: ['e6'],
    },
    {
      id: 'e5',
      type: 'CONSIDERATION',
      title: 'Cognitive impairment and safety',
      body: 'Mild cognitive impairment increases fall risk and may affect medication adherence. Requires patient/caregiver education, fall prevention counseling, and close monitoring.',
      connects_to: ['e6'],
    },
    {
      id: 'e6',
      type: 'DECISION',
      title: 'Apixaban 5mg twice daily',
      body: 'Preferred DOAC with favorable pharmacology and safety profile. No monitoring required. Clear counseling on adherence, fall prevention, and bleeding symptoms warranted given MCI. Close follow-up essential.',
      connects_to: [],
    },
  ],

  overallFeedback: `Excellent clinical reasoning for new-onset AF management with thoughtful attention to this patient\'s specific vulnerabilities. You correctly identified stroke risk, selected appropriate anticoagulation, and importantly, highlighted concerns about cognitive status and medication adherence.

Key strengths:
- Correctly identified AF and calculated stroke risk (CHA2DS2-VASc)
- Appropriately recommended DOAC over warfarin
- Demonstrated awareness of cognitive impairment as complicating factor
- Good consideration of medication adherence and safety

Areas for improvement:
- Could specify exact CHA2DS2-VASc score components more precisely
- Consider mentioning rate control strategy (beta-blocker) for symptom management
- Could discuss monitoring plan for bleeding/adherence more explicitly

Next steps:
- Initiate apixaban 5mg BID with clear written instructions
- Educate patient/caregiver on anticoagulation importance and bleeding signs
- Arrange fall risk assessment given MCI
- Consider rate control with metoprolol if HR remains elevated
- Schedule 2-4 week follow-up to assess tolerance and adherence`,

  score: 86,

  expertInsight:
    'The critical decision in new-onset AF is recognizing stroke risk stratification and the clear indication for anticoagulation. DOACs have definitively replaced warfarin as first-line therapy due to superior safety and efficacy. The additional complexity here is the patient\'s mild cognitive impairment, which requires active patient/caregiver engagement to ensure medication adherence and monitoring for adverse events. This is a case where patient education and safety planning are as important as the medication choice itself.',

  expertCalibration: {
    confidence: 5,
    alignment: 90,
  },

  demoScript: [
    { action: 'caseLoad', delay: 300 },
    { action: 'ttsAutoPlay', delay: 400 },

    {
      action: 'typeText',
      text: "Sophie, 72-year-old, just presented with atrial fibrillation. Her heart rate is 118 and irregular. She\'s symptomatic - palpitations, dizziness. The troponin is negative and TSH is normal, so this isn\'t from a heart attack or thyroid disease. This is straightforward new-onset AF.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd1',
        type: 'OBSERVATION',
        title: 'New-onset atrial fibrillation diagnosis',
        body: 'Irregular HR 118 bpm with symptomatic presentation (palpitations, dizziness). Troponin negative, TSH normal. AF without acute cardiac cause.',
        connects_to: [],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "Now the key question with AF is always: what\'s her stroke risk? I need to calculate CHA2DS2-VASc. She\'s 72, so that\'s 1 point. She\'s female, another point. She has hypertension, another point. That puts her at 3 or 4 - moderate to high stroke risk.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd2',
        type: 'CONSIDERATION',
        title: 'CHA2DS2-VASc score assessment',
        body: 'Age 72 (1), Female (1), Hypertension (1), No diabetes (0), No prior stroke (0), No vascular disease (0), No age 65 doubling (already counted): Score = 3. Actually 4 with female modifier: high stroke risk.',
        connects_to: ['d3'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "With a score of 3 to 4, she clearly needs anticoagulation. That\'s not even a question. She has no contraindications - her kidney function is normal, she\'s not bleeding, no cardiac damage on troponin.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd3',
        type: 'INTERPRETATION',
        title: 'Anticoagulation clearly indicated',
        body: 'CHA2DS2-VASc ≥2 warrants anticoagulation in AF. No contraindications present (creatinine normal, no active bleeding, troponin negative).',
        connects_to: ['d4', 'd5'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: 'Now, what anticoagulation? The old standard was warfarin, but that\'s outdated. DOACs - dabigatran, apixaban, rivaroxaban - all work better than warfarin. They have lower bleeding rates and don\'t need INR monitoring.\n\n',
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd4',
        type: 'CONSIDERATION',
        title: 'DOAC vs warfarin consideration',
        body: 'DOACs (dabigatran, apixaban, rivaroxaban) preferred over warfarin (better safety, no monitoring). Apixaban 5mg BID is safe choice with normal renal function.',
        connects_to: ['d6'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "One thing that concerns me though: Sophie has mild cognitive impairment. She has to remember to take this medication twice a day. And she\'s at risk of falls, which matters with a blood thinner. I need to make sure she understands how important this is, and maybe involve her family.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd5',
        type: 'CONSIDERATION',
        title: 'Mild cognitive impairment - medication adherence concern',
        body: 'MCI increases fall risk and may affect medication adherence. Apixaban (twice daily) vs dabigatran (twice daily) requires planning. Consider involving caregiver in counseling.',
        connects_to: ['d6'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: 'Decision: Apixaban 5mg twice daily. It\'s a DOAC, safer than warfarin. I\'ll counsel her strongly on taking it regularly, talk about fall prevention, and make sure family is involved in monitoring. Close follow-up is essential.',
      delay: 1200,
    },
    { action: 'selectDrug', drug: 'Anticoagulant DOAC', delay: 600 },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd6',
        type: 'DECISION',
        title: 'Apixaban 5mg twice daily for stroke prevention',
        body: 'DOAC preferred over warfarin. Apixaban 5mg BID addresses stroke risk, safe with normal renal function. Counsel on adherence, fall precautions given MCI. Arrange follow-up.',
        connects_to: [],
      },
      delay: 800,
    },

    { action: 'setConfidence', value: 5, delay: 600 },
    { action: 'submit', delay: 800 },
    { action: 'buildDiagram', delay: 1000 },
  ],
};
