# Model Identity, Licensing, and Provenance

Package: `model-identity-license-and-provenance-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome to Model Identity, Licensing, and Provenance. This class begins before downloading or running a model. You will identify the exact deployment object, separate public access from permission and Open Source AI claims, review all applicable terms against an intended use, trace lineage without filling gaps with assumptions, issue a dated and expiring decision, and repair an offline policy gate. A model family nickname can help you search. It cannot prove which bytes, terms, transformations, or runtime you intend to operate.

## Narration: Deployment Object Narration

Start by naming the exact object under review. Separate the complete AI system from its architecture, weight files, tokenizer, configuration, prompt or chat template, adapters, quantization, inference runtime, dependencies, and surrounding application. Each component can have a different publisher, version, license, security boundary, and failure mode. Write the deployment object as a tuple: publisher and repository, immutable revision, weight filename, byte count and SHA-256, base-model lineage and evidence status, derivative identity, quantization method and parameters, tokenizer digest, prompt-template revision, runtime name and version, hardware architecture, and deployment shape. Record intended use, distribution, and users too. Use an immutable revision, not a mutable branch, latest alias, cache name, or friendly label. If a required element is unresolved, write UNKNOWN. Promotion must stop or follow an authorized exception process. Do not replace a missing value with the most likely answer. This tuple becomes the target for integrity checks, compatibility tests, legal or policy review, deployment, and later incident response.

Sources:

- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>
- <https://huggingface.co/docs/hub/model-cards>

## Demonstration: Tuple Demonstration

Here is a synthetic example. A repository is described only as a seven-billion-parameter assistant. The proposed file is a four-bit quantization uploaded by a community publisher. Its model card links to a fine-tune, and that fine-tune links to a base model. The runtime applies a separate chat template. The family nickname therefore hides multiple publishers, transformations, terms, and a runtime contract. A defensible record pins each repository and revision, each material file and digest, the quantization setting, tokenizer, template, runtime, and deployment shape. If the base revision or conversion recipe cannot be found, record UNKNOWN EVIDENCE for that link. A digest can later establish local byte identity, but it cannot repair an unproved lineage claim.

Sources:

- <https://huggingface.co/docs/hub/model-cards>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Access And Freedom Narration

Use precise evidence labels. Publicly downloadable means retrieval was offered under presented conditions. It does not establish commercial use, modification, redistribution, hosting, every user group, every field of use, safety, provenance, support, or reproducibility. Open-weight is a description of accessible weights, not automatically a permission grant. The Open Source Initiative's Open Source AI Definition version 1.0 evaluates freedoms to use, study, modify, and share, together with access to the preferred form for making modifications, including relevant data information, code, and parameters. Apply the Open Source AI label only after evaluating those requirements. Otherwise say, for example, publicly downloadable weights under named terms. Keep these labels distinct: PUBLICLY DOWNLOADABLE, NAMED TERMS, PERMITTED USE, OPEN SOURCE AI, and LEGAL OR POLICY APPROVAL. This distinction prevents a download button or metadata label from silently becoming permission.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Checkpoint: Claim Checkpoint

Checkpoint. The weights can be downloaded, but the repository links to additional terms and the right to redistribute a quantized derivative is unclear. State one claim supported now and one claim that must wait for evidence or authorized interpretation.

Expected learner action: State that public download is supported while redistribution permission and an Open Source AI claim remain unestablished.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>

## Pause: Claim Response Time

## Feedback: Claim Feedback

A strong answer says only that the weights are publicly obtainable under the presented conditions. Redistribution of the derivative is not established until the controlling terms and lineage are reviewed. The complete system should not be called Open Source AI merely because one set of weights is downloadable. If you treated access as permission, revise the answer by naming the exact right you need and the evidence that would grant it.

Correct feedback: You limited the claim to observed access and kept redistribution and Open Source AI status pending exact evidence.

Retry feedback: Name the specific permission or definition requirement instead of inferring it from download access.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>

## Narration: Terms Review Narration

Review applicable terms as one decision. Collect the license at the immutable revision, repository terms, acceptable-use policy, model card, notices, attribution requirements, base-model and adapter terms, relevant dataset obligations, and deployment or distribution conditions. Preserve the retrieved text, source, revision, and date. A Hugging Face model-card metadata license field can help discovery, but metadata does not replace controlling text. Map stated use, distribution, and users separately to permissions, obligations, restrictions, and unknowns. Every row must repeat the corresponding proposed value, so an old permission row cannot silently approve a changed scope. Include internal use, commercial use, modification, fine-tuning, API hosting, redistribution, derivative sharing, attribution, notices, geography, scale, and user groups when relevant. Separate facts from interpretation. The lab's controlling excerpts are fictional educational policy, not legal advice or real vendor grants. A consequential ambiguity goes to an authorized legal or policy reviewer with the exact artifact, source text, and proposed scope.

Sources:

- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>
- <https://huggingface.co/docs/hub/model-cards>

## Narration: Lineage Narration

Trace lineage through every material transformation. A model card may describe intended uses, limitations, datasets, training, evaluations, base models, licenses, and library compatibility. Treat each field as a claim to verify. Follow base-model, fine-tune, adapter, merge, conversion, quantization, and tokenizer links until the ancestry and transformations of the proposed artifact are understood. Label each claim direct, inferred, unknown, or contradictory. A SHA-256 match proves that local bytes match the bytes named by that digest. It does not prove who trained the model, what data were used, whether the claimed base was used, or whether the publisher had authority to distribute it. The lab's artifact-directory containment and symlink checks protect this exercise's boundary, but containment and a digest do not prove provenance. Never invent a bridge between missing records. Stop, request evidence, select another artifact, or use only a bounded isolated evaluation through the authorized process.

Sources:

- <https://huggingface.co/docs/hub/model-cards>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Decision Narration

Issue a dated, scoped, expiring, and reversible decision. The adoption record identifies the exact artifact tuple, stated use, distribution, users, applicable terms, notices, lineage, evidence sources, unresolved gaps, accountable reviewers, scope, decision date, expiry, and re-review triggers. Keep technical recommendation, security review, legal or policy interpretation, and operational acceptance as separate authorities. Use an explicit as-of date rather than relying on a machine clock. Validate both dates as real Gregorian calendar dates. In this fictional policy, a decision is valid before its expiry date and expired on the expiry date. Re-review on expiry or whenever the artifact, terms, audience, distribution, use, tokenizer, template, runtime, derivative, or lineage changes. The dispositions are approve-isolated-evaluation, hold-for-evidence, and reject. None of these is legal approval.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Provider Evidence Method Lab Narration

Apply one evidence method across provider families. For Meta Llama, DeepSeek, Mistral, Qwen, Phi, NVIDIA Nemotron, and Z.ai GLM, begin with the publisher and exact repository rather than a family nickname. Pin an immutable revision and record exact weight, tokenizer, configuration, template, adapter, and quantization files. Record the declared architecture with its source, plus the exact runtime name, version, hardware architecture, and deployment shape actually proposed. For every family, retrieve controlling terms and notices from the pinned publisher source, then trace base and derivative links. Label each claim direct, inferred, unknown, or contradictory. Do not transfer a license or architecture conclusion between revisions. This method does not assert a current license, architecture, permission, benchmark, price, or Open Source AI status for any listed family. Those conclusions require evidence for the exact selected artifact and revision.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Worked Example Lab Narration

Now work through the supplied fictional Atlas dossier. This fixture is entirely synthetic. The three-byte weights file contains the bytes abc. The CLI hashes those bytes to check artifact identity. The empty tokenizer is also hashed, so the two fixture components can be matched against the recorded evidence. All twelve required checks are known. All three terms-matrix values match the proposed scope. No provenance gap is recorded. With as-of date 2026-09-20, the decision dated 2026-09-20 has not reached its 30-day expiry. Completeness is 12 of 12, or 100 percent, with zero missing checks. The fictional disposition is approve-isolated-evaluation. This result does not grant rights, validate a vendor license, prove training lineage, measure model quality, or authorize production.

Sources:

- <https://github.com/project42dev/project42-content>
- <https://opensource.org/ai/open-source-ai-definition>

## Demonstration: Worked Example Demonstration

Connect the result to the evidence rather than treating the percentage as permission. The weights hash verifies the local weights bytes. The tokenizer hash verifies the empty tokenizer bytes. The twelve known checks show completeness for this fixture. The three matrix rows are bound to the proposed use, distribution, and users, so no stale row is silently reused. The date calculation is deterministic because the as-of date is explicitly 2026-09-20. The result is therefore a fictional gate outcome for an exact, unexpired, isolated-evaluation scope. It is not a statement that Atlas exists, that any provider granted a license, or that the artifact is safe.

Sources:

- <https://github.com/project42dev/project42-content>

## Narration: Lab Entry Lab Narration

Enter the offline lab using the supplied repository location. The required runtime is Node.js 22. No dependency installation, network, GPU, model download, or remote artifact execution is needed. Run node src/cli.mjs fixtures/positive.json --as-of 2026-09-20, then node test/run-tests.mjs starter. The starter has one bounded defect in decide: after preserving explicit rejection, it approves evidence problems instead of holding. Validation, proposal-to-matrix binding, calendar expiry, artifact containment, and independent tests are already complete. Edit only src/evaluate.mjs. Then run node test/run-tests.mjs learner, and after attempting the repair run node test/run-tests.mjs reference. The test runner gathers all cases and treats exceptions as failures. Attempt the repair before consulting the separate reference. These commands are instructions for the supplied offline lab, not evidence that execution occurred in this lesson.

Sources:

- <https://github.com/project42dev/project42-content>

## Learner Prompt: Activity Transition

Build the identity and terms decision using the supplied low-risk candidate dossier without downloading or executing remote artifacts. First complete the immutable tuple. Next retrieve exact terms and make a three-row matrix for proposed use, distribution, and users. Then trace lineage, label every claim, record contradictions and evidence gaps, identify accountable reviewers, and choose approve-isolated-evaluation, reject, or hold-for-evidence. Include decision date, expiry, and re-review triggers. Your evidence must include the tuple, the three-row matrix, provenance graph, gap ledger, bounded disposition, and reviewer boundaries. The activity is activity-model-identity-decision, and its required evidence includes a focused evaluator repair whose positive, hold, reject, changed-scope, expiry, validation, and containment tests pass.

Expected learner action: Complete the identity tuple, three-row terms matrix, lineage map, evidence labels, bounded disposition, reviewers, expiry, and re-review triggers.

Sources:

- <https://github.com/project42dev/project42-content>
- <https://opensource.org/ai/open-source-ai-definition>

## Pause: Activity Work Time

## Learner Prompt: Changed Input Task

Now perform the changed-input task. Evaluate changeduse.json after the positive Atlas example. Its bytes still match, but external API distribution is unknown. State the disposition, the reason, and the gate rule that produces it. Then consider an independent mutation that changes proposed use, distribution, or users without changing the terms matrix. Explain what validation must do. Your answer should say hold-for-evidence for changeduse.json because the external API distribution is not covered by directly evidenced fictional terms. A matching digest does not carry a prior scope decision into a new scope. Validation must reject each stale matrix because every proposedValue must equal dossier.proposed[row.dimension].

Expected learner action: Answer hold-for-evidence, identify unknown external API distribution as the cause, and state that stale proposed values must be rejected.

Sources:

- <https://github.com/project42dev/project42-content>

## Feedback: Changed Input Feedback

The correct changed-input answer is hold-for-evidence. The artifact bytes match, but external API distribution is unknown, so the required permission evidence is incomplete. The causal priority is important: direct prohibition produces reject; otherwise any missing, unknown, contradictory, mismatched, stale, expired, or uncovered evidence produces hold; only complete evidence for the exact isolated-evaluation scope before expiry produces approve-isolated-evaluation. Grade your response as correct if it names hold-for-evidence and connects it to unknown external API distribution. Give partial credit if it notices the changed scope but calls the result approved. Do not award credit for saying the digest alone authorizes the API. For mutation cases, full credit also requires the proposal-to-matrix binding rule: each row's proposedValue must equal dossier.proposed for that dimension.

Correct feedback: You held the changed scope because its external API distribution lacks permission evidence and bound every matrix row to the current proposal.

Retry feedback: A matching digest proves byte identity only. Recheck the changed distribution and the required proposedValue equality.

Sources:

- <https://github.com/project42dev/project42-content>

## Narration: Learner Variation Lab Narration

The broader learner-variation suite checks positive before expiry, on expiry, and after expiry; invalid dates; digest and lineage gaps; explicit prohibition; traversal outside artifacts; and a symlink canary when the platform permits it. The expiry rule is exact: if a decision expires on 2026-10-20, as-of 2026-10-19 is before expiry, while 2026-10-20 is already expired and requires re-review. Repair only the decision priority, not the validation or test boundaries. Preserve the explicit reject rule. Then hold for every evidence problem. Approve only a complete, unexpired, exact isolated-evaluation scope. The focused repair is conceptually: if assessment.completeness.missing has entries or assessment.problems has entries, return hold-for-evidence with those problems as reasons.

Sources:

- <https://github.com/project42dev/project42-content>

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can identify the complete deployment tuple, limit access claims to evidence, distinguish metadata from controlling terms, preserve lineage gaps, route consequential ambiguity to an authorized reviewer, and recognize re-review triggers. The check contains seven questions. It covers exact identity, public availability, contradictory terms, SHA-256 meaning, reviewer authority, changeduse.json, and expiry. Select Begin knowledge check only when ready. The system should not begin or submit it automatically.

## Closing: Class Closing

Remember the control rule: available is not identified, identified is not authorized, and authorized is not proven safe. Preserve exact artifacts, exact terms, explicit gaps, source IDs, distinct reviewer authority, a deterministic as-of date, and the date when the decision must be examined again. When evidence is unknown or contradictory, hold rather than treating silence as permission.
