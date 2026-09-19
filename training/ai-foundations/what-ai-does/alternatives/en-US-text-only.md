# What AI Does—and Does Not Do: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. In this beginner class, you will separate five parts: model, application, retrieval, tool, and agentic workflow. You will then test generated reminders against supplied evidence, correct only conflicting claims, and avoid guessing about hidden causes. The central rule is simple: useful generation is not automatic evidence. By the end, you should know when to verify, narrow, or stop an AI-assisted task.

## Narration: Model Product Workflow Explanation

Begin with the parts. A model is a mathematical construct that processes input data and returns output. In a language model, inputs and outputs are tokens, which may be words, characters, or parts of words. A prompt is text supplied to condition behavior, and inference is when a trained model generates a response. A context window is the finite number of tokens the model can process in a prompt. An application is the larger product around the model. It may connect an interface, files, policies, retrieval, tools, and code. Retrieval locates stored material and supplies selected material for use; the retrieved note remains the factual source. Here, a tool means callable software that performs a defined operation outside the model. An agent can plan and execute actions for a user, while an agentic workflow can sequence permitted steps, state, tools, feedback, and model-directed continuation. Keep the labels separate: the model generates, the application coordinates, retrieval locates, the tool operates, and the workflow sequences actions.

Visual alternative: Application coordinates the interface and components. Retrieval locates material. A tool performs a defined operation. The model generates output. An agentic workflow sequences permitted actions.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Capabilities Explanation

Generative systems can explain, summarize, transform, classify, extract, compare, brainstorm, translate, draft, write code, and analyze supplied data. A multimodal model accepts or produces more than one modality, such as images and text. These are task categories, not guarantees that every application supports them or performs them correctly. Generated statements may be fabricated, stale, broad, biased, inconsistent, or unsupported. The glossary calls plausible-seeming but factually incorrect real-world output a hallucination. When supplied evidence shows a mismatch but not its internal cause, use the observable description unsupported or conflicting statement. Do not infer whether retrieval, prompting, generation, code, or another detail caused it. Also, models do not automatically know private records, current events, local policies, or unstated intent. Ask whether relevant evidence was supplied and whether the final answer accurately reflects it. Fluent wording is an output characteristic, not independent evidence.

Visual alternative: Capabilities include explanation, transformation, classification, drafting, and multimodal work. Limitations include unsupported, stale, biased, or conflicting statements. Fluency is not evidence.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Fictional System Assumptions

The Community Desk Assistant is fictional, not a real product. For this scenario, assume its application contains a language model, retrieval over staff notes, a date-difference tool, and an agentic workflow. Retrieval returns exactly the two shown notes. The tool receives date-only inputs in the same timezone and calendar context. It counts midnight-to-midnight transitions and excludes the starting date. Therefore, October 5, 2026, to October 10, 2026, is 5 elapsed whole days, although inclusive naming covers 6 calendar-date labels. Assume the workflow may retrieve, call the tool, request a draft, and present it for review, but cannot send or publish it. A person must inspect and approve the draft. These are exercise assumptions, not claims about commercial systems. No account, setup, code, or web search is required.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Worked Example Inputs Explanation

Now inspect the complete pottery input. On Monday, October 5, 2026, an employee requests exactly two sentences with the full pickup date, time, room, and elapsed whole days, using the most recent note and adding nothing unsupported. Note A, updated September 30, says pickup is Saturday, October 10, 2026, from 10:00 a.m. to 12:00 p.m. in Room B, and replaces the September 15 note. Note B gives the same date but 9:00 a.m. to 12:00 p.m. in Room A. The supplied tool result is 5 elapsed whole days under the stated transition rule. The candidate says Saturday, October 10, from 10:00 a.m. to noon in Room A, then says pickup is 5 days after October 5. Treat notes and tool output as evidence, and the candidate as a draft.

Visual alternative: The request requires two sentences. Note A says October 10 from 10 a.m. to noon in Room B and replaces note B. The tool gives 5 days. The candidate incorrectly says Room A.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Learner Prompt: Worked Input Claim Prompt

