# Agents, Tools, and Guardrails: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to Agents, Tools, and Guardrails, a practical beginner class. Today you will classify systems, design boundaries, and inspect evidence. You will study one fictional refund using copied Python dictionaries. Nothing here performs model inference, network access, or real transactions. No external sandbox, production service, payment, or deletion is involved. First, distinguish responses, deterministic workflows, and bounded agentic loops carefully. Next, define trusted state, tools, authority, checks, budgets, and exits. Then, trace typed authorization before any copied state can change. You will see why Python makes True compare equal to one. You will enforce target, tenant, version, value, permission, and balance. You will expose three defects inside an intentionally buggy executor. You will compare exact receipts across success, denial, and recovery. You will stop repetition, budget exhaustion, and unresolved uncertain outcomes. Later, predict changed inputs before receiving separate corrective feedback yourself. Every supplied transcript is expected evidence, not newly executed evidence. Finish with records that support claims without inventing external verification. Distinguish model calls, deterministic workflows, and agentic loops by who controls the next step.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://docs.python.org/3/library/>

## Narration: System Types Explanation

Distinguish model calls, deterministic workflows, and agentic loops by their observable control flow. Classify each run by control flow, not its product label. The module states, “A model response is one generated output.” More completely, that output answers one input without continuing execution. The module also states, “A deterministic workflow follows steps selected.” Those steps are selected by application code, including fixed branches. An agentic loop delegates some next-action selection to a planner. The planner observes results, updates state, and may continue working. Consider routing a support ticket to an appropriate specialist queue. Suggesting one queue name is simply a single model response. Applying a category lookup table is a deterministic coded workflow. Inspecting records adaptively, then choosing another inspection, forms a loop. Adaptation may handle exceptions, but adds cost and failure paths. Fixed workflows are preferable whenever they reliably satisfy requirements already. Loops should earn their complexity through measurable adaptive value first. Ask who chooses actions, retains state, and declares completion explicitly. Agentic behavior never proves broad authority, reliability, or production safety.

Visual alternative: A response produces one output, code controls a deterministic workflow, and an agentic loop chooses allowed actions using observations.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/running-agents/>
- <https://adk.dev/agents/>

## Demonstration: Simplest Design Demonstration

Apply those categories to a fictional customer password-reset request today. A response can explain policy but cannot complete the reset. A deterministic workflow verifies identity, issues one link, then stops. Its code fixes ordering, branching, expiration, logging, and rate limits. A loop could choose recovery tools after observing account evidence. That flexibility helps only when authorized exceptions genuinely require adaptation. Otherwise, extra choices increase testing effort and uncertain intermediate states. Identity verification and issuance authority must remain outside any planner. The planner may propose actions, but proposals never grant permission themselves. Compare this with our scripted refund planner used later today. It selects a predetermined proposal, so no model inference occurs. The surrounding executor still demonstrates boundaries required around adaptive planners. Prefer deterministic control for stable, well-defined, consequential operations whenever possible. Introduce a loop only for bounded choices that improve outcomes. Measure improvement against cost, failures, recovery burden, and human workload. The safest useful design is the simplest sufficient design available.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/running-agents/>

## Narration: Bounded Loop Explanation

Before execution, translate intentions into an explicit run contract first. Goal names the bounded outcome and observable completion condition precisely. State identifies trusted inputs, permitted memory, receipts, and versions explicitly. Tools distinguish read-only observation from actions that change state clearly. Authority binds identities, tenants, targets, permissions, approvals, and values exactly. Checks cover typed preconditions and independently observed final postconditions afterward. Budgets limit steps and cost before each operation is charged. Exit rules cover success, denial, invalidity, repetition, uncertainty, and handoff. Our goal refunds exactly twenty-five on synthetic ticket T-100 once. Trusted state names tenant acme, ticket version three, and permissions. Approval binds action, ticket, tenant, version, and value completely together. The fixture allows four steps and six cost units maximum. Observation, proposal evaluation, action attempts, and reconciliation each cost one. Available tools are observe, copied refund, and observe-again operations only. The planner proposes; an independent executor authorizes, mutates, and verifies outcomes. Recovery preserves receipts and resumes only from newly verified state. A run contract converts vague safety hopes into testable boundaries.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/running-agents/>
- <https://adk.dev/agents/>

## Learner Prompt: Stop And Approval Prompt

