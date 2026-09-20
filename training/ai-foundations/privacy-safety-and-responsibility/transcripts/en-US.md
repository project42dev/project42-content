# Privacy, Safety, and Responsible Use

Package: `privacy-safety-and-responsibility-class` 1.1.0

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

## Narration: Fictional Supplied Dossier Narration

This exercise uses a fictional organization called Harbor Hands Community Network. Its fictional policy permits public data for drafting. Restricted internal data requires an approved organizational account, a documented purpose, coordinator authorization, and minimum necessary fields. Prohibited data includes credentials, private keys, health records, financial account information, government identifiers, and real-person identifying information. Unknown product processing, retention, access, deletion, or improvement-use terms block launch. This fictional policy provides no legal guarantee. The supplied fictional dossier contains public records for Riverbend Repair Day: the event name, date, venue, and four open roles. It contains restricted records for three synthetic roster labels: V-17, V-23, and V-31, with availability, training, accessibility requirements, and coordinator notes. It also contains prohibited withheld-category labels for a health detail, financial detail, government identifier, password, and access token. The withheld-category labels are deliberately noncredential labels, not secrets and not credential-shaped examples. They must not be replaced with passwords, tokens, keys, or other secret-like strings. The task is to draft internal volunteer task assignments. The task needs role capacity, availability, relevant training, and stated task accommodations. It does not need a diagnosis, bank information, government identifier, password, access token, or unnecessary identifying detail. A pseudonym can still identify someone when combined with a rare schedule, role, location, or unusual event. Before any product is used, the coordinator must confirm authorization, approved workspace, access, retention, deletion, and improvement-use terms. If any boundary is unknown, stop or use a manual process.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Fully Worked Plan Narration

