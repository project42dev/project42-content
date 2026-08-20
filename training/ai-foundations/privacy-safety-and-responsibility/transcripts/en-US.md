# Privacy, Safety, and Responsible Use

Package: `privacy-safety-and-responsibility-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. Responsible AI use begins before you type a prompt and continues after a result reaches a person. In this class, you will set a data boundary, scale safeguards to consequence, separate privacy from security, fairness, transparency, and accountability, and build a one-page responsible-use plan. The goal is practical judgment. You should finish able to pause an unsafe request, redesign a risky workflow, and name the person responsible for monitoring and recovery.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Protect Inputs Explanation

Use a pause-before-paste rule. First, identify the information. Then ask whether you are authorized to use it for this purpose. Confirm which product, account, and workspace are approved. Learn what the service retains, who can access the content, whether it may be used for improvement, and how deletion works. Sensitive material includes personal, health, financial, employment, education, customer, and regulated records. It also includes credentials, private keys, confidential source code, unreleased plans, contracts, and legal advice. Ordinary facts can become identifying when combined. A name, work location, schedule, and unusual event may point to one person even when no single field looks secret. Minimize the input before prompting. Remove fields the task does not need. Replace real details with representative values when the result does not depend on identity. Use approved retrieval or controlled data connections when copying would weaken governance. Never place passwords, tokens, or private keys in prompts, examples, screenshots, or transcripts. If policy, authorization, retention, or audience is unknown, stop and resolve the boundary before continuing.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Data Triage Demonstration

Imagine that a manager wants AI to rewrite performance feedback. The original note contains the employee's name, disability accommodation, salary, customer complaint, and a private access token copied from a troubleshooting log. The deliverable is a clearer paragraph about observable work behavior. The name is not needed for drafting. The accommodation and salary are sensitive and outside the writing purpose. The customer detail should be generalized unless an approved reviewer needs exact evidence. The token is a secret and must never enter the system; it also requires rotation if it was exposed elsewhere. The safer input uses a fictional role, removes unrelated personal facts, replaces the customer with a neutral description, and states the permitted tone and decision boundary. The manager still owns the final review. Redaction is not permission. Even a minimized prompt must use an approved product and an authorized purpose.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Pause Before Paste Prompt

Choose one document or data set you might use with AI. Without revealing its contents, classify the information as allowed, restricted, prohibited, or unknown. Name the minimum fields the task requires. If any authorization or product rule is unknown, record that as a stop condition.

Expected learner action: Classify a prospective input, minimize it to the task, and record unresolved authority or policy as a stop condition.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Data Boundary Work Time

## Checkpoint: Data Boundary Checkpoint

Checkpoint. A team removes names from customer support messages and wants to paste the full history into a free public AI account. They do not know the provider's retention settings or whether combinations of dates, locations, and rare incidents can identify customers. Is removing names enough to proceed?

Expected learner action: Stop; identify re-identification, authorization, retention, access, product approval, and minimization questions before any upload.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Data Boundary Response Time

## Feedback: Data Boundary Feedback

Stop. Removing names does not establish that the messages are anonymous, permitted, or protected. Combined facts may identify people. The team must confirm authorization, approved service and account, retention, access, training or improvement use, deletion, contractual terms, and the minimum content needed. A safer design may aggregate categories, use synthetic examples, run an approved controlled service, or avoid the upload. A disclaimer does not repair an unauthorized disclosure. If you chose to proceed because the task seems helpful, revise the rule: expected benefit never substitutes for permission and data governance.

Correct feedback: You recognized that name removal alone does not establish anonymity, authorization, or safe service handling.

Retry feedback: Ask whether indirect identifiers, unknown retention, and an unapproved public account leave the data boundary unresolved. They do.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Risk Follows Consequence Explanation

Risk depends on the use case, not only the model. Compare a private list of picnic ideas with a system that ranks job applicants. The first result is easy to inspect, affects few people, and can be discarded. The second can shape access to employment, may affect many people, can reproduce historical disadvantage, and may be difficult for an applicant to detect or correct. Evaluate consequence, exposure, reversibility, affected people, data sensitivity, uncertainty, and the system's power to act. Increase evidence, testing, access control, qualified review, monitoring, documentation, and recovery as those factors rise. Keep AI assistance away from the final decision when reliable oversight cannot be demonstrated. Some uses should not launch because the residual harm remains unacceptable. Human review is not magic. A reviewer needs time, authority, relevant expertise, evidence, and a real ability to reject or correct the output. A rubber-stamp approval adds ceremony without control.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs/design>

## Narration: Responsible Dimensions Explanation

Responsible use requires several distinct questions. Privacy asks whether data collection, use, retention, sharing, export, and deletion are appropriate. Security asks whether unauthorized people or instructions can access data, change behavior, misuse tools, or escape controls. Safety asks what harms can occur during intended use, foreseeable misuse, or failure. Fairness asks whether error rates, access, burdens, or outcomes differ unacceptably across people and situations. Transparency asks whether users and affected people understand that AI is involved, what role it plays, which limits matter, and how to question an outcome. Accountability names the people and organization that approve, operate, monitor, investigate, correct, and retire the workflow. A system can be strong in one dimension and weak in another. Encryption does not prove fairness. A fairness benchmark does not prevent credential theft. A disclosure banner does not create an appeal path. Content filtering does not establish factual accuracy. Treat these dimensions as connected lenses, then translate each material concern into an owner, test, control, and recovery path.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs>

## Checkpoint: Secure But Opaque Checkpoint

Checkpoint. An AI-supported benefits workflow encrypts its data, restricts administrator access, and records every request. Affected employees are not told AI is involved. They receive no explanation, correction path, or named decision owner. Which dimensions remain materially weak?

Expected learner action: Identify transparency and accountability as weak, while noting that fairness and outcome quality still require separate evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Responsibility Response Time

## Feedback: Responsibility Feedback

Transparency and accountability are clearly weak. People need to understand AI's role and important limitations. They need a usable path to ask questions, correct records, appeal an outcome, and reach an accountable owner. The security controls are valuable, but they do not answer whether the workflow is accurate or fair. Those claims require representative evaluation and impact evidence. If you answered privacy alone, separate data handling from notice and recourse. If you answered that encryption makes the system responsible, remember that one strong dimension cannot substitute for the others.

Correct feedback: You separated strong security controls from missing transparency, recourse, and accountable ownership.

Retry feedback: Ask who explains the AI role, who corrects an error, and who owns the decision. The workflow provides no answer.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Build Controls Explanation

Build controls around the whole workflow. Start with purpose, owner, intended users, affected people, approved data, prohibited data, expected behavior, and excluded decisions. Map plausible misuse and failure. Define launch criteria and tests using representative cases, including difficult and adversarial examples. Prevention controls can minimize data, scope credentials, allowlist tools, filter inputs, validate formats, rate-limit use, and require approval before consequential actions. Detection controls can compare outputs to evidence, monitor quality and disparity metrics, record audit events, detect unusual access, and collect user reports. Response controls assign triage, notification, correction, containment, and escalation. Recovery controls restore records, roll back releases, revoke access, provide appeal, and retire an unsafe feature. Google describes policy, evaluation, and safeguards as layers; it also warns that classifiers can produce false positives and false negatives. Measure the safeguards themselves. Document residual risk and who accepted it. Monitor after launch because data, models, users, attacks, and operating conditions change. Set a re-evaluation trigger, a stop condition, and a retirement owner before the first real user is affected.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs/design>
- <https://ai.google.dev/responsible/docs/evaluation>
- <https://ai.google.dev/responsible/docs/safeguards>

## Transition: Activity Transition

Open the responsible-use plan activity. Choose one realistic AI-assisted use case. State its purpose, named owner, intended users, affected people, and excluded decisions. List allowed, restricted, prohibited, and unknown input data. Describe plausible failures and rate their consequence, exposure, and reversibility. For every high-severity risk, add at least one preventive control and one detection or recovery control. Define verification, qualified human approval, permissions, monitoring, incident response, correction, appeal where relevant, and retirement. Finish with one condition that blocks launch and one metric or event that triggers re-evaluation. If you cannot name an owner or recovery path, the plan is not ready.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will decide when minimization occurs, scale safeguards to consequence, identify missing transparency and accountability, choose layered controls for important records, and assign responsibility to people and organizations rather than a model. Review the class or return to your plan before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Pause before data crosses the boundary. Scale controls to consequence. Test every responsibility dimension. Keep an accountable person able to stop, correct, recover, and retire the workflow.