Choose one bounded task that might use several allowed actions. Write an observable condition proving that task is complete successfully. Identify trusted state and anything the planner must not alter. Name one read-only tool and one consequential action tool explicitly. State whose identity and tenant authorize that consequential action specifically. Bind approval to target, version, action, and exact value completely. Add a maximum step budget and maximum cost budget separately. Define repeated non-progress using unchanged evidence, not elapsed time alone. Name one uncertain outcome requiring reconciliation before any retry occurs. Specify what evidence a human handoff must receive for recovery. For the refund, list all five complete approval fields now. Also identify permission, status, balance, and budget checks before mutation. Explain why a planner-selected action remains only a proposal still. Use the visible contract, but adapt boundaries to your task. Do not write broad authority like “handle everything needed automatically.” Save your completed contract before continuing to the worked implementation.

Learner action: Complete every run-contract field and identify action, ticket, tenant, version, and value as the five approval fields.

Sources:

- <https://openai.github.io/openai-agents-js/guides/running-agents/>

## Pause: Stop And Approval Work Time

## Narration: Agents Execute Narration

Read the exact fixture before examining control flow or mutation. Ticket T-100 belongs to acme and starts at version three. Its amount is twenty-five, status open, and balance one-hundred initially. Refund permission is true; budgets are four steps, six cost. The proposal requests refund, T-100, acme, version three, value twenty-five. Every proposal remains untrusted despite matching the visible trusted fixture. State validation rejects malformed structures and Boolean budget values immediately. The plain integer helper uses exact type identity, excluding Booleans. This matters because Python makes True compare equal to one. Proposal validation checks exact keys, primitive types, formats, and ranges. Approval validation applies those checks before any equality comparison occurs. Complete approval binds action, ticket identifier, tenant, version, and value. Precheck then compares target, version, approval, permission, status, and balance. Balance ten cannot authorize twenty-five under this synthetic invariant. Every billable operation checks effective step and cost limits first. Only approved refund logic mutates a deep copy of state. Postcheck independently verifies balance, status, version, and nonnegative balance afterward.

Sources:

- <https://docs.python.org/3/library/>

## Demonstration: Agents Lab Task

Save the complete canonical code unchanged as agents_lab.py locally. Run it using Python three without installing additional packages first. The script uses copying, assertions, printing, JSON, and regular expressions. It makes no network request and invokes no external model. Baseline execution charges observation, proposal evaluation, and refund attempt once. The resulting receipt reports success, completed, three steps, three cost. Copied balance becomes seventy-five and copied version becomes four afterward. Copied status becomes refunded while original BASE remains completely unchanged. The intentional buggy executor skips authorization and sufficient-balance policy entirely. Wrong tenant still changes its copied balance to seventy-five incorrectly. Altered value twenty-five-hundred produces copied balance negative twenty-four-hundred incorrectly. Starting balance ten produces copied balance negative fifteen incorrectly too. Corrected tests reject these conditions before any consequential action charge. They compare returned state, original state, reasons, and effective budgets. Therefore, a printed denial cannot conceal mutation occurring before denial. Investigate the first differing output line instead of editing expectations. Treat expected stdout as supplied evidence, not a newly executed result.

Visual alternative: The offline Python lab changes only copied dictionaries. Its expected baseline reaches balance 75 and version 4.

Sources:

- <https://docs.python.org/3/library/>

## Narration: Trajectory Evaluation Explanation

Evaluate complete trajectories, because final labels alone provide weak evidence. Baseline first observes acme, version three, amount twenty-five, status open. Next it proposes refund for T-100 with exactly matching fields. Precheck records approved exact action, target, version, value, and balance. The copied action records applied status, then postcheck observes results. Balance is seventy-five, status refunded, and version four afterward exactly. The loop stops goal-reached with completed classification and success result. Three operations explain exactly three steps and three cost units. The expected output contains thirty-eight PASS lines across grouped cases. Thirty corrected checks cover denials and already-complete or invalid-state behavior. Three bug-proof checks independently expose the intentional executor defects clearly. Five recovery checks cover repetition, reconciliation, budgets, and unresolved uncertainty. Typed probes reject None, lists, dictionaries, and Boolean numeric fields. One probe demonstrates True equals one, then rejects malformed approval. Insufficient balance returns denial after two units without mutation occurring. Deep copying supports local object isolation, not external non-mutation claims. Compare trace, receipt, returned copy, source fixture, and budget together.

Sources:

- <https://docs.python.org/3/library/>

## Checkpoint: Non Progress Loop Checkpoint