Identify the candidate's date, time, room, and elapsed-day claims. Compare each claim separately with note A and the supplied tool result before deciding what requires correction. Treat the pottery inputs and notes shown here as the complete evidence for this exercise.

Learner action: Identify all four factual claims and compare each one with the governing note or supplied tool result.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Pause: Worked Input Comparison Pause

## Narration: Worked Reasoning Explanation

Use seven decisions. First, restate the bounded request: two sentences containing specified fields. Second, choose note A because September 30 is later than September 15, and note A explicitly replaces the older note. Third, check claims separately. October 10 matches note A. Ten until noon matches note A. Five days matches the supplied tool result and means five transitions excluding October 5, not six inclusively named dates. Room A conflicts with note A's Room B. Fourth, describe only that observable conflict. The evidence does not reveal why the wording appeared. Fifth, replace only the room while preserving supported details and the two-sentence format. Sixth, map the process: the application coordinates, retrieval locates notes, the tool supplies 5, the model drafts, and the workflow sequences steps before human review. Seventh, preserve authority: note A supports event details, and the tool result supports the count.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Demonstration: Pottery Correction Demonstration

Here is the precise correction. The conflicting claim is Room A. Note A says Room B and governs because it is newer and replaces the older note. Read the corrected answer exactly: “Pottery pickup is Saturday, October 10, 2026, from 10:00 a.m. to 12:00 p.m. in Room B. Pickup is 5 days after October 5, 2026.” This keeps the supported date, time, and count, changes only the room, and remains exactly two sentences. We can establish the mismatch and correction, but we cannot establish a hidden model cause.

Visual alternative: Candidate answer says Room A. Corrected answer says Room B. Both retain Saturday, October 10, 2026, 10 a.m. to noon, and 5 days after October 5.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Checkpoint: Cause Boundary Checkpoint

Checkpoint. Which statement is justified: “Room A conflicts with governing note A,” or “the model definitely copied the older note”? Choose the first. Evidence shows the conflict but not the internal cause. Keep that distinction whenever you review generated factual claims.

Learner action: Select the observable conflict statement and reject the unsupported claim about the hidden cause.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Component Map Explanation

Map each role without blurring evidence. The model generates reminder prose from the prompt and supplied context. The application provides the interface, sends selected context, exposes the tool, enforces no-publishing permission, and displays the draft. Retrieval locates both notes, but does not make either note true or decide every claim. The date tool performs the stated operation and supplies 5 elapsed whole days. The agentic workflow sequences retrieval, the tool call, drafting, and the pause for approval. The source boundary remains clear: note A supports date, time, and room; the tool result supports the count; the model is the drafting component. Verification therefore means change Room A to Room B, preserve supported claims, and approve only the corrected draft.

Visual alternative: Model drafts. Application coordinates. Retrieval locates notes. Tool calculates 5. Agentic workflow sequences steps and pauses. Note A and the tool result are the factual sources.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Learner Variation Inputs Explanation

Now use Library Message Helper, another fictional application with the same component pattern and a staff approval stop. On Tuesday, November 3, 2026, the request asks for exactly two sentences about robotics club, using the most recent notice. It requires the full date, time, room, elapsed whole days, and supported laptop information. Notice A, updated October 28, says Tuesday, November 10, 2026, at 4:30 p.m. in Lab 2, with library laptops provided, and replaces the October 20 notice. Notice B instead gives November 9, 4:00 p.m., Lab 1, and says members should bring laptops. The supplied tool result is 7 transitions excluding November 3. The candidate preserves notice A's meeting details and count, but says, “Bring your own laptop.”

Visual alternative: Notice A says robotics club is Tuesday, November 10, 2026, at 4:30 p.m. in Lab 2 and library laptops will be provided. The candidate instead says to bring a laptop.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Learner Variation Task Explanation

