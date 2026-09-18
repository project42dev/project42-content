# Review Agent Results Against Evidence

Package: `review-agent-results-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class is about deciding whether an agent's result deserves acceptance. We will use the work order, source material, tool records, and observed outcomes to make that decision. A persuasive summary is a starting point for review, not a substitute for evidence. You will create a criterion-to-evidence matrix, distinguish a defect from missing evidence, and choose accept, request changes, or escalate. Our example is a support agent asked to summarize a policy and prepare a ticket update. The update must remain within the approved account and must not be sent without the required approval. The policy summary must cite the current source. Keep these requirements visible as you examine each artifact.

## Narration: Review Contract

Start with the original work order. Write the requested outcome, scope, constraints, and acceptance criteria before reading the agent's completion claim. This order matters because a polished answer can draw attention toward what the agent did and away from what it omitted. Give each criterion its own row. Record the artifact or postcondition that would demonstrate success, the evidence location, the observed result, and the review status. For our support task, separate factual accuracy, account isolation, approval, and delivery status. An accurate summary does not compensate for an unauthorized update. Likewise, a valid approval does not make a stale policy current. If the work order itself is ambiguous, record the ambiguity and identify who can resolve it. Do not silently replace a difficult requirement with one that is easier to satisfy.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Review Evidence

Trace material claims to evidence that supports their exact wording and scope. Open the cited policy, check its date and applicability, and locate the passage behind the claim. A working URL proves only that a page can be reached. Distinguish an observed fact from an inference and keep uncertainty visible. For an action, inspect the authorized identity, operation arguments, approval record, execution result, and actual postcondition in the system of record. A timeout after a write leaves the outcome unknown: it does not prove that nothing happened. Use a durable operation identifier to reconcile that state before recommending a retry. For code, inspect the changed artifact and reproduce the relevant check against the exact revision. A test report from an earlier revision cannot establish the behavior of a later change. Keep secrets and personal information out of the review packet.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Review Decision

Use three review outcomes deliberately. Accept when every required criterion has supporting evidence and remaining risk is within the agreed boundary. Request changes when you can describe a reproducible defect or a specific missing artifact that the author can supply. Escalate when deciding requires authority you do not have, the external outcome cannot yet be determined, or the possible impact exceeds your review scope. Do not average away a failed mandatory criterion with several successful ones. A useful decision names the affected requirement, the evidence, its practical consequence, and the next check needed. Keep the original result and findings so a revision can be compared honestly. When the author returns, check the changed criteria and any connected behavior that the change could affect. Record what was retested instead of implying that an entire system was requalified.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Support Result Demonstration

Consider our support agent's report: policy summarized, customer notified, all checks passed. Open the artifacts before accepting those claims. The summary cites an older policy revision, so mark the current-policy criterion failed and identify the source that must replace it. The approval record authorizes a draft only, while the trace reports a send attempt. Mark the authorization criterion failed and escalate the possible external effect. The send request timed out, so customer notification is unknown until the message system is queried using the operation identifier. Finally, the test log covers formatting but never checks the account boundary. Mark account-isolation evidence unknown, not passed. These rows produce a request for corrections plus an escalation for the potentially unauthorized action. The summary's confident wording changes none of those findings. This scenario is a classroom fixture; use synthetic records and do not send a real message.

## Learner Prompt: Review Matrix Prompt

Now build your own matrix from the fixture. Start with four rows: current policy, authorized action, correct account, and observed delivery status. For each, name the smallest check that would resolve its state. Separate the evidence you already have from evidence you are requesting. A policy page and its revision can resolve the factual claim. A scoped test with two synthetic accounts can examine the account boundary. A delivery record can establish whether the message exists, but it cannot retroactively authorize a send. Write one sentence explaining that distinction. If you discover a criterion missing from the original work order, record it as a proposed clarification rather than pretending it was always required. Pause here and compare your matrix with a partner or the supplied feedback.

Expected learner action: Create four criterion rows with verified, failed, or unknown status, evidence references, and the next check.

## Checkpoint: Acceptance Checkpoint

Before making the decision, answer this question: can a result be accepted because every automated test passed while one mandatory source citation is unsupported? Explain which criterion remains unverified and what evidence would change your decision. Then consider a second case: the system of record confirms delivery, but the approval permitted only drafting. Delivery is now an observed fact; authorization still failed. Your review must preserve both conclusions. A successful side effect and a permitted side effect are different checks. Finally, decide who should receive the escalation for a possibly unauthorized action in your organization. Name the responsible role rather than inventing permission to investigate or reverse an external action yourself.

Expected learner action: Reject acceptance with an unsupported mandatory claim and separate observed delivery from authorization.

## Feedback: Decision Feedback

If you withheld acceptance because the citation did not support the mandatory claim, your decision follows the work order. Ask for a supported correction and then check the revised source relationship. If you accepted because the tests passed, identify what those tests actually exercised. They may prove formatting, parsing, or a particular function, while saying nothing about source currency. If you treated confirmed delivery as sufficient authorization, revisit the approval record. Verification tells us what happened; authorization tells us what was allowed. Keep those columns separate in the matrix. Escalation should include the observed facts, unresolved questions, potential impact, and the decision required. It should not convert a hypothesis into an accusation or conceal uncertainty behind a vague statement that the agent failed.

Correct feedback: Acceptance follows every mandatory criterion, including factual support and authorization.

Retry feedback: Passing tests or observing an effect cannot substitute for a missing source or approval.

## Transition: Activity Transition

Open the audit activity. Use a synthetic or appropriately redacted work order, result, sources, tool trace, and test report. Reproduce one check, inspect two material sources, and verify one action against the system of record or its classroom fixture. Submit your matrix and decision record with exact evidence references. A reviewer should be able to repeat your reasoning without trusting the agent's summary.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can explain what defines completion, how to investigate an unknown write outcome, why a citation must support the exact claim, and when evidence is sufficient for acceptance. Return to your matrix if any of those decisions still depends on the agent saying it finished.

## Closing: Class Closing

Review starts with the work order and ends with a decision another person can verify. Preserve the distinction between facts, defects, and missing evidence. Accept demonstrated completion, request precise corrections, and escalate unresolved authority or impact. The result is a trustworthy review record, even when the agent's delivery is not yet ready.
