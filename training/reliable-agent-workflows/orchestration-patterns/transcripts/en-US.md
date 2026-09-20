# Choose Reliable Orchestration Patterns

Package: `orchestration-patterns-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class is about choosing orchestration because the work requires a particular control structure, not because a larger collection of agents sounds more capable. We will use a dependency-free local Node.js lab containing seven executable patterns: direct execution, a fixed sequence, conditional router dispatch, a manager that retains control, a trusted handoff and return, asynchronous parallel branches with a required join, and a bounded evaluator-reviser loop. The fixtures are deterministic local functions. They make no provider request and execute no hosted model. That boundary matters because the lab demonstrates orchestration behavior, contracts, concurrency, and failure handling, but does not demonstrate provider quality. By the end, you should be able to select the smallest sufficient pattern, identify who controls each transition, prove whether work really overlaps, and explain why a terminal result is permitted.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Simplest Sufficient Pattern

Begin with direct execution. In the direct lab graph, one parent fixture performs a bounded publish action and its validated result determines the terminal state. This shape minimizes latency, state transfer, permissions, and recovery paths. Move to a sequential workflow only when there is a real dependency. The sequential demo creates a draft, validates that draft, and then lets the parent aggregate current validation evidence. Validation cannot correctly start before the draft exists, so the edge is justified. For every additional boundary, ask what it buys. A specialist might narrow permissions, reduce conflicting instructions, or make evaluation easier. It also creates another contract, another budget reservation, and another failure surface. If a step is fully known and deterministic, keep it in application code. If one bounded operation solves the task, do not build a manager, handoff network, or review loop around it. Simplicity is not the absence of governance. Direct execution still needs authority checks, contracts, timeouts, budgets, result validation, and an explicit terminal state.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Demonstration: Router Demonstration

Now consider conditional routing. The local classifier receives a proposal with a risk field. It may return only specialist or direct because those are the two keys in a trusted route map. With the supplied high-risk input, the classifier selects specialist. The executor records the selection, marks directWorker as skipped, and dispatches specialistWorker only. The final join requires successful current-revision evidence from that selected worker. Change the input risk to low and the invoked worker changes to directWorker while specialistWorker is skipped. This is real dispatch, not a label attached after both workers run. If the classifier returns admin, an empty value, or another unknown value, execution fails with ROUTE_INVALID before either branch or approval. The classifier is therefore allowed to select among declared capabilities, not invent a capability. Use this pattern when an input-dependent semantic decision provides enough benefit to justify classifier error, route observability, and closed-map validation. Use ordinary conditional code when a reliable deterministic rule already expresses the choice.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Deterministic Workflows

The first three patterns establish a progression. Direct has one bounded operation. Sequential encodes true ordered dependencies. Router dispatches exactly one branch selected from trusted state. The graph, rather than a worker, owns the allowed edges. This principle also governs loops. A loop is not permission to continue until a worker feels satisfied. It needs measurable criteria, a revision counter, budget and deadline checks, and declared terminal behavior. Google ADK documents sequential, loop, and parallel workflow agents as deterministic workflow structures. The portable lesson is not that every framework uses the same class names. It is that known control flow belongs in code. A model or other uncertain worker may produce a classification, draft, evaluation, or revision, but it should not invent hidden edges, silently add retries, or create a new success state. Record the input and output contract on each edge so a trace can show which interface governed the transition. Record the route reason, budget reservation, accepted result revision, and terminal decision for the same reason.

Sources:

- <https://adk.dev/agents/workflow-agents/>
- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Manager And Handoff

Manager and handoff patterns differ primarily in who remains active. In the manager demo, the parent calls a research specialist as a tool. The specialist may read and return evidence, but it cannot approve. The parent retains control, validates the artifact, synthesizes the result, and owns approval. This arrangement is useful when a central agent must preserve one user-facing plan and combine several specialist artifacts. Its risks include a manager bottleneck and overconfidence in evidence it cannot judge. In the handoff demo, ownership actually changes. The parent transfers to security-specialist under a declared transfer contract. The specialist becomes active, performs its bounded responsibility, and returns ownership under a separate return contract. Approval is possible only after ownership returns to parent. A fixture result that claims transfer is not sufficient. The executor checks the trusted source, destination, transition, principal, and acceptance contract. Use manager delegation when the parent must retain synthesis and conversational control. Use handoff when the specialist needs to own the next phase under narrower instructions. Do not use these names interchangeably because their state, permission, and recovery requirements differ.

Sources:

- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://www.anthropic.com/engineering/building-effective-agents>

## Checkpoint: Manager Handoff Checkpoint

Checkpoint. A support coordinator asks a security specialist for an analysis, receives the typed report, and remains responsible for the final customer response. Is this a manager or a handoff? Choose manager because active control never left the coordinator. Now change one fact: the specialist becomes the active owner and communicates through a narrower security workflow until an explicit return condition. That is a handoff. Your answer should depend on control ownership, not on whether two workers exist.

Expected learner action: Identify manager for retained parent control and handoff for explicit trusted transfer.

Sources:

- <https://openai.github.io/openai-agents-js/guides/multi-agent/>

## Narration: Parallelism And Joins

Parallelism is useful only when branches are independent. Independence means more than different names or different models. One branch must not require another branch's result, both must not mutate the same state without coordination, and they must not consume an unsafe shared scarce limit. In the lab, research, review, and validation receive the same input revision and have empty dependency lists. The scheduler starts their promises without awaiting one before starting the next. Tests record active fixture counts and start events, proving that the three operations overlap and may finish out of order. The parent does not accept whichever result finishes last. It joins evidence by dependency ID and requires research, review, and validation to succeed at the current revision. If one required branch fails, approval is prevented. A sibling completing after the terminal failure is marked as an ignored late completion. This distinction is central: concurrency is how work executes, while the join defines the product outcome. Decide required and optional branches, timeout, cancellation, retry ownership, disagreement handling, and partial-result labeling before launching work.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://adk.dev/agents/workflow-agents/>

## Learner Prompt: Shared Mutation Prompt

Consider two branches that both edit the same policy document. Different models perform the edits, and each branch is individually fast. Should they run in parallel by default? Write down your answer and the state property that supports it. Then identify one safe redesign: serialize the writes, partition the document into nonoverlapping owned regions, or have both branches return read-only proposals for a deterministic reconciliation step.

Expected learner action: Reject default parallel writes and propose coordination, partitioning, or proposal-only branches.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Pause: Shared Mutation Pause

## Feedback: Shared Mutation Feedback

The safe answer is no. Different workers do not make shared mutation independent. If both branches can write the same object, settlement order could silently determine the artifact or create an unresolved conflict. The lab rejects conflicting writes rather than treating completion order as authority. Serialization is appropriate when the second edit depends on the first. Partitioning is appropriate only when ownership boundaries truly do not overlap. Proposal-only branches can overlap because a separate join owns reconciliation. Also avoid the opposite mistake of rejecting all concurrency. Independent read-only evidence collection can overlap safely when each branch has isolated scope and the join explicitly handles required results, disagreement, timeout, cancellation, and partial failure.

Correct feedback: You evaluated independence from data dependencies and side effects rather than worker identity.

Retry feedback: Check whether either branch reads or mutates state produced or owned by the other.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Demonstration: Evaluator Reviser

The seventh pattern is the evaluator-reviser loop. The supplied artifact begins without two required criteria: signed release records and a verified rollback owner. Evaluation zero returns approved false, the exact unmet criteria, feedback, and artifact revision zero. The reviser uses that feedback to add one missing criterion and produces artifact revision one. Evaluation one still finds the second criterion missing, so a second revision changes the artifact. Evaluation two sees both criteria and explicitly approves. The demo therefore contains three evaluations and two revisions. Approval cannot come from the reviser. An evaluator claim with approved true is rejected if its unmet list is not empty. If the maximum revision count is reached before approval, the terminal state is escalation, not success. Budget exhaustion, operation timeout, or loop deadline also escalates. Use this pattern when quality can be expressed as stable criteria and revisions can make observable progress. Do not use it for subjective endless polishing. Criteria, revision cap, budget, deadline, and escalation owner must be declared before execution.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Observe And Limit

Across all seven patterns, observability and limits make the control structure enforceable. Record the run identifier, active owner, node and parent span, route decision, contract versions, input revision, accepted evidence, effects, reservations, retries, and terminal state. Keep secrets and unnecessary personal data out of telemetry. A trace should still let an authorized reviewer reconstruct why execution moved and why it ended. Every lab node declares a tenant, role, principal, allowed actions, reservation, timeout, attempt cap, input contract, and output contract. Validation rejects unknown dependencies, duplicate IDs, cycles, multiple final nodes, stale completions, dependency contract mismatches, forged approval, spoofed handoffs, and a final node that does not transitively depend on all required work. These checks are not decorative. They prevent a fast or hostile result from bypassing the graph. Frameworks expose different manager, handoff, workflow, and tool abstractions. Treat those as adapters. Preserve the same product-level invariants and tests when changing implementations rather than assuming similarly named SDK objects provide identical guarantees.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://adk.dev/agents/workflow-agents/>

## Demonstration: Lab Live Demonstration

Let us run the local lab. First enter cd training slash reliable-agent-workflows slash orchestration-patterns slash lab. Confirm that Node reports version twenty-two or later. Run npm run regression. This baseline command runs only the executor regression tests and should pass twenty-three tests before the learner file is edited. Next run npm run learner colon test. It should intentionally fail because the starting learner graph has a false review-to-research dependency. Open src slash learner dot mjs and remove only research from review's dependency list. Save the file, run npm run learner colon test again, and confirm that the assessment passes with independent true and requiredJoin true. Then run npm test. The complete command combines the regression and learner tests and should pass twenty-four tests after the repair. Finally run npm run demo and npm run trace. Read each demo line as evidence about a local fixture run: direct succeeds with one budget unit and one evidence record; sequential succeeds with five and three; router succeeds with five and three and selects specialist; manager succeeds with four and two; handoff succeeds with four and three; parallel succeeds with eight and five; evaluator succeeds with seven and five and reports two revisions. The first three parallel dispatches are research, review, and validate, while settlement may vary with host scheduling. The final aggregation lists research, review, validate. These outputs establish local behavior only. Fictional cost units are not tokens, money, latency, or measured compute, and in-memory effect validation does not prove rollback of external effects.

Sources:

- <https://nodejs.org/api/test.html>
- <https://nodejs.org/api/timers.html#timeoutref>
- <https://nodejs.org/api/globals.html#class-abortcontroller>

## Learner Prompt: Learner Exercise

Now complete the causal learner exercise. Open src slash learner dot mjs. The intended repaired file gives research, review, and validation empty dependency lists. If you are working from the intentionally broken starting state, review incorrectly depends on research. Remove only the string research from review's dependency list and save the file. Do not remove research, review, or validation from the parent's dependencies. Run npm run learner colon test. The assessment must say pass true, independent true, requiredJoin true. The runtime assertions also verify that all three branch starts occur before parent and that the parent aggregation contains all three IDs. Then run npm test for the complete suite. Finally run npm run learner. Its feedback explains that removing the false edge enables overlap while retaining required evidence. Compare src slash solution dot mjs only after attempting the edit. If your test still fails, inspect the saved file, confirm review has an empty list, and confirm parent still depends on all three branches.

Expected learner action: Remove only review's false dependency, preserve the parent join, save, and pass both learner and complete tests.

Sources:

- <https://nodejs.org/api/test.html>

## Pause: Exercise Pause

## Feedback: Exercise Feedback

A correct repair changes runtime causality, not just an assertion. Research, review, and validation can all start from the same input revision because none consumes another branch's output. Parent still waits for all three. Therefore a required failure still prevents approval, only parent authority may approve, and the final result cannot race ahead of missing evidence. If you removed a parent dependency to make the test appear faster, restore it. That weakens the semantic join. If you changed fixture delays, labels, or expected values, restore them. Those changes do not remove the false edge. If the dedicated test passes but the full suite fails, investigate the reported security or semantic regression rather than weakening the test. The solution reference demonstrates the minimum edit, but the dedicated test evaluates the actual exported learnerGraph, so copying output text without changing the graph cannot pass.

Correct feedback: The three branches overlap while parent still requires all three current-revision results.

Retry feedback: Remove only review's dependency on research and retain every parent dependency.

Sources:

- <https://nodejs.org/api/test.html>

## Transition: Activity Transition

Transfer the same reasoning to the design activity. Choose a real task and compare direct, deterministic workflow, manager, and handoff designs using quality, risk, latency, cost, and debuggability. Build the smallest typed graph. Add parallel work only after proving independence and defining the join. Simulate normal completion, a bad route, conflicting evidence, specialist timeout, repeated revision, and human escalation. Save a pattern decision record, the versioned graph, and six trace records. Your evidence should explain why each boundary exists, which principal controls it, which contract applies, what budget is reserved, and which terminal state follows failure.

## Assessment Handoff: Quiz Handoff

When ready, begin the five-question knowledge check. Question one asks you to choose deterministic sequencing for fixed ordered work. Question two checks whether you understand that a manager retains synthesis control. Questions three and four test independence and explicit join policy. Question five asks why route reasons and contract versions belong in traces. Use the executable patterns as your mental model: one bounded operation, ordered dependencies, one selected route, retained manager control, trusted transfer and return, overlapping independent branches with a required join, and measurable revision under a hard bound.

## Closing: Class Closing

Keep the final selection rule simple. Use direct execution when one bounded operation is sufficient. Sequence real dependencies. Route only among trusted declared branches. Let a manager retain control when central synthesis matters. Use handoff only with explicit transfer, acceptance, and return. Parallelize independent work and make required evidence explicit at the join. Iterate only against measurable criteria under revision, budget, and deadline caps. Across every pattern, preserve tenant, authority, contracts, revisions, trace continuity, and deterministic terminal behavior.