Write four labeled lines. Line one, Governing source: name notice A or B and justify the choice with its date or replacement statement. Line two, Mistake: identify the single candidate claim that conflicts with the governing notice. Line three, Corrected answer: write exactly two sentences containing supported meeting details, 7 elapsed days, and laptop information. Line four, Component map: distinguish the model, application, retrieval, tool, and agentic workflow. Use only supplied evidence. Keep the 7-day result under the transition convention, and do not change details that already match notice A. Do not call the model the source. Before checking the key, confirm that your response has all four labels and exactly two sentences in the corrected reminder.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Checkpoint: Learner Variation Prompt

Practice checkpoint. Complete the four labeled lines using only the library request, notices, supplied tool result, and fictional assumptions. Do not search the web or add details. Submit your response before opening the separate explained answer key.

Learner action: Complete the linked activity activity-ai-evidence-boundary-check by writing the governing source, the one conflicting mistake, exactly two sentences containing the supported date, time, room, seven-day value, and laptop information, and a five-part component map.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Pause: Learner Variation Work Time

## Narration: Learner Answer Key Explanation

Compare your work with the key. Governing source: Notice A, updated October 28, because it is later than October 20 and explicitly replaces that notice. Mistake: “Bring your own laptop” conflicts with notice A, which says library laptops will be provided. Corrected answer: “Robotics club meets Tuesday, November 10, 2026, at 4:30 p.m. in Lab 2, which is 7 days after November 3, 2026. Library laptops will be provided.” Component map: the model drafts; the application coordinates the interface and components; retrieval locates both notices; the date tool supplies 7; and the workflow sequences permitted operations before staff approval. The first sentence preserves notice A's date, time, and room, plus the tool's count. The second replaces only the unsupported laptop instruction. It adds no reservation, arrival, cost, or registration claim.

Visual alternative: Notice A governs. Bring your own laptop is the mistake. The correction keeps November 10 at 4:30 p.m. in Lab 2, keeps 7 days, and says library laptops will be provided. Each component has a distinct role.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Feedback: Learner Answer Specific Feedback

Here is the explained answer key. Notice A is the governing current notice because it is dated October 28 and contains the replacement statement. The one conflict is “Bring your own laptop.” Replace that claim with “Library laptops will be provided.” Keep the supported meeting details: November 10, 4:30 p.m., and Lab 2. Keep the supplied seven-day value, rather than changing it to eight inclusive calendar-date labels. The corrected answer must contain exactly two sentences with those supported details and the current laptop information. Remove reservation, arrival, cost, or registration instructions because the supplied evidence does not support them. The model drafts, the application coordinates, retrieval locates the notice, the date tool calculates the count, and the agentic workflow sequences the steps and handles the approval handoff. A justified alternative can use different wording or label order if it preserves these same evidence boundaries and assigns the five roles distinctly.

If correct: Your response chooses notice A as the current governing notice, identifies the laptop conflict, preserves the supported meeting details and seven-day value, and assigns all five components distinct roles. A justified alternative wording is acceptable when it preserves those evidence boundaries.

If retrying: Choose the current replacing notice, change only the laptop instruction, keep November 10, 4:30 p.m., Lab 2, and the supplied seven-day value, and distinguish the model, application, retrieval, date tool, and agentic workflow roles. Retain 7 midnight-to-midnight transitions under the exercise convention, not 8 inclusive calendar-date labels. In a real task, establish the intended counting convention before relying on the result.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Narration: Practical Verification Explanation

Use this five-step method beyond the examples. First, restate the requested output and constraints, including length, required fields, permitted sources, and forbidden additions. Ask for clarification when intent is ambiguous. Second, separate every factual claim and match each one to a supplied source or explicit tool result. Third, resolve conflicts only with a rule supplied by the request or evidence. Fourth, correct narrowly: preserve supported content, remove unsupported additions, and expose missing evidence instead of guessing. Fifth, preserve appropriate human authority. In these scenarios, publishing stops for approval. In other work, review depends on the real task, permissions, consequences, and evidence. Common misconceptions are that fluency proves truth, that retrieval makes every draft accurate, that a visible error reveals its hidden cause, or that an agent may exceed application permissions. Reject each misconception. Ask separately: what can the system produce, and what evidence supports this particular output?

