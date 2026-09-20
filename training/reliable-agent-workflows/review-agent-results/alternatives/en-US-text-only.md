# Review Agent Results Against Evidence: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class teaches a disciplined way to decide whether an agent result deserves acceptance. We will review a synthetic Orion support dossier, qualify an offline checker, and then test our reasoning on an independent Lyra case. Keep the work order visible. A fluent completion summary is only a claim until artifacts, authority, and observed state support it.

## Narration: Review Contract

Start with the work order, not the agent summary. Give every acceptance criterion a separate row. Record the exact artifact or postcondition required, its evidence reference and revision, the observation, your inference, the status, and the next action. This order prevents polished language from hiding omitted requirements or silently changing the scope.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Review Evidence

Now trace material claims. Compare exact source words, revision, authority, effective date, scope, and provenance. Citation presence is not support. Record what the excerpt directly states before recording your conclusion. A checker can compare annotations and references, but a human must decide whether natural language actually supports the claim.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Source Comparison Demonstration

In Orion, the archived policy says 45 days for qualifying earlier orders. It is superseded. The current revision says 30 days for deliveries in the work-order scope. Therefore the claimed current 45-day window is unsupported. The same current excerpt supports a separate seven-day escalation period after the first support response.

## Narration: Review Authority

Next inspect authority independently of outcome. The approval binds the synthetic reviewer to a draft operation on one ticket and tenant. The trace attempts an external send. Actor, target, and tenant match, but operation authorization fails. Preserve both findings. Correct binding does not repair an unauthorized operation.

Sources:

- <https://genai.owasp.org/llmrisk/llm062025-excessive-agency/>

## Demonstration: Unknown Outcome Demonstration

The send attempt timed out, and the independent ledger state is unknown. Timeout proves neither delivery nor absence. Preserve the correlation identifier and ask the authorized system owner to reconcile it. Do not retry, reverse, or widen access on your own. Unknown is a useful status because it prevents duplicate or unauthorized effects.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Review Tests

The ticket snapshot records that an internal draft exists. That verifies only the draft criterion. It does not prove external delivery. The test report validates format and length only. It does not validate policy truth, authorization, account isolation, or a real external outcome. Match every test result to its declared scope.

Sources:

- <https://nodejs.org/api/test.html>

## Learner Prompt: Review Matrix Prompt

Build the Orion matrix now. Use five rows. Mark the policy row, draft row, authorization row, external-postcondition row, and target-binding row. For each row, write one observation, one inference, and one next action. Keep the supported seven-day claim even though the all-claims criterion fails.

Learner action: Complete five Orion rows with evidence references, statuses, observations, inferences, and next actions.

## Pause: Orion Matrix Practice

## Checkpoint: Source Diagnostic Checkpoint

Check your first diagnostic. If you marked the 45-day claim verified merely because it had a citation, the causal error is that you checked presence rather than support. If you marked every policy claim false, you lost the separately supported seven-day statement. The correct C1 result is failed because one required material claim conflicts with current scope.

Learner action: Explain why C1 fails while the seven-day claim remains supported.

## Feedback: Source Diagnostic Feedback

Correct reasoning compares exact words, revision, freshness, authority, and scope. Citation counting misses the superseded limitation. Blanket rejection also loses a supported claim. Preserve claim-level findings, then apply the criterion rule. Because every material claim must be supported, one unsupported current-policy claim causes the combined criterion to fail.

If correct: You separated claim-level support and applied the all-claims rule.

If retrying: Compare source content and scope rather than counting citations or rejecting every claim together.

## Checkpoint: Authority Diagnostic Checkpoint

For authority, ask whether matching target and tenant make the send authorized. They do not. The operation differs from the approved draft operation. C3 is failed, while C5 remains verified. Separating those rows shows exactly what was correct and what crossed the boundary.

Learner action: Mark C3 failed and C5 verified, then explain the operation mismatch.

## Feedback: Authority Diagnostic Feedback

If you verified C3 because the ticket and tenant matched, you omitted the operation field. If you failed C5 because the operation was unauthorized, you merged two independent requirements. Exact review preserves both facts: the trace is correctly bound to the requested resource, and the attempted operation exceeds approval.

If correct: You kept resource binding separate from operation authority.

If retrying: Recheck actor, operation, target, and tenant as independent fields.

## Demonstration: Offline Lab Demonstration

Now qualify the offline lab. From the repository root, change into the lab directory before running commands. The exact commands are displayed rather than read as long paths. The lab uses synthetic fixtures, Node built-ins, no network, no credentials, and no external effects. Qualification used Node.js version 24.18.0, and fifteen tests passed.

Visual alternative: From the repository root, change into the supplied lab directory, then run node space dash dash test.

Sources:

