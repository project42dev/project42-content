# Project 42 Curriculum Authoring Standards & Quality Contract

This standard governs all content authoring within Project 42. Every module authored by AI agent ensembles (Orchard) or human contributors must strictly adhere to these quality contracts.

---

## 1. Structural Mandates

Every module (`content/modules/*/*.json`) must be a fully developed, self-contained educational unit containing:

1. **Title & Summary:** Action-oriented, hype-free title and a 2-3 sentence executive summary explaining what the learner will build, understand, and evaluate.
2. **Measurable Objectives:** 3 to 5 Bloom-taxonomy aligned learning objectives (e.g., *Explain, Implement, Evaluate, Defend*).
3. **Deep Conceptual Sections (Minimum 3-4 Sections):**
   - **No Placeholder Paragraphs:** Each section must contain **at least 150–250 words** of thorough, technically rigorous explanation.
   - **Concrete Numbers & Realities:** Cite concrete numbers (token counts, latency benchmarks, memory overhead, cost trade-offs).
   - **Visual Callouts:** Include critical engineering takeaways and rules of thumb.
4. **Concrete, Syntax-Highlighted Code / Architecture Snippets:**
   - Every technical module must include at least one complete, syntax-highlighted code block (TypeScript, Python, cURL, or structured JSON schema).
5. **Interactive Hands-On Lab / Activity:**
   - Must not be vague ("Think about AI...").
   - Must provide **Step 1 through Step N actionable instructions** with runnable commands, expected outputs, evidence artifacts, and a thought-provoking reflection prompt.
6. **Robust Knowledge Checks (Quizzes):**
   - Minimum 3-5 multiple-choice questions per module.
   - **Mandatory Distractor Explanations:** Every single option (`options[i].feedback`) must provide clear, pedagogical feedback explaining *why* it is correct or *why* it fails.
7. **Dual-Modality Virtual Instructor Script:**
   - Synchronized narration cues, visual slide cues, and full accessibility alternatives for screen readers and reduced-motion environments.

---

## 2. Voice, Tone & Pedagogical Principles

* **Provider-Neutral First:** Teach fundamental principles before provider-specific APIs. When showing provider code (OpenAI, Anthropic, Gemini, OSS), clearly demarcate portability boundaries.
* **Evidence-Driven:** Fluency is not truth. Emphasize verification, evaluations, unit tests, and runtime postconditions.
* **Security & Failure-Aware:** Always analyze failure modes, edge cases, cost ceilings, and threat models (prompt injection, tool permissions, state corruption).
