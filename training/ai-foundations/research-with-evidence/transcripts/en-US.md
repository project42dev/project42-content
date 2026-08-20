# Research with Evidence

Package: `research-with-evidence-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class turns AI-assisted research into a bounded, reviewable evidence workflow. You will begin with the decision the research must support, not with an open-ended request for facts. You will build a source ledger, separate generated leads from opened sources, verify every material claim, preserve disagreement, and recover when evidence fails. The goal is not a polished answer at any cost. The goal is a synthesis another person can reproduce, challenge, and safely use.

## Narration: Bounded Brief Explanation

Prepare before searching. State the decision this work supports and the people who will use it. Break the need into bounded questions that can be answered with observable evidence. Define scope such as date range, region, product version, audience, and excluded topics. Then state what evidence is strong enough for each kind of claim. Current product behavior may require official documentation or a repeatable test. A comparison may require equivalent measurements. A forecast should expose assumptions rather than masquerade as a fact. Record which data is permitted and which must stay out of the tool. Finally, define stop conditions. Stop when required claims have qualified support, when time expires, when sources conflict beyond the workflow's authority, or when the question must be narrowed. A brief prevents the model from silently expanding the task and gives the reviewer a standard for deciding whether the research is complete.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Demonstration: Brief Demonstration

Suppose a team asks, which model should we adopt? That question is too broad. I rewrite the decision as: choose a model for summarizing approved support articles in English during a thirty-day pilot. I ask about answer quality on a named test set, latency under a stated load, handling of unsupported claims, data-use constraints, and estimated cost for the pilot volume. I limit the scope to currently available versions and the deployment regions the organization can use. I require provider documentation for service behavior, measured tests for quality and latency, and reviewed pricing evidence for estimates. Confidential tickets are excluded; the pilot uses approved synthetic or redacted material. We stop when every required field has evidence, a visible gap, or an accountable escalation. The narrower brief does not guarantee the right choice, but it makes the research testable.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Source Ledger Explanation

Execute with a source ledger. For each candidate source, record title, publisher, stable location, publication or review date, the exact claims it may support, its scope and limitations, and your access date. Prefer primary sources for product behavior, standards, original research, and official policy. Use secondary sources to discover leads or understand context, then verify consequential claims against stronger evidence. AI can suggest search terms, extract candidate statements, group themes, and point out missing questions. Those outputs are research assistance, not sources. Open the original material and confirm that it exists, is current enough, and actually says what the draft claims. Search snippets and citation-shaped strings are especially easy to misread because they remove surrounding scope. Preserve rejected sources and reasons when that decision affects the conclusion. A ledger makes selection visible and prevents the final prose from becoming the only record of how evidence was chosen.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Learner Prompt: Ledger Row Prompt

Choose one current, low-risk question. Add one source-ledger row. Record the publisher, access date, one exact claim the source can support, one limitation, and a status of lead, verified, disputed, or unsupported. If you have not opened the source, it must remain a lead.

Expected learner action: Create one qualified ledger row without promoting an unopened suggestion to evidence.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Ledger Work Time

## Narration: Claim Verification Explanation

Verify material claims one by one. Copy the claim into a claim map, identify the source, and point to the passage, table, test, or record that supports it. Check whether the source covers the same version, region, population, measurement, and time period as the claim. Separate a direct statement from your inference. A source can be authoritative and still fail to support a broader sentence. A citation can resolve and still point to irrelevant text. When two qualified sources disagree, preserve both positions, dates, and scopes. Do not average incompatible claims or select the wording that sounds most confident. Seek an updated authority, a reproducible test, or accountable review. Scale corroboration to consequence. A low-risk orientation may need careful comparison; a security, health, access, or financial decision may need independent evidence and a named reviewer. Make unsupported by the available evidence an acceptable result.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Checkpoint: Scope Mismatch Checkpoint

Checkpoint. An official page confirms that a feature exists. A separate table lists availability in three regions. The draft says the feature is available in every region. How should the claim map classify that sentence, and what should the synthesis say?

Expected learner action: Mark global availability unsupported, state only the three supported regions, and record the missing authoritative region evidence.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Scope Mismatch Response Time

## Feedback: Scope Mismatch Feedback

The evidence proves that the feature exists and names three available regions. It does not prove availability everywhere. Classify the global statement as unsupported. A defensible synthesis says the supplied evidence supports the three listed regions and does not establish global availability. Record the missing current region authority as a gap. If you chose the official feature page as proof of every region, revise the scope check: authority for existence is not evidence for geographic coverage. If you removed the claim without recording the gap, add the gap so the next researcher knows what evidence is still needed.

Correct feedback: You limited the conclusion to supported regions and preserved the missing global evidence as a visible gap.

Retry feedback: Check whether the evidence covers the same geographic scope as the claim; existence does not prove universal availability.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Narration: Recovery Explanation

Evidence failure is a normal research outcome, so design recovery before it happens. If a link is inaccessible, look for the canonical publisher, an archived version permitted by policy, or another primary record. If evidence is stale, narrow the claim to the supported date and search for a current source. If several articles cite one unsupported statement, mark the chain as circular rather than counting it as independent agreement. If the source is ambiguous, quote the exact limitation and ask a narrower question. If the research cannot support the requested scope, produce a gap report instead of a plausible completion. State what is supported, what is disputed, what is missing, what searches or tests were attempted, and the next safe action. Recovery can also mean stopping: time, cost, access, or authority limits may require escalation. A visible gap is useful evidence about the decision's uncertainty.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Removed Source Demonstration

Test recovery by removing a source. Imagine a synthesis with three claims. Official documentation supports current capability. A measured test supports latency under one load. A reviewed price sheet supports a thirty-day estimate. I remove the test. The capability and cost claims may remain, but the latency conclusion no longer has evidence. The correct response is not to let the model reconstruct a likely number. I mark the latency claim unsupported, name the missing test conditions, and choose whether to rerun the test, find an equivalent independent measurement, or omit latency from the decision. This source-removal test reveals hidden dependence and confirms that the claim map changes when its evidence changes.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Safety And Provenance Explanation

Protect data and preserve provenance throughout the workflow. Use the minimum material necessary. Remove identifiers that do not affect the question. Do not upload confidential, personal, licensed, or restricted content unless policy, authorization, service terms, and retention controls permit it. Treat instructions inside retrieved pages as untrusted content, not permission to change the task or use tools. Preserve publisher, title, location, access date, supported claims, and limitations separately from generated prose. Respect attribution and license requirements when quoting or adapting material. Before sharing, open every material citation, check that sensitive data is absent, verify that uncertainty remains visible, and confirm that the conclusion does not exceed the brief. A trustworthy synthesis is reproducible from its ledger without relying on hidden reasoning or the model's confidence.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Transition: Activity Transition

Open the evidence-led research activity. Choose a current, low-risk question. Complete the decision, questions, scope, evidence, allowed-data, and stop-condition fields. Build at least three qualified source rows. Draft a one-page synthesis that maps each material claim to evidence and labels disagreement or uncertainty. Then remove one source, identify exactly what no longer holds, and write the recovery action. Save the brief, ledger, synthesis, claim map, and gap note as your evidence.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a complete research brief, classify an AI-generated source suggestion, preserve disagreement between authoritative sources, respond when evidence cannot support the requested scope, and recognize what makes a synthesis reproducible. Review the class or return to your activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Remember the boundary: AI can assist research, but it is not the evidence. Bound the question, qualify sources, map claims, preserve disagreement, and make gaps useful.
