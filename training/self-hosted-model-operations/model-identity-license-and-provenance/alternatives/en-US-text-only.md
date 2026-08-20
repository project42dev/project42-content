# Know Exactly Which Model You Are Allowed to Operate: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class begins before downloading or running a model. You will identify the exact deployment object, separate public access from legal permission and Open Source claims, review all applicable terms against an intended use, trace model lineage without filling gaps with assumptions, and issue a dated decision with clear reviewer authority. A model family nickname can help you search. It cannot prove which bytes, terms, transformations, or runtime you intend to operate.

## Narration: Deployment Object Narration

Start by naming the object under review. Separate the complete AI system from the model architecture, weight files, tokenizer, configuration, prompt or chat template, adapters, quantization, inference runtime, dependencies, and surrounding application. Each component can come from a different publisher, carry a different version or license, and introduce a different security or failure boundary. Record a deployment tuple: publisher and repository, immutable revision, filenames and cryptographic digests, base-model lineage, derivative or adapter identity, quantization method and parameters, tokenizer, template, runtime and version, and intended deployment shape. Use immutable identifiers, not a mutable branch, latest alias, cache name, or friendly label. If a material field is unknown, mark it unresolved. Do not quietly replace the missing value with the most likely answer. The tuple is the target for legal review, integrity verification, compatibility tests, evaluation, deployment, and later incident response.

Visual alternative: Rows identify publisher, repository, revision, files, digests, base model, adapter, quantization, tokenizer, template, runtime, and deployment shape; unknown fields remain explicitly unresolved.

Sources:

- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>
- <https://huggingface.co/docs/hub/model-cards>

## Demonstration: Tuple Demonstration

Imagine a repository described only as a seven-billion-parameter assistant. The proposed file is a four-bit quantization uploaded by a community publisher. Its card links to a fine-tune, which links to a base model. The runtime applies a separate chat template. The name alone hides four publishers, three transformations, several sets of terms, and the runtime contract. A defensible record pins each link, file, digest, quantization setting, tokenizer, template, and runtime. If the base revision or conversion recipe cannot be found, the lineage is incomplete. That does not automatically prove danger, but it prevents a confident identity claim and changes the allowed decision.

Visual alternative: The example contains multiple publishers and transformations. The base revision and conversion recipe are unknown and therefore block a complete identity claim.

Sources:

- <https://huggingface.co/docs/hub/model-cards>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Access And Freedom Narration

Next, use precise labels. Publicly downloadable weights establish that someone can obtain the files under presented conditions. They do not establish commercial permission, modification rights, redistribution rights, safety, provenance, support, or source transparency. Open-weight is commonly used for accessible weights, but the exact terms may restrict fields of use, users, scale, outputs, modification, or distribution. The Open Source Initiative's Open Source AI Definition version one evaluates freedoms to use, study, modify, and share, together with access to the preferred form for modification. When you make an Open Source AI claim, cite the exact definition and evidence. When the evidence only shows downloadable weights under named terms, say exactly that. Precise language is not a branding debate. It prevents technical teams, learners, downstream users, and distributors from receiving permissions that the evidence never granted.

Visual alternative: Each label requires different evidence. Download access alone does not prove permission to modify, redistribute, or describe the complete system as Open Source AI.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Checkpoint: Claim Checkpoint

Checkpoint. The weights can be downloaded, but the repository links to additional terms and the right to redistribute a quantized derivative is unclear. Which claim can you safely make now, and which claim must wait for evidence or authorized interpretation?

Learner action: State that public download is supported while redistribution permission and an Open Source AI claim remain unestablished.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>

## Pause: Claim Response Time

## Feedback: Claim Feedback

A strong answer says only that the weights are publicly obtainable under the presented conditions. Redistribution of the derivative is not established until the controlling terms and lineage are reviewed. The complete system should not be called Open Source AI merely because one set of weights is downloadable. If your answer treated access as permission, revise it by naming the exact right you need and the evidence that grants it.

If correct: You limited the claim to observed access and kept redistribution and Open Source status pending exact evidence.

