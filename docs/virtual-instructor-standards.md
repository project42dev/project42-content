# Virtual Instructor Standards & Interactive Demonstration Contract

The Project 42 Virtual Teacher is a structured, multimedia learning experience designed to turn static reading into an active, guided digital classroom.

---

## 1. Core Principles: Beyond "Talking Heads"

The Virtual Instructor must never be a passive text-to-speech reader. Every class-ready script (`content/training/*/*/class-script.json`) must provide:

1. **Active Visual Demonstrations (`"kind": "demonstration"`):**
   * Live synchronized code line highlighting during technical explanations.
   * Animated architecture diagrams showing data flow, tool execution, and token transformations.
   * Simulated terminal / REPL execution showing real command output and latency timers.
2. **Interactive Lab Pauses & Handoffs (`"kind": "learner-prompt"`):**
   * The instructor pauses the lesson and hands off control to the learner (`command: "open-activity"`).
   * The learner completes the hands-on exercise in the IDE / sandbox before resuming the class.
3. **Interactive Checkpoints & Real-Time Feedback (`"kind": "checkpoint"`):**
   * Knowledge checks are embedded directly in the class flow.
   * The instructor provides personalized spoken/visual feedback depending on whether the learner answered correctly or needs a retry.
4. **Universal Accessibility:**
   * Every visual scene must include full WebVTT captions (`captions/en-US.vtt`), audio descriptions (`transcripts/en-US.md`), and static reduced-motion alternatives (`alternatives/en-US-reduced-motion.md`).

---

## 2. Supported Class Segment Kinds

| Segment Kind | Purpose & Classroom Behavior | Mandatory Visual / Action Requirements |
| :--- | :--- | :--- |
| **`welcome`** | Class introduction, agenda, and outcome orientation | Show learning path overview & target badge. |
| **`narration`** | Conceptual instruction and architectural mental model | Synchronized visual architecture diagrams. |
| **`demonstration`** | Step-by-step walkthrough of code, tools, or diagrams | Live code highlighting, animated flows, or simulated terminal outputs. |
| **`learner-prompt`** | Instructor pauses and instructs learner to complete a lab | Hands off to interactive lab panel (`open-activity`). |
| **`checkpoint`** | Embedded knowledge check question | Hands off to quiz modal (`open-knowledge-check`) with tailored feedback. |
| **`transition`** | Bridging from one section to the next | Visual recap card and roadmap orientation. |
| **`closing`** | Summary, transcript verification, and badge issuance | Display earned badge and next path recommendations. |