- <https://nodejs.org/api/packages.html#packages_type>
- <https://nodejs.org/api/test.html>

## Demonstration: Baseline Output Demonstration

Run the draft-state inspection and baseline validation. The inspection derives draft present as true and passes. The baseline validation reports structural pass, policy pass, decision escalate, two verified, two failed, one unknown, and result pass. That result means the packet is consistent with fixture rules, not that production facts are proven.

Sources:

- <https://nodejs.org/api/fs.html#fspromisesreadfilepath-options>

## Checkpoint: Flawed Packet Checkpoint

The flawed packet is structurally valid but fails policy validation. It wrongly verifies C1, wrongly converts C4 from unknown to verified, and accepts instead of escalating. This is a causal diagnostic: complete references and valid JSON cannot repair incorrect evidence interpretation or a decision that ignores consequential uncertainty.

Learner action: Identify the two incorrect statuses and incorrect decision.

## Feedback: Flawed Packet Feedback

If you accepted because structure passed, you confused shape with policy consistency. If you verified C4 after the timeout, you converted missing evidence into an absence claim. If you accepted C1 because references were present, you skipped semantic review. Each error has a different cause, so each needs a different correction.

If correct: You distinguished structural validity, policy consistency, and semantic judgment.

If retrying: Revisit the declared scope of each automated check and preserve unknown observations.

## Demonstration: Negative Probe Demonstration

Try the altered-observation probe. In an isolated copy, change the applicable observed Boolean from true to false. The inspect command must print false, then fail, and exit with status one. Also confirm that empty evidence-reference arrays are rejected. These probes show evidence derivation and structural enforcement rather than stored-output replay.

Sources:

- <https://nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options>

## Learner Prompt: Changed Input Prompt

Before opening the Lyra solution, review the changed dossier independently. Its policy, authorization, operation, target, tenant, trace, and state are new inputs. Decide each criterion from those inputs. Do not copy Orion's escalation merely because the matrix shape is similar.

Learner action: Create an independent five-row Lyra matrix and decision.

## Pause: Lyra Practice

## Demonstration: Lyra Demonstration

In Lyra, the current excerpt supports both material claims. Authorization and trace match on identity, operation, target, and tenant. Independent state records the internal note as present. All five criteria are verified, so accept is correct within the synthetic fixture scope. Success from the trace alone would not have been enough.

## Checkpoint: Changed Input Checkpoint

If you copied Orion's escalation, name the Lyra row that remains failed or unknown. There is none in the supplied fixture. If you accepted only because the trace reports success, your conclusion used insufficient evidence. Source support, authorization, binding, and independent state must each be reviewed.

Learner action: Defend the Lyra accept decision with separate source, authority, binding, and state evidence.

## Feedback: Changed Input Feedback

Correct Lyra reasoning is input-sensitive. It does not inherit Orion's result. The current source supports both claims, the grant and trace match, and observed state confirms the internal note. If any one of those inputs changed, the affected status and possibly the decision would change.

If correct: You recalculated every status from the changed dossier.

If retrying: Do not copy a prior decision or rely on trace success alone.

## Narration: Review Decision

Use this decision rule. Accept only when every mandatory row has sufficient evidence. Request changes for a reproducible defect the author can repair. Escalate when consequential state is unknown, authority is missing, or the required decision exceeds your role. Several passes never average away one mandatory failure.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Transition: Activity Transition

Open the audit activity. Submit the Orion and Lyra matrices, reproduced outputs, source observations, inferences, decisions, and next actions. Explain what the checker establishes and what still requires human judgment.

## Pause: Activity Work Time

## Checkpoint: Acceptance Checkpoint

Before submitting, verify that every accepted row cites a revision-bound artifact. Every failed or unknown row must name the smallest authorized next action. A draft snapshot cannot prove delivery. A format test cannot prove source truth. A matching target cannot authorize a different operation.

Learner action: Audit the packet for revision binding, causal next actions, and category errors.

## Feedback: Decision Feedback

A strong packet lets another reviewer reproduce the decision without trusting the agent summary. It preserves exact revisions, direct observations, bounded inferences, failed controls, unresolved state, and responsible next actions. It never implies that checker success establishes semantic truth, live authorization, or a production postcondition.

If correct: Your packet separates automation results from human semantic and authority judgments.

If retrying: Add exact revisions, observations, and authorized next actions where the reasoning cannot yet be reproduced.

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can explain why source presence is not source support, why draft state is not delivery state, why matching target does not authorize a different operation, and why timeout remains unknown. The five assessment questions use those exact distinctions.

## Closing: Class Closing

Review begins with requirements and ends with a decision another reviewer can reproduce. Preserve observations, inferences, defects, unknowns, revisions, and authority boundaries. The lab is qualified evidence for its fixture behavior, not production truth.
