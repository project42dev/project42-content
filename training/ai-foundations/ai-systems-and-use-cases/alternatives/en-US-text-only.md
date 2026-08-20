# AI Systems and Useful Work: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class is about choosing useful AI work without treating a model as magic. We will separate the model from the complete system around it, match capability patterns to appropriate tasks, distinguish assistance from automation, and decide where human review must remain. You do not need to know how to train a model. You do need to ask disciplined questions about the outcome, the information used, the actions allowed, the people affected, and what happens when the result is wrong. Those questions work across providers, products, and model families.

## Narration: Complete System Explanation

Artificial intelligence is a broad label for computer systems that perform tasks associated with perception, prediction, language, planning, or decision support. Machine learning is one way to produce that behavior by learning patterns from examples rather than programming every rule. A model is the learned component that transforms inputs into outputs, but a product is never only the model. The complete system also includes instructions, input data, retrieval, software, tools, permissions, user experience, monitoring, and people who own the result. NIST frames AI risk management around products, services, systems, organizations, and affected people, not around an isolated response. That wider view changes evaluation. Ask what information enters, which component supplies it, what the model may propose, what tools may act, which controls limit those actions, how outcomes are measured, and who responds to failure. A fluent answer is one observable output from that system. It does not prove that the input was trustworthy, that a tool succeeded, or that the workflow is safe.

Visual alternative: An AI model sits inside a larger system. Data and instructions enter the model; tools and permissions may enable actions; monitoring and people govern the outcome.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: System Boundary Demonstration

Consider a meeting-summary assistant. In the first design, a person pastes approved notes, the model drafts a summary, and the person edits it before sharing. In the second design, software records every meeting, identifies participants, stores transcripts, drafts decisions, sends messages, and updates a project system automatically. Both may use the same language model, yet they are not the same use case. The second system collects more sensitive data, has more integrations, can affect more people, and can act before a person reviews each output. Its evaluation must include recording consent, access control, retention, participant identification, tool authorization, error recovery, and the correctness of each external update. This comparison shows why model capability is only one row in a system decision. Changing the model does not remove the need to control data or recover from a mistaken action.

Visual alternative: The reviewed assistant uses approved notes and waits for a person. The automated system records sensitive data and performs external actions, creating additional privacy, authorization, and recovery requirements.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Capability Patterns Explanation

A useful starting point is to name the capability pattern before naming a product. Generative systems can draft, summarize, explain, transform formats, extract structure, classify examples, brainstorm alternatives, or reason over material supplied in context. Other AI systems may rank, recommend, forecast, detect patterns, transcribe audio, interpret images, or control a physical process. The label AI does not tell you which capability is present, which evidence it uses, or how reliable it is for your case. Match the pattern to a measurable outcome. If the outcome is a shorter policy summary, define which policy version is authoritative, which facts must remain, who reviews the draft, and how omissions are detected. If the outcome is classifying support requests, define the categories, representative test cases, unacceptable errors, escalation path, and what happens to uncertain cases. Good candidates have suitable data, observable quality, bounded consequences, and controls that match those consequences. A visually impressive demo without a defined outcome is not yet a use case.

Visual alternative: Each capability pattern is paired with a specific outcome, suitable evidence, and a way to test quality. No provider or model name substitutes for those requirements.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs>

## Learner Prompt: Capability Fit Prompt

Choose one task you know well. State the desired outcome in one sentence, then name the capability pattern you would test. Add one piece of trustworthy input and one observable quality signal. Avoid naming a provider until those four items are clear. Pause the class while you write.

Learner action: Write a specific outcome, one matching capability pattern, one trustworthy input, and one measurable quality signal.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Capability Fit Work Time

## Narration: Assistance Automation Explanation

Next, separate assistance from automation. An assistant proposes work for a person to inspect. An automated system may act without a person reviewing every output. The difference is authority, not vocabulary. A model drafting three private alternatives is assistance when the learner chooses whether to use any of them. The same model becomes part of automation when software sends one alternative to customers, changes a record, deploys code, or controls equipment. As authority increases, evaluation must expand beyond answer quality. Test permissions, tool arguments, identity, logging, rate limits, stop conditions, rollback, and recovery from partial failure. Start with assistance when the task is unfamiliar, evidence is incomplete, or errors are expensive. Consider limited automation only after representative evaluation shows dependable behavior and the complete system can observe, contain, and reverse actions. Some tasks should remain unautomated because the evidence is insufficient, affected people need meaningful review or appeal, or the harm cannot be acceptably bounded.

