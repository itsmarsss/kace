export const james = {
    id: "james",
    patient: {
        name: "James",
        age: 61,
        sex: "M",
        avatar: "james",
        chiefComplaint:
            "Newly diagnosed T2DM — referred for medication initiation",
        initialSymptoms: [
            {
                icon: "amber",
                text: "<strong>Polyuria</strong> — increased urinary frequency × 3 months",
            },
            {
                icon: "amber",
                text: "<strong>Polydipsia</strong> — excessive thirst",
            },
            {
                icon: "neutral",
                text: "<strong>Fatigue</strong> — generalised, progressive",
            },
            {
                icon: "warning",
                text: "<strong>Exertional dyspnoea</strong> — on moderate activity",
            },
            {
                icon: "neutral",
                text: "<strong>BMI 33.2</strong> — 98 kg, obese class I",
            },
        ],
    },

    vitals: {
        vitals: {
            unlocked: true,
            label: "Vitals",
            items: [
                { name: "BP", value: "148/92", unit: "mmHg" },
                { name: "HR", value: "78", unit: "bpm" },
                { name: "Temp", value: "37.1", unit: "°C" },
                { name: "SpO₂", value: "98", unit: "%" },
            ],
            graphNode: {
                label: "HTN (148/92)",
                color: "teal",
                x: 0.22,
                y: 0.52,
            },
            sidebarEntry: {
                icon: "teal",
                text: "BP <strong>148/92 mmHg</strong>, HR 78",
            },
        },
        labs: {
            unlocked: false,
            label: "Basic Labs",
            items: [
                { name: "HbA1c", value: "9.1", unit: "%" },
                { name: "eGFR", value: "52", unit: "mL/min" },
                { name: "Creatinine", value: "1.4", unit: "mg/dL" },
                { name: "BMP", value: "WNL", unit: "" },
            ],
            graphNode: {
                label: "eGFR 52 / CKD",
                color: "amber",
                x: 0.65,
                y: 0.28,
            },
            sidebarEntry: {
                icon: "amber",
                text: "eGFR <strong>52</strong>, Cr 1.4, HbA1c 9.1%",
            },
        },
        cardiacHistory: {
            unlocked: false,
            label: "Cardiac History",
            narrative:
                "Patient had an <strong>NSTEMI 8 months ago</strong>. PCI performed, drug-eluting stent placed in LAD. Currently on aspirin + clopidogrel. No prior HF diagnosis at that time.",
            graphNode: {
                label: "Post-MI (8mo)",
                color: "crimson",
                x: 0.72,
                y: 0.48,
            },
            sidebarEntry: {
                icon: "crimson",
                text: "MI 8mo ago — <strong>LAD stent</strong>. On DAPT.",
            },
        },
        echo: {
            unlocked: false,
            label: "Echocardiogram",
            items: [
                { name: "EF", value: "35", unit: "%" },
                { name: "LV", value: "Dilated", unit: "" },
                { name: "Date", value: "3 months", unit: "ago" },
                { name: "Dx", value: "HFrEF", unit: "" },
            ],
            graphNode: {
                label: "HFrEF (EF 35%)",
                color: "crimson",
                x: 0.5,
                y: 0.65,
            },
            sidebarEntry: {
                icon: "crimson",
                text: "Echo: EF <strong>35%</strong> — <strong>HFrEF</strong> confirmed",
            },
        },
    },

    systemContext: `
    Patient: James, 61M, newly diagnosed T2DM.
    HbA1c: 9.1%. BMI 33.2.
    Symptoms: polyuria, polydipsia, fatigue, exertional dyspnoea.
    Revealed so far: [REVEALED_VITALS]
  `,

    expertTrace: [
        {
            type: "match",
            title: "HFrEF as primary decision driver",
            body: "Recognized that cardiac comorbidity (HFrEF, EF 35%) takes precedence over glycemic control alone.",
        },
        {
            type: "match",
            title: "Empagliflozin first-line",
            body: "SGLT2i provides cardiovascular benefit in HFrEF patients with T2DM, supported by EMPEROR-Reduced trial.",
        },
        {
            type: "miss",
            title: "eGFR-gated dosing thresholds",
            body: "Did not explicitly mention that empagliflozin can be initiated at eGFR ≥20, not just ≥30.",
        },
        {
            type: "wrong",
            title: "Metformin as primary choice",
            body: "Metformin is guideline first-line for glycemic control but does not provide the cardiovascular benefit this patient needs.",
        },
    ],

    demoScript: [
        {
            actor: "Kace",
            message: "Let's work through a case together. I'll present a patient, and you'll walk me through your reasoning for selecting a T2DM medication. Ready?",
            delay: 1800,
        },
        { actor: "system", action: "showCase", delay: 800 },
        {
            actor: "Kace",
            message: "James is 61 years old, newly diagnosed with Type 2 Diabetes. What's your initial approach?",
            delay: 2200,
        },
        {
            actor: "user",
            message: "My first instinct is metformin since it's first-line for T2DM. But I want to check his renal function first.",
            confidence: 2,
            typingDelay: "proportional",
            delay: 1500,
        },
        { actor: "system", action: "requestVital", key: "vitals", delay: 1200 },
        {
            actor: "Kace",
            message: "Good instinct to check renal function. His BP is elevated. Why does that matter for your medication choice?",
            delay: 2000,
        },
        {
            actor: "user",
            message: "Hypertension is common in T2DM. Some diabetes medications also help with blood pressure control, like SGLT2 inhibitors.",
            confidence: 3,
            typingDelay: "proportional",
            delay: 1000,
        },
        { actor: "system", action: "unlockVital", key: "labs", delay: 800 },
        { actor: "system", action: "requestVital", key: "labs", delay: 1200 },
        {
            actor: "Kace",
            message: "His eGFR is 52 and HbA1c is 9.1%. How does this change your thinking about metformin?",
            delay: 2200,
        },
        {
            actor: "user",
            message: "eGFR of 52 is Stage 3a CKD. Metformin is still safe here but needs dose adjustment. The elevated HbA1c suggests we need effective glycemic control.",
            confidence: 3,
            typingDelay: "proportional",
            delay: 1200,
        },
        { actor: "system", action: "unlockVital", key: "cardiacHistory", delay: 800 },
        { actor: "system", action: "requestVital", key: "cardiacHistory", delay: 1400 },
        {
            actor: "Kace",
            message: "He had an NSTEMI 8 months ago. Does this history influence which T2DM medication you'd choose?",
            delay: 2400,
        },
        {
            actor: "user",
            message: "Yes, definitely. Post-MI patients with T2DM benefit from medications with proven cardiovascular outcomes. I'm now thinking SGLT2 inhibitor or GLP-1 agonist over metformin.",
            confidence: 4,
            typingDelay: "proportional",
            delay: 1200,
        },
        { actor: "system", action: "unlockVital", key: "echo", delay: 800 },
        { actor: "system", action: "requestVital", key: "echo", delay: 1400 },
        {
            actor: "Kace",
            message: "His echo shows EF of 35% — HFrEF. What's your final medication choice and why?",
            delay: 2600,
        },
        {
            actor: "user",
            message: "With HFrEF confirmed, I'd choose empagliflozin as the primary agent. SGLT2 inhibitors have proven mortality benefit in HFrEF, independent of diabetes control. This addresses both his cardiac risk and his diabetes.",
            confidence: 5,
            typingDelay: "proportional",
            delay: 1500,
        },
        {
            actor: "Kace",
            message: "Strong reasoning. You've successfully integrated multiple comorbidities to reach an evidence-based decision. Let's see how your reasoning compares to an expert's approach.",
            delay: 2000,
        },
        { actor: "system", action: "showOverlay", delay: 1200 },
    ],
};