The purpose of the worked example is limited to proposing internal draft assignments for four event roles. The volunteer coordinator owns approval, monitoring, correction, incident response, and retirement. Volunteers, the coordinator, visitors, and staff who depend on safe coverage may be affected. The plan treats prohibited or unnecessary disclosure, unsuitable assignment or failure to accommodate, unsupported recommendation, and unauthorized publication as material risks. The exact minimized prompt input is: "Purpose: Suggest internal draft assignments for Riverbend Repair Day. Do not make a final decision, contact anyone, or change records. Event: Riverbend Repair Day, 2026-10-17, North Hall. Roles: welcome desk, tool check-in, room setup, closing inventory. Available synthetic roster: V-17: available 08:00-12:00; trained for tool check-in; needs a seated task and nearby restroom; prefers written instructions. V-23: available 09:00-16:00; trained for welcome desk; speaks Spanish and English. V-31: available 07:30-10:00; trained for room setup. Constraints: use only stated availability and training. Do not infer health, identity, reliability, or suitability beyond the supplied facts. Return a draft with a reason tied to the supplied facts and flag every uncovered role or uncertainty for manual review. A coordinator must approve every assignment." The volunteer labels are retained only as local synthetic roster references so the coordinator can map a draft to the roster. Retained fields are the event date and venue, availability, training, seated-task requirement, nearby-restroom requirement, written-instructions preference, and language ability because they directly constrain the assignment. The diagnosis is omitted because the accommodation is sufficient for this task and the diagnosis is unnecessary health information. The bank detail, government identifier, password category, and access-token category are omitted because they are prohibited and irrelevant. The rare key-holder detail is omitted because it is unnecessary and could increase identifiability when combined with time and venue. No product approval, retention term, or tested model behavior is asserted. Mandatory pre-action approval is distinct from quality auditing. Every proposed assignment must receive coordinator approval before it is communicated, published, or used. A later quality audit is a separate check performed on a defined sample of eligible completed assignments. Auditing never substitutes for the 100 percent pre-action approval requirement. Controls include redaction before entry, an approved account and workspace, least-privilege access, no messaging or record-editing tools, fixed role and availability fields, and mandatory human approval. Detection includes comparing every draft assignment with the source roster before approval, recording the reviewer and decision, logging the prompt version, and collecting volunteer corrections. Recovery is owned by the coordinator: pause publication, review the prompt, output, access log, and source roster, correct the assignment or roster, notify affected volunteers, revoke access and escalate if prohibited data was exposed, and restore the last approved manual roster. The operations director owns retirement approval. This fictional worked plan covers only internal draft assignments for Riverbend Repair Day on 2026-10-17. The volunteer coordinator owns approval, monitoring, correction, incident response, and recovery. Monitoring uses the fixed event window from 2026-10-03 through 2026-10-31, inclusive. The coordinator records the actual observation counts, numerator, denominator, and window dates. No observation or count is asserted here. Every proposed assignment requires documented coordinator approval before it is communicated, published, or used. The pre-action approval metric is separate from quality auditing: numerator is the number of proposed assignments with approval recorded before the action; denominator is all proposed assignments in the monitoring window; threshold is 100 percent. A quality audit cannot substitute for this requirement. Any missing approval triggers an immediate pause, prevents communication or use of the affected assignment, and requires the coordinator to review the source roster, prompt, output, and access log before deciding whether to correct, notify, revoke access, or restore the approved manual roster. Unsupported-assignment rate is measured over the fixed event window. Numerator is the number of approved assignments containing at least one assignment claim not supported by the permitted roster fields or event records. Denominator is all eligible assignments that were actually approved and reviewed during the window. An eligible assignment is one that reached the relevant event in scope and had a recorded assignment outcome during the window. Threshold is 0 percent. Any unsupported assignment triggers an immediate pause. The coordinator must quarantine the affected draft, compare it with the source roster, correct the assignment or roster as appropriate, document the decision, notify affected volunteers when warranted, and choose continue, redesign, manual-only, or retirement after investigation. Prohibited-input-event rate is measured over the fixed event window. Numerator is the number of prompts submitted during the window that contain any prohibited input. Denominator is all prompts submitted during the window for this use case. Threshold is 0 percent. Any prohibited-input event triggers an immediate pause. The coordinator must stop further prompting, preserve the incident record, identify what was exposed and to whom, revoke access when necessary, notify affected people when warranted, escalate under the fictional organization's policy, and restore the approved manual process before any restart decision. Unreviewed-publication rate is measured over the fixed event window. Numerator is the number of assignments published without a coordinator approval record made before publication. Denominator is all assignments published during the window. Threshold is 0 percent. Any unreviewed publication triggers an immediate pause. The coordinator must remove or quarantine the publication where possible, preserve an audit record, review the output and access log, correct or retract the assignment, notify affected recipients when warranted, and decide whether to continue, redesign, operate manually, or retire the use. Volunteer-correction rate is measured over the fixed event window. Numerator is the number of eligible assignments communicated during the window that receive a substantiated volunteer correction about availability, training, task accommodation, or another permitted assignment fact. Denominator is all eligible assignments communicated during the window. Threshold is below 5 percent. A rate at or above 5 percent triggers an immediate pause and investigation. The coordinator must correct affected assignments, review the prompt and source-roster transformation, contact affected volunteers as appropriate, record the root cause and corrective action, and choose continue, redesign, manual-only, or retirement. The coordinator also performs a quality audit as a separate detective control. For every audited eligible completed assignment, the coordinator compares the draft with the permitted source roster and records whether the assignment was supported, suitable for the stated task constraints, and correctly communicated. The audited sample, its numerator and denominator, and its selection method must be recorded when monitoring begins. The audit does not waive the 100 percent pre-action approval rule and cannot establish the absence of rare failures. Small samples must be reported with their numerator and denominator and a limitation statement, and must not be treated as representative evidence. If any metric has a denominator of zero, its result is UNKNOWN, not zero percent. If no assignments, prompts, publications, or communications occurred in the relevant category, the coordinator reports UNKNOWN and states the missing observation. A rate below 5 percent does not establish safety when the denominator is zero or too small for a meaningful decision. After each pause, the coordinator documents one of four responses: continue with controls unchanged, redesign the workflow or input boundary, operate manual-only, or retire the use. The operations director owns retirement approval. The worked plan is authored instructional content. It is not evidence of a live deployment, benchmark, vendor retention practice, or tested model behavior. Manual work is always valid when product terms, evidence, controls, or staffing are inadequate.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs/evaluation>
- <https://ai.google.dev/responsible/docs/safeguards>

