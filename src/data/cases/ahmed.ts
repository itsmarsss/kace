export const ahmed = {
  id: 'ahmed',
  patient: {
    name: 'Ahmed',
    age: 58,
    sex: 'M',
    avatar: 'ahmed',
  },

  introPrompt:
    'Ahmed is a 58-year-old man with Stage 3b CKD and resistant hypertension (BP 162/98 on three agents). He presents for medication optimization. Review his renal function, current regimen, and electrolytes to recommend the best next-step antihypertensive strategy.',

  speechLines: [
    "My blood pressure has been high for years now, and no matter what pills my doctor gives me, it stays up. I'm on three different blood pressure medicines already.",
    "I was told my kidneys aren't working as well as they should. I try to watch my diet - less salt, less meat - but my blood pressure just won't come down.",
    "I've had headaches sometimes, but mostly I just worry that something bad will happen. My father had a stroke, and I'm scared I'll have one too.",
  ],

  basicVitals: [
    { name: 'BP', value: '162/98', unit: 'mmHg', flag: 'critical' },
    { name: 'HR', value: '84', unit: 'bpm', flag: null },
    { name: 'Temp', value: '36.8', unit: '°C', flag: null },
    { name: 'SpO₂', value: '98', unit: '%', flag: null },
    { name: 'BMI', value: '31.5', unit: 'kg/m²', flag: 'caution' },
    { name: 'Weight', value: '95', unit: 'kg', flag: null },
  ],

  labsVitals: [
    { name: 'eGFR', value: '38', unit: 'mL/min', flag: 'caution' },
    { name: 'Creatinine', value: '1.8', unit: 'mg/dL', flag: 'caution' },
    { name: 'K⁺', value: '4.9', unit: 'mEq/L', flag: null },
    { name: 'Urine ACR', value: '185', unit: 'mg/g', flag: 'critical' },
  ],

  historyVitals: [
    {
      label: 'RENAL',
      text: '<strong>Stage 3b CKD</strong> (eGFR 38 mL/min) for 2 years. <strong>Albuminuria 185 mg/g</strong> (moderately elevated). Unclear etiology.',
      flag: 'caution',
    },
    {
      label: 'HYPERTENSION',
      text: '<strong>Resistant hypertension</strong> (BP 162/98 on amlodipine, lisinopril, hydrochlorothiazide). No secondary causes identified. Family history of stroke.',
      flag: 'critical',
    },
  ],

  systemContext: `Patient: Ahmed, 58M, CKD Stage 3b with resistant hypertension.

Clinical Data:
- BP: 162/98 mmHg (uncontrolled despite 3 agents)
- eGFR: 38 mL/min (CKD Stage 3b)
- Creatinine: 1.8 mg/dL
- Potassium: 4.9 mEq/L (normal)
- Urine albumin-to-creatinine ratio: 185 mg/g (moderately elevated)

Current Medications:
- Amlodipine 10 mg daily
- Lisinopril 40 mg daily
- Hydrochlorothiazide 25 mg daily

Comorbidities:
- Obesity (BMI 31.5)
- Family history of stroke
- No diabetes (glucose WNL)
- No cardiovascular events to date

Clinical Challenge:
- Resistant hypertension on standard triple therapy
- Stage 3b CKD with albuminuria
- Need renoprotection and BP control without worsening renal function`,

  studentBlocks: [
    {
      id: 'd1',
      type: 'OBSERVATION',
      title: 'Resistant hypertension on triple therapy',
      body: 'BP 162/98 despite amlodipine, lisinopril, and HCTZ (all maximal doses). Meets definition of resistant HTN - requires optimization strategy.',
      connects_to: ['d2'],
      sourceText: 'Ahmed has tried three different medications at full doses and his blood pressure is still 162/98. By definition, that\'s resistant hypertension. He needs a different approach.',
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
      title: 'Stage 3b CKD with albuminuria',
      body: 'eGFR 38 mL/min with moderate albuminuria (ACR 185 mg/g). CKD is both target organ damage from HTN and a condition requiring renal protection.',
      connects_to: ['d3'],
      sourceText: 'His kidney function is at eGFR 38 - that\'s stage 3b CKD. And he\'s got moderate albuminuria at 185 mg/g. His hypertension is clearly damaging his kidneys.',
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
      title: 'ACE inhibitor already maximized',
      body: 'Lisinopril 40 mg daily is maximal dosing. Has RAAS blockade, but blood pressure still uncontrolled. May need second-order optimization.',
      connects_to: ['d4'],
      sourceText: 'He\'s on lisinopril 40 mg, which is the top dose. ACE inhibitors and ARBs are renoprotective, but he\'s not getting BP control even at maximal dose.',
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
      title: 'Need for second RAAS blocker or fourth agent',
      body: 'Current regimen lacks complete RAAS blockade and/or needs additional agent class. Options: dual RAAS blockade (with monitoring) or add spironolactone for aldosterone inhibition.',
      connects_to: ['d5', 'd6'],
      sourceText: 'The standard triple therapy isn\'t cutting it. I could try adding a second RAAS blocker, but that requires monitoring. Or I could add spironolactone to block aldosterone - that might help his resistant HTN and also protect his kidneys.',
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
      title: 'Spironolactone - aldosterone inhibition',
      body: 'Evidence supports spironolactone 25-50mg in resistant HTN (ACCENT trial). Also provides renal protection via aldosterone antagonism. Monitor potassium at 4.9 (acceptable baseline).',
      connects_to: ['d7'],
      sourceText: 'Spironolactone is fourth-line for resistant hypertension. The evidence is pretty strong - ACCENT trial showed benefit. And it\'s protective for his kidneys since it blocks aldosterone.',
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
      title: 'Lifestyle and adherence factors',
      body: 'Patient reports diet modification compliance. Assess medication adherence, sodium intake quantification, and whether home BP monitoring shows true uncontrol.',
      connects_to: ['d7'],
      sourceText: 'Before adding another drug, I should make sure he\'s taking his current meds correctly and that his sodium intake is truly low. But assuming adherence is okay, spironolactone is the right next step.',
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
      title: 'Add spironolactone 25mg daily',
      body: 'Fourth-line agent for resistant HTN with evidence (ACCENT trial). Provides BP reduction and renal protection via aldosterone antagonism. Monitor K+ and creatinine in 2 weeks.',
      connects_to: [],
      sourceText: 'My recommendation: Add spironolactone 25mg once daily. Monitor his potassium and creatinine in 2 weeks - that\'s the key safety concern. This should help both his blood pressure and his kidney protection.',
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
      title: 'Resistant hypertension definition met',
      body: 'BP 162/98 despite maximum doses of three antihypertensives (amlodipine 10mg, lisinopril 40mg, HCTZ 25mg). Clear definition of resistant HTN.',
      connects_to: ['e2'],
    },
    {
      id: 'e2',
      type: 'OBSERVATION',
      title: 'CKD Stage 3b with albuminuria',
      body: 'eGFR 38 represents advanced Stage 3b CKD. ACR 185 mg/g indicates moderate albuminuria. Both are markers of target organ damage from hypertension.',
      connects_to: ['e3'],
    },
    {
      id: 'e3',
      type: 'CONSIDERATION',
      title: 'Current RAAS blockade with ACE inhibitor',
      body: 'Lisinopril 40mg represents maximal ACE inhibitor dosing with renoprotective intent. However, monotherapy RAAS blockade insufficient for BP and potentially renal protection.',
      connects_to: ['e4', 'e5'],
    },
    {
      id: 'e4',
      type: 'CONSIDERATION',
      title: 'Aldosterone antagonism in resistant HTN',
      body: 'Spironolactone 25-50mg is evidence-based fourth-line agent for resistant hypertension (ACCENT trial: 25mg spironolactone reduced BP by 25/12 mmHg). Also provides aldosterone-mediated renal protection.',
      connects_to: ['e6'],
    },
    {
      id: 'e5',
      type: 'CONSIDERATION',
      title: 'Safety monitoring requirements',
      body: 'Potassium currently 4.9 mEq/L (acceptable). Adding spironolactone requires K+ and creatinine monitoring within 2 weeks to assess for hyperkalemia or worsening renal function.',
      connects_to: ['e6'],
    },
    {
      id: 'e6',
      type: 'DECISION',
      title: 'Spironolactone 25mg as fourth-line agent',
      body: 'Add spironolactone 25mg once daily to existing regimen. Provides BP reduction, aldosterone-mediated renal protection, and evidence-based approach to resistant hypertension. Schedule follow-up labs in 2 weeks.',
      connects_to: [],
    },
  ],

  overallFeedback: `Excellent clinical reasoning for resistant hypertension management. You correctly identified the resistant HTN pattern, assessed the renal implications, and selected an evidence-based fourth-line agent with appropriate safety considerations.

Key strengths:
- Correctly identified resistant HTN and ruled out simple causes
- Recognized CKD as both target organ damage and requiring renal protection
- Selected spironolactone with appropriate evidence citation (ACCENT trial)
- Mentioned essential safety monitoring (K+, creatinine)

Areas for improvement:
- Could emphasize lifestyle factors more explicitly (sodium restriction verification, weight loss)
- Consider mentioning home BP monitoring to confirm office readings
- Could discuss timeline for escalation if BP control not achieved

Next steps:
- Ensure patient understanding of medication regimen
- Verify sodium intake <2g daily
- Schedule 2-week follow-up labs before continuing medication
- Consider cardiology/nephrology referral if BP uncontrolled despite spironolactone`,

  score: 84,

  expertInsight:
    'The critical decision in resistant hypertension is recognizing when standard triple therapy has failed and selecting an appropriate fourth-line agent. Spironolactone is evidence-based (ACCENT trial) and offers dual benefit: BP reduction through aldosterone antagonism AND renal protection through hemodynamic effects. The key safety concern is hyperkalemia, especially with existing RAAS blockade, making careful K+ monitoring essential.',

  expertCalibration: {
    confidence: 5,
    alignment: 89,
  },

  demoScript: [
    { action: 'caseLoad', delay: 300 },
    { action: 'ttsAutoPlay', delay: 400 },

    {
      action: 'typeText',
      text: "Ahmed, 58-year-old with a major problem: blood pressure is 162/98, and he\'s already on three different medications - amlodipine 10mg, lisinopril 40mg, and hydrochlorothiazide 25mg. All of them are at maximum doses. His BP is still uncontrolled. That\'s the definition of resistant hypertension.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd1',
        type: 'OBSERVATION',
        title: 'Resistant hypertension on triple therapy',
        body: 'BP 162/98 despite amlodipine, lisinopril, and HCTZ (all maximal doses). Meets definition of resistant HTN - requires optimization strategy.',
        connects_to: [],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "Now look at his kidneys. eGFR is 38 - that\'s stage 3b CKD. And his albumin-to-creatinine ratio is 185 mg/g, which is moderate albuminuria. His hypertension is damaging his kidneys, and he also needs renal protection.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd2',
        type: 'OBSERVATION',
        title: 'Stage 3b CKD with albuminuria',
        body: 'eGFR 38 mL/min with moderate albuminuria (ACR 185 mg/g). CKD is both target organ damage from HTN and a condition requiring renal protection.',
        connects_to: ['d3'],
      },
      delay: 800,
    },
    { action: 'updateBlockConnection', from: 'd1', to: 'd2', delay: 300 },

    {
      action: 'appendText',
      text: "He\'s on lisinopril 40 mg, which is the maximum dose for ACE inhibitors. ACE inhibitors are renoprotective, which is good. But he\'s not getting blood pressure control. So the question is: what do I add?\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd3',
        type: 'CONSIDERATION',
        title: 'ACE inhibitor already maximized',
        body: 'Lisinopril 40 mg daily is maximal dosing. Has RAAS blockade, but blood pressure still uncontrolled. May need second-order optimization.',
        connects_to: ['d4'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "For resistant hypertension, the evidence suggests a fourth agent, not a second RAAS blocker. I\'m thinking about spironolactone. It blocks aldosterone, which often is part of why resistant HTN patients stay high despite blocking the ACE side of the RAAS.\n\n",
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd4',
        type: 'INTERPRETATION',
        title: 'Need for second RAAS blocker or fourth agent',
        body: 'Current regimen lacks complete RAAS blockade and/or needs additional agent class. Options: dual RAAS blockade (with monitoring) or add spironolactone for aldosterone inhibition.',
        connects_to: ['d5'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: 'The ACCENT trial showed that spironolactone 25mg reduces BP by about 25/12 mmHg in resistant hypertension. And there\'s a bonus here - spironolactone also provides renal protection through aldosterone antagonism.\n\n',
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd5',
        type: 'CONSIDERATION',
        title: 'Spironolactone - aldosterone inhibition',
        body: 'Evidence supports spironolactone 25-50mg in resistant HTN (ACCENT trial). Also provides renal protection via aldosterone antagonism. Monitor potassium at 4.9 (acceptable baseline).',
        connects_to: ['d7'],
      },
      delay: 800,
    },

    {
      action: 'appendText',
      text: "His potassium is 4.9 right now, which is fine. That\'s a baseline where I can safely add spironolactone. But I\'ll need to recheck his K and creatinine in 2 weeks to make sure neither gets worse.\n\n",
      delay: 1200,
    },
    { action: 'selectDrug', drug: 'Aldosterone Antagonist', delay: 600 },

    {
      action: 'appendText',
      text: 'Decision: Add spironolactone 25mg once daily. It\'s evidence-based fourth-line therapy for resistant HTN and also protects his kidneys. Follow-up labs in 2 weeks.',
      delay: 1200,
    },
    {
      action: 'addDiagramBlock',
      block: {
        id: 'd7',
        type: 'DECISION',
        title: 'Add spironolactone 25mg daily',
        body: 'Fourth-line agent for resistant HTN with evidence (ACCENT trial). Provides BP reduction and renal protection via aldosterone antagonism. Monitor K+ and creatinine in 2 weeks.',
        connects_to: [],
      },
      delay: 800,
    },

    { action: 'setConfidence', value: 5, delay: 600 },
    { action: 'submit', delay: 800 },
    { action: 'buildDiagram', delay: 1000 },
  ],
};