Consider an agent searching repeatedly for one required approval document. Its first query returns no matching document or useful evidence. It rewrites wording slightly and receives the same empty result. A third proposed search differs cosmetically but uses identical evidence. Eight of ten allowed turns have now already been consumed. Decide whether the agent should continue, stop, or change approach. Name the evidence showing repeated non-progress rather than mere difficulty. State what query, result, budget, and trusted context deserve preservation. Identify any materially different recovery that remains explicitly authorized here. Otherwise, identify the person or role receiving the handoff next. Explain what uncertainty the handoff must preserve without guessing resolution. Remaining budget is a ceiling, not an instruction to continue. Repetition can waste resources while creating an illusion of diligence. Submit your decision and reasoning before opening the feedback below. Your answer should mention progress, evidence, budget, and next ownership. Do not assume another similar query will suddenly produce evidence.

Learner action: Stop repeated non-progress, preserve the trajectory and evidence gap, and hand off or use only an authorized materially different recovery.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Pause: Non Progress Response Time

## Feedback: Non Progress Loop Feedback

Stop because recent actions produced no new evidence or progress. Remaining turns do not justify cosmetic variations of failed searches. Preserve every query, returned result, trusted state, and spending receipt. Report precisely that the required document was not found here. Do not report that the document does not exist anywhere. A materially different source is acceptable only when explicitly authorized. Otherwise, hand control to the named authorized person or team. Include goal, evidence gap, attempts, budget, uncertainty, and requested decision. This record prevents the next owner from repeating failed work blindly. If you continued, distinguish available budget from evidence-based progress requirements. If you stopped without preserving searches, add them to your record. If you omitted uncertainty, avoid converting missing evidence into certainty. Correct recovery protects resources while keeping future investigation genuinely possible. The same principle governs repeated observe-again proposals in our lab. There, duplicate canonical proposals stop after five charged operations total. Stopping is successful control behavior, not abandonment of the goal.

If correct: You stopped repeated non-progress, preserved the evidence gap and spending, and identified a useful handoff or materially different authorized recovery.

If retrying: Compare the last steps: if state and evidence did not improve, the remaining turn budget does not justify another equivalent action.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Recovery Explanation

Recover from verified state, not from the agent's narrative. Stop on denied authority, invalid or stale state, repeated non-progress, exceeded budgets, unsafe requests, failed checks, or unknown consequential outcomes. Persist a checkpoint containing the run contract version, safe state references, completed step identifiers, approvals, tool results, postcondition evidence, open uncertainties, and next permitted decisions. Reconcile the real system before resuming. Classify each step as verified complete, confirmed failed, unknown, or unattempted. Resume only after the checkpoint still matches current policy, tools, data, and target state. Compensation and rollback are new actions with their own authority and failure modes. Disable a tool when it exceeds tested behavior. Transfer control when the task needs judgment, credentials, cost, or consequence outside the run contract. A clean handoff says what the goal was, what happened, what remains uncertain, and what decision the person must make.

Visual alternative: The checkpoint records contract, state, approvals, results, postconditions, uncertainties, and next permitted decisions, then routes to resume, compensate, rollback, disable, or handoff.

Sources:

- <https://openai.github.io/openai-agents-js/guides/running-agents/>
- <https://adk.dev/agents/>

## Demonstration: Handoff Demonstration

Imagine a support agent may approve refunds below a policy threshold but finds conflicting order records. It has read the case, verified the customer identity, and made no financial change. The correct handoff does not say, refund failed. It states the goal, identifies the two conflicting records, lists the checks already completed, confirms that no refund was issued, records the remaining approval and reconciliation decision, and provides the safe case reference. The person can resolve the conflict without repeating identity work or guessing whether money moved. A handoff is a state contract, not a conversational apology.

Visual alternative: The handoff names the goal, conflicting records, completed checks, confirmed absence of a refund, open decision, and safe case reference.

Sources:

- <https://openai.github.io/openai-agents-js/guides/running-agents/>

## Narration: Agents Recover Narration

Recovery begins from verified state, never from persuasive planner narration alone. Repetition uses a separate fixture with six steps and costs. The first cycle charges observation, proposal evaluation, and observe-again action. The second charges observation and proposal evaluation before duplicate detection. It stops repeated-non-progress at five steps and five cost units. No copied or source ticket field changes during those observations. BASE cannot produce this trace because it permits four steps. The reconciled UNKNOWN simulation instead permits four total charged operations exactly. Observation, proposal, attempted refund, and reconciliation consume those four units. Reconciliation observes open status, balance one-hundred, and version three locally. This simulation classifies failed-not-applied and stops without retrying the action. That local result never proves what an external integration would show. With three units, reconciliation cannot be charged after attempted action. The receipt remains uncertain-outcome, classification unknown, without any retry attempt. Step-limited and cost-limited runs stop before charging the refund operation. Each spends two steps and two cost while preserving state. Unresolved external effects require authoritative reconciliation or authorized human handoff.