Visual alternative: Restate constraints, separate claims, match evidence, resolve conflicts by supplied rules, correct narrowly, and preserve human authority. Fluency, retrieval, visible errors, and agentic behavior do not erase evidence or permission boundaries.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Checkpoint: Unsupported Fact Checkpoint

Final checkpoint. These are fictional practice scenarios, not source facts. Scenario 1: A supplied fictional notice says, “The workshop is in Room 4 at 2:00 p.m.,” and a newer fictional notice says, “The workshop is in Room 5 at 2:00 p.m. This notice replaces the earlier notice.” The candidate answer keeps Room 4 but correctly states the time. Choose Verify, Narrow, Correct, or Stop, and explain which claim should be preserved or changed. Scenario 2: A fictional request asks for the event cost, but the supplied fictional notices give the date, time, and location and say nothing about cost. The draft says, “Admission is free.” Choose Verify, Narrow, Correct, or Stop, and explain what an evidence-preserving response would do. Select and justify one response for each scenario. Do not reveal your answers until after the pause.

Learner action: For each explicitly fictional scenario, choose and justify an evidence-preserving response by preserving supported claims, correcting a claim that conflicts with governing evidence, verifying or narrowing an unsupported requirement, or stopping when safe completion is not possible.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Pause: Unsupported Fact Checkpoint Pause

## Feedback: Unsupported Fact Checkpoint Feedback

Here is the explained answer key. In fictional Scenario 1, Correct is justified because the newer fictional notice directly conflicts with only the room claim, so preserve the supported time and correct the room using the replacing notice. Verify is also justified if you explain that the newer notice must first be checked as the governing source. In fictional Scenario 2, Narrow is justified by omitting the unsupported cost claim, Verify is justified by requesting evidence before stating a cost, and Stop is justified if the required cost cannot be established and the task cannot safely be narrowed. Correct is not justified by guessing a price or inferring that admission is free. If evidence supports most claims but one conflicts, preserve the supported claims and correct only the conflict. If a required fact has no support, report it as unsupported, request evidence, narrow the task, or stop. These fictional scenarios illustrate the method and are not real notices or policy statements.

If correct: You preserved supported claims and either corrected the conflicting room claim or verified the governing fictional notice. For the missing cost, you narrowed the task, requested evidence, or stopped rather than guessing.

If retrying: Recheck each claim against the supplied fictional evidence. Preserve the supported time, correct or verify the conflicting room using the replacing notice, and do not state a cost that the notices do not support. A justified alternative is acceptable when its reasoning preserves the same evidence boundary.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Transition: Activity Transition

Open the evidence-boundary activity. Submit four labeled lines: Governing source, Mistake, Corrected answer, and Component map. Success requires four evidence items: choosing notice A from its October 28 date or replacement statement; identifying “Bring your own laptop” as the conflict; producing the exact two-sentence supported reminder with November 10, 4:30 p.m., Lab 2, 7 days, and library laptops provided; and assigning drafting to the model, coordination to the application, notice location to retrieval, calculation to the tool, and sequencing plus approval handoff to the workflow. No external account is needed.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Assessment Handoff: Assessment Handoff

When you are ready, open the six-question knowledge check. It tests component boundaries, the pottery evidence source, conclusions permitted by a visible conflict, agentic sequencing, the supported library correction, and what to do when evidence is missing. Review the lesson or activity first if needed. Begin only when you choose the knowledge check control.

Sources:

- <https://developers.google.com/machine-learning/glossary>

## Closing: Class Closing

Recap the method. Models generate outputs. Applications connect interfaces, evidence, code, and permitted operations. Retrieval locates stored material. Tools perform defined operations. Agentic workflows choose and sequence allowed actions. Useful capabilities never guarantee factual accuracy. Verify each claim against its proper source, describe conflicts without inventing causes, correct only what evidence supports, and keep consequential action within human authority.

Sources:

- <https://developers.google.com/machine-learning/glossary>