If retrying: Name the specific permission or definition requirement instead of inferring it from download access.

Sources:

- <https://opensource.org/ai/open-source-ai-definition>

## Narration: Terms Review Narration

Review the applicable terms as one system. Collect the license text from the pinned revision, repository terms, acceptable-use policy, model card, notices, attribution requirements, base-model terms, adapter or dataset obligations, and deployment or distribution conditions. Record the retrieved version and date. A short license metadata field helps discovery but does not replace controlling text. Map the intended use across internal or external access, commercial use, modification, fine-tuning, generated-output terms, hosting an API, redistribution, derivative sharing, attribution, notice preservation, downstream restrictions, geography, scale, users, and termination. Separate facts from interpretations. Educational content and model output can organize evidence; they cannot issue legal approval. Send ambiguity that changes a consequential decision to an authorized legal or policy reviewer with the exact sources, artifact tuple, and intended use.

Visual alternative: Internal use, API hosting, modification, and redistribution are reviewed separately against exact terms rather than one metadata label.

Sources:

- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>
- <https://huggingface.co/docs/hub/model-cards>

## Narration: Lineage Narration

Trace lineage through every material transformation. A model card may describe intended uses, limits, datasets, training, evaluations, base models, licenses, and library compatibility. Treat each field as a claim to verify. Follow the base model, fine-tune, adapter, merge, conversion, and quantization references until the proposed artifact's ancestry is understood. Label each statement directly evidenced, inferred, unknown, or requiring authorized interpretation. Record missing training information, unclear derivative relationships, absent evaluations, conflicting terms, unverified publishers, and incompatible versions. Never ask a model to invent a plausible bridge between two missing records. Choose an explicit response: stop, request evidence, select another artifact, or permit only a bounded isolated evaluation through the authorized process. The gap remains visible even when a reviewer accepts residual risk.

Visual alternative: Every transformation links to evidence. Missing or contradictory links remain Unknown and lead to stop, request, alternate, or bounded-review decisions.

Sources:

- <https://huggingface.co/docs/hub/model-cards>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Decision Narration

Finish with a dated, scoped, and expiring adoption decision. Include the exact artifact tuple, intended and prohibited uses, applicable terms, required notices, lineage, authoritative sources, gaps, reviewers, approval scope, decision date, and expiry or re-review triggers. Keep technical recommendation, security review, legal or policy interpretation, and operational acceptance as distinct authorities. One signature should not be misread as every kind of approval. Re-review when the publisher, revision, license, use policy, base model, adapter, quantization, tokenizer, template, runtime, deployment audience, distribution method, or use case changes. Preserve rejected candidates and reasons. This record lets a later operator explain not only what runs, but why it was selected and when that decision must be challenged.

Visual alternative: The decision identifies exact artifacts, uses, terms, gaps, reviewers, scope, dates, and changes that force re-review.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Learner Prompt: Activity Transition

Now build the identity and terms decision using a low-risk candidate repository without downloading or executing its files. Complete the immutable tuple, retrieve exact terms, map proposed uses, trace lineage, label every claim by evidence status, and choose approve for isolated evaluation, reject, or hold for evidence. Include reviewer boundaries, expiry conditions, and re-review triggers. Your evidence is the tuple, terms matrix, lineage map, gap ledger, and bounded disposition.

Learner action: Complete the identity tuple, terms matrix, lineage map, evidence labels, bounded disposition, reviewer boundaries, and re-review triggers.

Sources:

- <https://huggingface.co/docs/hub/model-cards>
- <https://opensource.org/ai/open-source-ai-definition>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can identify the complete deployment tuple, limit access claims to evidence, choose controlling terms, preserve lineage gaps, route consequential ambiguity, and recognize re-review triggers. The check begins only when you select Begin knowledge check.

## Closing: Class Closing

Remember: available is not identified, identified is not authorized, and authorized is not proven safe. Preserve exact artifacts, exact terms, explicit gaps, distinct reviewer authority, and a date when the decision must be examined again.
