# KaCE: Knowledge Acquisition through Case Exploration

## Inspiration

Medical education has long relied on a familiar ritual: read, memorize, test, repeat. Question banks and flashcard systems flood students with _what_ (the right answer, the drug name, the diagnosis code) but rarely demand _why_. We saw this gap firsthand as science and health sciences students: the dissonance between rote memorization and the clinical reasoning that actual patient care demands.

Our inspiration came from watching peers cram pharmacology lists before exams, only to freeze when presented with a real (or simulated) patient whose messy presentation didn't match the textbook. We asked ourselves: **what if a learning tool could force you to think out loud, expose the gaps in your reasoning, and give you targeted feedback on your thought process, not just your final answer?**

That question became KaCE.

---

## What We Learned

Building KaCE taught us things that no lecture could:

**On the clinical side**, we dove deep into three learning science frameworks: _Script Theory_, _Metacognition_, and _Deliberate Practice_ and discovered how elegantly they complement each other. Script Theory explains how clinical experts pattern-match through illness scripts built from experience. Metacognition gives learners the tools to interrogate their own confidence and reasoning. Deliberate Practice closes the loop with structured feedback and repetition. Grounding our design in these theories wasn't just academic window-dressing; it shaped every decision we made about how the interface should _feel_ to a learner.

**On the technical side**, we learned to orchestrate multiple AI models with distinct roles. Using Claude Sonnet 4 for deep reasoning analysis and Gemini 2.5 Flash for real-time diagram generation required careful prompt engineering and thinking about latency, as a slow feedback loop would break the learning flow entirely.

---

## How We Built It

KaCE is a seven-step active learning loop, scaffolded around a realistic patient case drawn from clinical data:

1. **Patient Intake:** Learners review vitals, labs, history, and symptoms through a conversational patient interface.
2. **Treatment Selection:** Users choose a treatment category (pharmacological, insulin, surgical, holistic, etc.), then drill into specific options.
3. **Free-Form Reasoning:** Learners type or speak their full clinical rationale, with no multiple choice and no shortcuts.
4. **Real-Time Diagram Generation:** As the learner types, Gemini 2.5 Flash parses their reasoning and organizes it into live visual diagrams categorized as _Observations_, _Interpretations_, and _Contraindications_.
5. **Confidence Self-Assessment:** A slider captures the learner's subjective certainty before submission, feeding the metacognitive measurement layer.
6. **Submission**
7. **AI Feedback:** Claude Sonnet 4 compares the learner's reasoning against an ideal clinical approach, produces an accuracy score, and generates targeted written feedback highlighting what was accurate, what needs review, and additional clinical insights.

The frontend was built with **React 18 + TypeScript + Tailwind CSS + Vite**, with **Cartesia's Ink-Whisper** powering real-time text-to-speech for the voice input pipeline. The backend (FastAPI + MongoDB) is architected but planned for the next development phase.

---

## Challenges We Faced

**Prompt engineering for pedagogical feedback** was harder than expected. An LLM giving feedback on clinical reasoning can easily default to being either too harsh (discouraging novice learners) or too vague (useless for improvement). We iterated extensively on Claude's system prompt to produce feedback that is specific, constructive, and grounded in the actual case data, rather than generic clinical advice.

**Real-time diagram generation** introduced latency challenges. Generating structured visual output on every keystroke required careful debouncing and streaming strategies to avoid the interface feeling sluggish during the reasoning phase.

**Scoping the MVP** was a constant tension. The full vision of KaCE includes adaptive case repetition, a Teacher Mode for error-correction exercises, and multi-disease problem sets. Ruthlessly prioritizing the core learning loop (patient intake, reasoning, and feedback) while leaving the architecture extensible was a discipline we had to consciously practice throughout the hackathon.

**Quantifying metacognition** meaningfully is a genuinely hard research problem. Designing a confidence scale that captures calibration rather than just sentiment, and mapping it to a mock experimental protocol modeled after Flemming & Lau (2014), pushed us to think beyond product design into research methodology.

---

## What's Next

KaCE's future roadmap includes:

- **Expanded diagnosis coverage** beyond Type 2 Diabetes, incorporating full diagnostic pathways (imaging orders, lab interpretation, differential diagnosis)
- **Adaptive spaced repetition:** automatically surfacing cases the learner has historically struggled with
- **Teacher Mode:** where advanced learners identify and correct errors in deliberately flawed clinical reasoning
- **Longitudinal progress tracking** and a goals/incentive system to sustain deliberate practice over time
- **A formal validation study** with pre-clinical medical students to measure whether KaCE measurably improves metacognitive accuracy versus standard instruction