Visual alternative: Each step grants more action authority and therefore requires stronger evidence, permissions, monitoring, stop conditions, and recovery.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Authority Checkpoint

Checkpoint. A system drafts an account-suspension recommendation from supplied evidence, but an authorized person must inspect the evidence and approve any change. Is this assistance or full automation? Name the feature that determines your answer, and identify one control that would still be required.

Learner action: Classify the workflow as assistance because a person retains action authority, then name a control such as evidence access, audit logging, authorization, or appeal.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Authority Response Time

## Feedback: Authority Feedback

A strong answer calls this assistance because an authorized person retains the decision and action. That does not make the system risk free. The reviewer needs the underlying evidence, not only the model recommendation. Access must be limited, the decision should be auditable, affected people may need a correction or appeal path, and the system must not quietly change the record before approval. If you called it automation only because software produced the recommendation, revise your rule: classify the workflow by who has authority to act and whether meaningful review occurs before the consequence.

If correct: You classified the workflow by action authority and preserved controls around evidence, authorization, audit, and correction.

If retrying: Revise the answer by identifying who can perform the consequential action and whether review happens before it.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Human Accountability Explanation

Human accountability does not disappear when an AI output is accurate. People and organizations choose the purpose, acceptable risk, data, model, tools, evaluation method, deployment boundary, and response to harm. A model cannot accept responsibility, hear an appeal, authorize a policy exception, or repair an injured relationship. High-impact uses therefore need named owners, documented review criteria, accessible correction or appeal paths, and evidence that performance is acceptable for the people and situations affected. Accountability also means knowing when not to proceed. If representative evidence is missing, privacy expectations cannot be met, the system cannot be stopped safely, or no one can own recovery, the responsible release mode may be no AI or a narrowly bounded experiment. The goal is not to maximize automation. The goal is to achieve a worthwhile outcome while keeping authority, evidence, and consequences visible to the people responsible for them.

Visual alternative: Accountability remains with people and organizations that choose the purpose, data, controls, action authority, and response when an AI-supported workflow causes error or harm.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://ai.google.dev/responsible/docs>

## Demonstration: Use Case Triage Demonstration

Watch the triage method on two tasks. Task one is drafting three event descriptions from approved facts for an organizer to edit. The outcome is bounded, the input is known, the draft is reversible, and review happens before publication. A sensible first release is assistance with factual and style checks. Task two is automatically denying a person access to an essential service based on incomplete notes. The consequence is high, the evidence is weak, affected people need explanation and appeal, and the proposed action may violate policy or law. The correct first release is not automation. It may be no AI, or a carefully governed decision-support experiment that cannot perform the denial. For each task, write a verification method and a stop condition. This keeps the release decision connected to evidence rather than enthusiasm.

Visual alternative: The low-consequence drafting task uses approved facts and review. The high-consequence denial task lacks sufficient evidence, appeal, and safe authority, so automation is rejected.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Transition: Activity Transition

Now complete the use-case triage activity with four tasks from work, school, home, or a community setting. For each one, name the outcome, input data, capability pattern, affected people, and consequence of error. Choose no AI, reviewed assistance, approval-gated action, or monitored automation. Add one verification method and one stop or rollback condition. Your strongest submission will explain why the highest-risk row receives the strongest human control. You may use the transcript and the static system map while you work.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify the parts of a complete AI system, choose a strong starting task, distinguish assistance from automation, preserve human accountability, and use outcome, data, affected people, consequences, and verification to evaluate a use case. Review any section or the text-only class before submitting. The assessment opens only when you choose Begin knowledge check.

## Closing: Class Closing

Keep one sentence: judge the complete system, not the impressive response. Match authority and controls to the consequence of being wrong, and keep an accountable person able to review, stop, correct, and recover.