Sources:

- <https://openai.github.io/openai-agents-js/guides/running-agents/>
- <https://adk.dev/agents/>

## Narration: Layered Guardrails Explanation

Place enforceable guardrails around planners, not inside persuasive prompts alone. First validate trusted state, proposal shape, primitive types, and budgets. Resolve tenant, target, and current version from trusted state directly. Validate approval shape and types before comparing complete authorization fields. Bind action, ticket, tenant, version, and value without omissions anywhere. Then check scoped permission, status, sufficient balance, and replay conditions. Charge the action only when both effective budgets permit spending. After approved mutation, observe copied results independently from expected values. Verify exact balance, nonnegative balance, refunded status, and incremented version. Treat retrieved content, tool output, memory, and messages as untrusted. Extra proposal keys are malformed, including instructions requesting bypassed checks. The nonnegative balance rule is this lab's synthetic policy only. Other domains require invariants derived from authoritative business specifications instead. Deep copies limit consequences for these nested local dictionaries specifically. They do not prove concurrency safety, durable idempotency, or privacy. When identity, authority, funds, budget, or outcome remains uncertain, stop. Preserve evidence, reconcile authoritatively, and hand control to authorized humans.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/running-agents/>
- <https://docs.python.org/3/library/>

## Narration: Agents Changed Task

Now predict a genuinely changed fixture before viewing its answer. Create a fresh copied BASE so earlier work remains isolated. Change trusted ticket version from three to four in that copy. Change refund permission from true to false in trusted state. Set fixture budgets to two steps and two cost units. Keep the original proposal bound to ticket version three unchanged. Keep its complete baseline approval bound to version three unchanged. Call the corrected executor with matching caller limits of two. Predict every trace line in execution order before running anything. Identify the first failing comparison and resulting receipt reason precisely. Record steps, cost, balance, status, version, and classification if present. Explain whether permission evaluation occurs before the run stops here. State whether copied state or source changed fixture can mutate. Name the safe next owner and evidence that owner requires. Do not edit authority, proposal, permission, or budget to force success. Save your prediction now; the answer remains hidden during pause. Reason from visible validation order, not from preferred final outcomes.

Learner action: Save a complete trace and state prediction before continuing to the answer.

Sources:

- <https://docs.python.org/3/library/>

## Pause: Agents Changed Task Pause

## Narration: Agents Changed Answer

The first denial is stale-approval because trusted version is four. The unchanged proposal still names version three during precheck evaluation. Observation already consumed one step and one cost unit first. Proposal evaluation consumed the second step and second cost unit. The exact trace begins by observing acme, version four, amount twenty-five. It then proposes refund for T-100 using version three unchanged. Next comes DENY stale-approval, followed by STOP denied-untrusted-or-invalid immediately afterward. The receipt reports stale-approval, two steps, and two cost units. Final balance stays one-hundred, status stays open, version stays four. The source changed fixture also remains completely unchanged after return. False permission is independently important, but policy never reaches that check. Predicting success incorrectly treated stale data as continuing authority forever. Predicting denied-permission noticed danger but missed ordered validation behavior here. Predicting budget-stop missed that two units fund both completed checks. Safe recovery reconciles current state and creates an authorized handoff. Never refresh proposals, approvals, permissions, or budgets inside the planner. No real transaction or durable reconciliation occurred in this exercise.

If correct: You predicted stale approval, exactly two spent units, unchanged balance, open status, version four, and an authorized handoff.

If retrying: Follow precheck order. Trusted version four differs from proposed version three before permission is evaluated, and no action charge occurs.

Sources:

- <https://docs.python.org/3/library/>

## Narration: Agents Lab Evidence

Complete an evidence record tying every explanation to visible artifacts. Record whether your local baseline stdout matched the quoted transcript. If not, preserve the first differing line and assertion failure. Record buggy wrong-tenant balance seventy-five from the expected bug proof. Record altered-value negative twenty-four-hundred and insufficient-balance negative fifteen too. Cite corrected denial receipts demonstrating unchanged returned and original states. List approval fields: action, ticket identifier, tenant, version, and value. Identify every charge location covering observe, proposal, action, and reconciliation. Record repetition result with five steps and five cost units. Record reconciled UNKNOWN with four units and failed classification locally. Record unreconciled uncertainty with three units and unknown classification preserved. Explain that missing authoritative evidence prevents any automatic retry from occurring. Record postcheck balance, status, version, invariant, and source isolation evidence. Classify each claim completed, failed, UNKNOWN, unattempted, or not applicable. Write “none” for production claims, external writes, and human review. Do not claim external sandboxing, model inference, or durable reconciliation occurred. Your record should permit another person to reproduce every comparison.