## Narration: Independent Changed Case Narration

Here is a changed case for independent reasoning. Lakeside Food Share, another fictional group, proposes using AI to rank 240 volunteer applications for access to paid weekend shifts. One staffing manager would see the output, but applicants' income opportunities could be affected and there is no appeal route. Proposed inputs are names, addresses, availability, prior shift notes, and free-text comments. There is no tested performance evidence, no approved product processing terms, and no permission for automatic ranking. Choose launch, assistance-only redesign, or manual process. Explain your decision, data omissions, system boundaries, approval authority, missing evidence or permission, and first stop or recovery action. Do not view the answer key until you submit your response.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Independent Changed Case Prompt

Decide independently: launch, assistance-only redesign, or manual process. Explain how consequence, exposure, and reversibility affect your decision. State which of the proposed inputs you would omit and why, the minimum data that could be considered for a later approved use, what the system may and may not do, who must authorize the use, which product terms or evidence are missing, and the first stop or recovery action if processing occurs without approval or if an output has already affected an applicant. Do not reveal or use an answer key before submitting.

Expected learner action: Decide independently: launch, assistance-only redesign, or manual process. Explain how consequence, exposure, and reversibility affect your decision. State which of the proposed inputs you would omit and why, the minimum data that could be considered for a later approved use, what the system may and may not do, who must authorize the use, which product terms or evidence are missing, and the first stop or recovery action if processing occurs without approval or if an output has already affected an applicant. Do not reveal or use an answer key before submitting.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Independent Changed Case Pause

## Narration: Separate Feedback And Key Narration

The strongest immediate decision is manual processing. A later assistance-only redesign could help format or summarize authorized scheduling information, but it must not rank applicants, decide access to paid shifts, infer reliability, need, protected traits, or suitability, contact applicants, or change records. Names and addresses should be omitted where they are not necessary. Free-text comments should be omitted until their relevance, sensitivity, authorization, and retention are reviewed. Availability may be necessary for scheduling, but it does not authorize ranking. The reasoning trace is causal. Paid-shift ranking can affect income, so consequence is high. Processing 240 applications creates meaningful exposure even though one manager sees the output. Applicants lack an appeal route, so reversibility is low. Missing product terms, tested evidence, human recourse, and approved authority are launch blockers. The first action is to stop AI ranking, preserve the manual application process, notify the staffing manager that no AI output may determine access, and process the applications manually. If an output already exists, quarantine it, prohibit its use in decisions, preserve an audit record, and provide a correction or appeal route before any future pilot. If a later pilot is proposed, its metrics must name a numerator, the actual eligible denominator, an observation window, and a threshold. Zero eligible cases must be UNKNOWN, not zero failures. Small samples must be reported with limitations and must not be used to claim reliable performance. Any unsupported recommendation, material disparity signal, unauthorized processing event, missing approval, or failed appeal or correction path pauses the pilot for investigation. This key explains a reasoning path, not a guarantee about model behavior. If you chose launch because one manager sees the output, revisit exposure versus consequence. If you retained all free text because it might help, revisit necessity and sensitivity. If you proposed human review without giving the reviewer authority, time, evidence, and an appeal path, that is ceremony rather than control. If you chose manual processing, you identified a valid safe alternative.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://ai.google.dev/responsible/docs/evaluation>

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