Sources:

- <https://docs.python.org/3/library/>

## Narration: Agents Transfer

Transfer the planner boundary without transferring credentials or mutation authority. A provider adapter may return one candidate matching the proposal schema. That candidate remains untrusted regardless of provider formatting or confidence. Parse it without executing, then apply the independent corrected executor. Keep exact authorization in a separate trusted system or workflow. Do not assume models share tool calling or structured outputs. Hosting, context limits, refusals, and safety behavior also vary substantially. Test each concrete model, version, adapter, parser, and serving stack. Retain the scripted planner as a deterministic regression oracle first. Add one adapter behind a disabled execution feature flag initially. Save only approved non-secret fixtures and compare candidate structures carefully. Reuse wrong-target, stale, altered-value, replay, malformed-type, and Boolean probes. Also reuse balance, budget, repetition, uncertainty, and postcondition tests consistently. Enable mutation only after system-specific controls and evidence satisfy requirements. Provider-generated tool calls remain proposals rather than authorization grants always. Production integrations additionally require authoritative state, reconciliation, privacy, and concurrency controls.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/running-agents/>

## Transition: Activity Transition

Open the bounded agent loop activity when you are ready. First run the complete offline script without modifying expected behavior. Compare baseline output and all thirty-eight expected PASS assertion lines. Next contrast each buggy mutation with corrected no-side-effect evidence carefully. Complete the run contract using explicit authority, budgets, and exits. Annotate baseline observation, proposal, approval, action, postcheck, and stop evidence. Trace untrusted instructions, malformed Booleans, and insufficient balance denials fully. Run the separate six-unit repeated-non-progress recovery fixture exactly as supplied. Compare reconciled UNKNOWN against unresolved uncertainty without available reconciliation budget. Confirm step-stop and cost-stop occur before any refund charge occurs. Preserve your changed-input prediction before opening its separate answer key. Then complete the evidence record with artifact references and classifications. Finally answer which removed autonomy made the design simpler or safer. Name independently observed evidence required before permitting another consequential action. Extend work time if needed; accuracy matters more than speed. Do not report actual model, production, external transaction, or review activity. Save all work before proceeding toward the optional knowledge check.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://docs.python.org/3/library/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check only when you choose to proceed. You will classify responses, workflows, and agentic loops from behavior. You will select deterministic control when adaptation adds insufficient value. You will identify controls required before copied state mutation occurs. You will explain why True equals one threatens authorization comparisons. You will apply target, tenant, version, value, and permission binding. You will enforce the synthetic nonnegative balance invariant before action. You will interpret stale, replay, malformed, and budget denial receipts. You will recognize repeated non-progress despite remaining outer budget capacity. You will preserve UNKNOWN when reconciliation evidence cannot be obtained. You will distinguish uncertain handoff from locally reconciled failed outcomes. You will explain why denial labels cannot prove unchanged state. You will separate copied isolation evidence from external production evidence clearly. Review your contract, traces, feedback, and evidence record if needed. Return to the activity for additional offline investigation whenever useful. The assessment contains five questions and requires eighty percent passing. It begins only after you select Begin knowledge check yourself.

## Closing: Class Closing

Keep autonomy earned, visible, bounded, and recoverable throughout every run. Choose responses or deterministic workflows whenever they reliably satisfy goals. When adaptation matters, define goal, trusted state, tools, and authority. Validate exact shapes and primitive types before equality comparisons occur. Bind approval to action, target, tenant, version, and value completely. Check permission, status, balance, and budgets before any mutation. Independently observe postconditions instead of trusting the planner's success claim. Stop repeated non-progress before budgets become excuses for persistence alone. Reconcile uncertain effects authoritatively before considering another action attempt. If reconciliation is unavailable, preserve UNKNOWN and hand off explicitly. Record evidence, spending, classification, stop reason, and next ownership clearly. In this lab, mutation affected only a copied synthetic dictionary. Passing supplied assertions supports only the covered in-memory implementation behavior. It does not establish external authorization, production safety, or durable correctness. No actual model inference, real transaction, external sandbox, or review occurred. The enduring rule is simple: proposals require independent enforceable authority first.
