# Model Artifact Integrity and Safe Promotion: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to Model Artifact Integrity and Safe Promotion. This lesson treats a model repository as supply-chain input, not as a harmless collection of weight files. You will design a quarantine boundary, distinguish what each verification signal proves, inspect executable and parser surfaces before loading, give every transformation a new identity, and promote only a complete immutable bundle with a tested revocation path. We will use the supplied synthetic manifest and inert fixture. There is no download, model load, deserialization, conversion, inference, serving action, or live provider integration in this lesson. The observed results are supplied fixture evidence, not claims about production infrastructure.

Visual alternative: Unreviewed files enter only bounded quarantine. Promotion to immutable trusted storage occurs only after required controls pass, and serving reads an approved immutable identity.

## Narration: Quarantine Narration

Start with an exact pinned revision in a bounded, non-serving quarantine. The quarantine must not contain learner data or production credentials. Give it only the network access, storage, CPU, memory, process, and file authority required for acquisition and inspection. Preserve original filenames and repository metadata. Do not enable remote code, plugins, post-install hooks, automatic execution, model loading, or conversion merely to discover package contents. Before any transformation, record the authoritative source, immutable revision, retrieval time, transfer method, expected inventory, observed inventory, file sizes, and cryptographic digests. Compare the expected and observed inventories. A mutable branch, tag, latest alias, cache entry, or friendly model name must not silently replace the approved revision. Quarantine is a trust boundary enforced by isolation and policy. A directory called quarantine is not sufficient if it shares serving credentials, runtime authority, caches, or unrestricted network access. Files may move from acquisition into verification, but they must not enter a trusted runtime until every required control reaches pass. Hold means evidence is incomplete and promotion pauses. Reject means a control failed and serving remains blocked.

Visual alternative: Acquisition occurs in a bounded non-serving quarantine without learner data or production credentials. Promotion remains blocked until all controls pass.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>
- <https://huggingface.co/docs/hub/en/model-release-checklist>

## Demonstration: Quarantine Demonstration

Consider a synthetic package whose expected inventory contains two weight shards, one tokenizer, one configuration file, and one license notice. The observed package also contains an installer and a symbolic link that points outside the extraction root. A filename-based check might accept the familiar shards and ignore the extras. A safe acquisition enumerates the complete observed inventory, rejects traversal and absolute paths, identifies the symbolic link as an unsafe surface, and holds or rejects the candidate according to policy. The operator does not load the model to see whether it works. The mismatch itself is sufficient to block promotion while the original manifest, bytes, observed digests, timestamp, and verifier output are preserved. This is a pre-execution decision. It does not depend on a successful inference test.

Visual alternative: The candidate is blocked before loading because unexpected executable content and an unsafe link violate the approved inventory and path policy.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>

## Narration: Evidence Narration

Verification signals answer different questions, so do not collapse them into one trust badge. A SHA-256 digest establishes equality between observed bytes and an expected digest. It does not establish publisher identity, provenance, licensing, safe loading, acceptable behavior, or model quality. A cryptographic signature can bind signed material to an identity under a verification policy. Signature validity alone does not establish that the signer is authorized for this artifact, that the signed bytes satisfy deployment policy, or that behavior is safe. This lesson includes no production public key, certificate chain, transparency-log check, or signature implementation. If production requires a signature and it is absent, the result is hold. The fixture's not-applicable status is allowed only under a narrow local unsigned-fixture policy. SLSA provenance describes how an artifact was produced, including relevant inputs and build information. Its source, builder, configuration, and predicates must be authenticated and checked against policy. A candidate-controlled manifest that merely repeats expected strings is not authenticated provenance. Scans report findings only within their configured rules, inputs, and coverage. A clean result means no covered finding was reported. It does not prove that malicious behavior, unsafe deserialization, model-level failure, an uncovered vulnerability, or unacceptable terms are absent. A software bill of materials inventories declared components and relationships. It does not prove behavior, licensing approval, or complete security coverage. Each signal is useful, but each remains bounded.

Visual alternative: Digests, signatures, provenance, scans, and inventories provide different limited evidence. None independently proves safe model behavior.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://slsa.dev/spec/v1.2/verifying-artifacts>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Checkpoint: Digest Checkpoint

Checkpoint. A candidate's digest matches the expected value. What exactly has been established? Name at least two important claims that still need different evidence.

Learner action: State that the observed bytes match the expected digest, then name unproven claims such as publisher identity, provenance, license, loading safety, or behavior.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>

## Pause: Digest Response Time

## Feedback: Digest Feedback

The matching digest establishes byte equality with the expected digest. It does not tell you who should have published those bytes, how they were built, whether the terms permit your use, whether loading is safe, or whether behavior meets requirements. If your answer used the word trusted, narrow it. Say what is trusted, under which policy, and what separate evidence remains necessary. For example, a digest can show that the observed bytes equal an independently trusted expected value. It cannot turn a candidate-controlled manifest into authenticated provenance. A correctly signed artifact also needs signer authorization, policy checks, and behavioral evaluation.

If correct: You limited the digest claim to byte equality and kept identity, provenance, terms, safety, and quality as separate gates.

If retrying: Replace any broad claim of trust with the exact property a digest establishes: equality with an expected digest.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>

## Narration: Executable Surfaces Narration

Inspect the complete executable and parser surface before model loading. A model repository can contain serialized objects, language modules, native extensions, build scripts, package metadata, custom operators, tokenizer implementations, templates, conversion tools, and runtime plugins. PyTorch documents that its loading path uses an unpickler and warns against loading data from an untrusted source. Prefer non-executable tensor formats when the selected runtime supports them, but do not trust a file extension by itself. Inspect archive traversal, absolute paths, symbolic links, oversized or malformed tensors, duplicate entries, unexpected files, dependency installers, dynamic imports, network calls, custom-code flags, templates, tokenizer behavior, and conversion steps. The supplied verifier rejects unsafe paths, duplicate inventory entries, links, path escape after realpath resolution, missing or unlisted files, malformed evidence, size mismatches, digest mismatches, incomplete software bill of materials coverage, and executable-surface declarations outside the fixture policy. It enumerates only the bounded fixtures directory, so lesson source and test files are not mistaken for artifacts. If a parser or converter is unavoidable, run it in a disposable least-privileged sandbox with strict network, CPU, memory, process, file-count, time, and storage limits. These controls reduce known risks. They do not prove that a real parser, inference engine, accelerator library, tokenizer, or model is safe.

Visual alternative: Any unavoidable parser runs without production data or credentials and with strict resource, time, filesystem, privilege, and network limits.

Sources:

- <https://docs.pytorch.org/docs/stable/generated/torch.load.html>
- <https://huggingface.co/docs/hub/en/model-release-checklist>

## Narration: Transformation Narration

Conversion, merging, pruning, quantization, sharding, repackaging, or changing a tokenizer or template creates a materially different deployment artifact. Record input identities and digests, tool and dependency versions, configuration, command or workflow, isolated environment, output inventory and digests, operator or automation identity, and the new evaluation target. The supplied synthetic lineage record names input fixture-source-v1, uses the empty-file digest, performs synthetic-quantize with fixture-tool version 0.1, and records bits equal to 8 and group size equal to 32. Its output identity is fixture-quantized-v1, but its output digest is UNKNOWN. That missing digest is deliberately not promotable. Actual output bytes, a measured digest, and independently checked toolchain evidence would establish the missing value. The evaluation boundary is the transformed artifact on its target runtime, not the source artifact. Repeat integrity, license, compatibility, executable-surface, resource, and behavioral evaluation gates for the transformed artifact. Approval cannot be inherited merely because approved input weights began the process.

Visual alternative: The transformed artifact has a new identity. Its UNKNOWN digest prevents promotion, and all required gates must be repeated.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Promotion Narration

Promotion is a controlled state transition, not a rename. A promoted bundle identifies exact weights, tokenizer, template, configuration, runtime, dependencies, policy, file digests, signature status, provenance, scans, software bill of materials, license disposition, compatibility results, evaluation target, reviewer decisions, and expiry triggers. Store or reference it by immutable identity. Configure serving by that identity rather than by a mutable alias. In the supplied fixture policy, a narrow test promotion can pass for inert static bytes, serving disabled, bounded file count and size, complete filesystem inventory, exact software bill of materials coverage, explicit not-applicable signature status, expected local source and builder fields, stated scan scope, no custom code, and no attempted load. That is a genuine local state transition, not approval of a real model or production deployment. Digest equality, bounded inventory, software bill of materials equality, expected fixture provenance, stated scan evidence, and safe fixture surfaces can pass. A required production signature that is missing must hold while an authorized verifier checks the signature, signed subject, key or certificate trust, revocation status, and policy authorization. Path escape, malformed evidence, unsafe deserialization, resource-limit violation, unlisted content, digest mismatch, or policy mismatch must reject. On rejection, preserve the original manifest, rejected bytes, observed digests, verifier output, timestamp, and operator identity in immutable or content-addressed evidence. Mark the candidate revoked, block serving and controlled mirrors, investigate affected environments, and restore only the last verified immutable identity. Do not delete rejected evidence or change the expected digest to fit the candidate.

Visual alternative: Promotion requires every evidence gate. Revocation blocks serving, preserves evidence, removes controlled copies, restores the last verified identity, and confirms recovery.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>
- <https://slsa.dev/spec/v1.2/provenance>
- <https://huggingface.co/docs/hub/en/model-release-checklist>

## Learner Prompt: Activity Transition

Now design the synthetic artifact promotion packet. Use only the supplied inert fixture. Describe the quarantine boundary, pinned source revision, exact inventory, SHA-256 policy, signature policy, provenance expectations, scan scope, software bill of materials, dependency review, executable-surface review, file and resource caps, and unsafe-deserialization stop conditions. Add the synthetic quantization lineage record, including its new input identity, operation, toolchain, configuration, output identity, UNKNOWN output digest, and new evaluation boundary. Then write explicit pass, hold, and reject rules. Finish with an immutable promotion manifest and a recovery procedure that preserves rejected evidence, blocks the candidate, and restores the last verified identity. This packet is documentation and local fixture work. Do not download, load, deserialize, convert, execute, or serve a real model.

Learner action: Complete the quarantine plan, evidence matrix, transformation record, promotion manifest, fail-closed rules, and revocation procedure.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://docs.pytorch.org/docs/stable/generated/torch.load.html>

## Pause: Activity Work Time

## Narration: Worked Example And Variation Lab Narration

We now work through the supplied verifier. The fixed inventory contains an empty inert file at fixtures slash artifact dot bin and a tokenizer file at fixtures slash tokenizer dot txt containing exactly three bytes: abc. The verifier reads bytes and metadata only. It does not download, deserialize, execute, convert, or serve a model. It first validates manifest structure, trusted local fixture-policy expectations, safe paths, complete filesystem enumeration, file sizes, SHA-256 digests, software bill of materials equality, executable-surface declarations, signature disposition, provenance fields, and scan scope. The starter's one deliberate defect occurs only at the final transition. Earlier gates have already passed, but the final comparison uses the bundle label instead of the manifest's exact promotion inventory binding. A bundle label identifies the packet. The inventory binding identifies the complete verified path-and-digest inventory. Those are different facts. Repair only the marked expression in verify dot mjs. Replace manifest dot bundle ID with manifest dot promotion dot inventory binding. Do not hardcode either fixture digest, bypass a failed gate, trust a filename as proof, edit immutable tests, edit the shared verifier core, or reject every input. The supplied starter output ends with promotion reject, inventory-binding-mismatch, expected local-fixture-v1, followed by the complete canonical inventory binding. After the narrow repair, the baseline exits zero and ends with promotion pass, bundle equals local-fixture-v1. The important causal point is that all previous evidence was valid. The final identity binding alone was wrong. Node's file URL to path function converts the module URL to a platform-appropriate filesystem path. Web crypto subtle digest computes SHA-256 over bytes. Path relative supports containment checks, and file-system lstat identifies symbolic links. The reference uses an explicit workspace argument as supplied. Its default is the parent of its reference directory, correcting the earlier defect that moved every explicit workspace to its parent. The exact root-relative commands are shown visually, not spoken: node training slash self-hosted-model-operations slash model-artifact-integrity slash lab slash verify dot mjs, and node training slash self-hosted-model-operations slash model-artifact-integrity slash lab slash tests dot mjs. The command must be run from the repository root.

Visual alternative: The learner changes only the final inventory-binding expression. Full paths, commands, hashes, and expected output remain selectable text.

Sources:

- <https://csrc.nist.gov/publications/detail/fips/180/4/final>
- <https://nodejs.org/api/url.html#urlfileurltopathurl>
- <https://nodejs.org/api/webcrypto.html#subtledigestalgorithm-data>
- <https://nodejs.org/api/path.html#pathrelativefrom-to>
- <https://nodejs.org/api/fs.html#fspromiseslstatpath-options>

## Learner Prompt: Same Length Variation Prompt

Your first changed-input task is a same-length tamper test. Change the tokenizer contents from abc to abd, keeping the file size at three bytes. Leave the expected baseline manifest unchanged. Before viewing the answer, predict which gate should reject, why the size gate should not reject first, and what digest evidence should appear. Then distinguish this from a trusted changed-input test, where a copied manifest and complete promotion binding are deliberately updated to the independently calculated new digest.

Learner action: Predict digest-gate rejection, explain that equal size prevents size rejection from masking it, and distinguish the trusted changed-input variation from tampering.

Sources:

- <https://csrc.nist.gov/publications/detail/fips/180/4/final>

## Pause: Same Length Variation Pause

## Feedback: Same Length Variation Feedback

The changed bytes are abd, still three bytes long. The independently calculated digest is displayed. The unchanged baseline digest is also displayed. Because the size remains three, the size gate passes. The digest gate then rejects the changed bytes. The output reports digest reject for the tokenizer path and promotion reject for digest mismatch. A separate size test writes one byte to an empty file. It expects size mismatch before digest comparison. Do not confuse those causes. The trusted changed-input variation is different. It copies the test manifest, calculates the new digest independently, updates the inventory digest, and updates the complete promotion inventory binding. That variation passes the narrow local fixture policy. This shows the verifier is not hardcoded to the original hashes. It does not show that a candidate-controlled production manifest is trustworthy. A deny-all implementation would also be wrong. It would reject valid changed input. A hardcoded allowlist would also be wrong. It would fail the independently updated trusted variation.

If correct: You identified digest mismatch as the causal failure for equal-length abd, separated it from size mismatch, and explained why the updated trusted variation tests general verification.

If retrying: Keep the expected manifest unchanged for tampering. Equal size rules out size mismatch as the first cause; the observed digest must be compared with the unchanged expected digest.

Sources:

- <https://csrc.nist.gov/publications/detail/fips/180/4/final>

## Demonstration: Negative Controls Demonstration

The independent tests also exercise malformed and hostile inputs. The immutable promotion passes. The same-length tamper rejects. The changed trusted input passes. The accurate size change rejects at the size gate. An unlisted artifact rejects. A duplicate inventory entry rejects. An absolute path rejects. A software bill of materials mismatch rejects. The repaired learner verifier agrees with the reference, and the source fixture remains unchanged. Additional negative evidence includes malformed manifest rejection, wrong builder rejection under provenance policy, missing required signature rejection under signature policy, malformed inventory-entry rejection, and traversal-path rejection. The exact learner test summary is ten passed. These results establish behavior of the supplied dependency-free fixture verifier under the stated local policy. They do not establish production security, compatibility with a real model, or behavioral safety. Preserve the tests and reference. Do not edit them to make a result pass.

Visual alternative: The local verifier accepts the baseline and updated trusted variation and rejects tampering, unsafe paths, malformed evidence, unlisted files, duplicate entries, and software bill of materials mismatch.

Sources:

- <https://nodejs.org/api/webcrypto.html#subtledigestalgorithm-data>
- <https://nodejs.org/api/fs.html#fspromiseslstatpath-options>

## Narration: Ecosystem Transfer Lab Narration

Transfer the procedure across ecosystems without inventing compatibility. Meta Llama, Qwen, DeepSeek, Mistral, and Microsoft Phi are distinct model-family ecosystems. They are not one shared runtime, format, tokenizer, license, API, capability set, or custom-code policy. Consult the first-party documentation and release evidence for the exact selected artifact and runtime. Do not infer compatibility from a family name. The provider-neutral procedure is stable: pin the source, quarantine the complete package, enumerate every artifact file, reject unsafe paths and executable surfaces, verify bytes against independently trusted expectations, evaluate signatures and provenance under policy, bind transformations to new identities, impose resource limits, conduct runtime-specific evaluations, and promote an immutable reviewed bundle. Keep four layers separate. A model family names related model releases. An artifact is a specific set of bytes and metadata. A runtime loads or executes an artifact under its own compatibility and security constraints. An API exposes operations under a provider-specific contract. Evidence for one layer does not automatically approve another. This lesson has no integration with the listed ecosystems, a model host, a loader, a runtime, or a live endpoint. The provider repositories establish transfer scope only. No common capability, format support, or deployment approval is asserted.

Visual alternative: Different model ecosystems require independent verification of artifact bytes, runtime compatibility, API contract, licensing, and custom-code policy.

Sources:

- <https://github.com/meta-llama/llama-models>
- <https://github.com/QwenLM/Qwen3>
- <https://github.com/deepseek-ai/DeepSeek-V3>
- <https://github.com/mistralai/mistral-inference>
- <https://github.com/microsoft/PhiCookBook>

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can defend the quarantine boundary, state the narrow claim established by a digest, identify executable serialization and parser risk, treat a transformation as a new artifact, explain scanner and software bill of materials limits, respond correctly to a missing required signature, and repair the digest-to-promotion binding without hardcoding or denying every input. The nine questions cover acquisition, digest meaning, executable surfaces, transformed identities, scanner limits, mismatch response, signature hold, same-length tampering, and the updated trusted-input variation. Choose Begin knowledge check when ready. It will not start or submit automatically.

## Closing: Class Closing

Keep one rule: inspect before execution, prove each claim with the evidence that can actually support it, give every transformed artifact a new identity and evaluation boundary, and promote only an immutable bundle that you already know how to revoke and replace. The fixture demonstrates a narrow local state transition. It is not production approval. Your final responsibility is to preserve that boundary when the artifact, runtime, ecosystem, and policy change.

Visual alternative: Inspect before execution. Match each claim to appropriate evidence. Promote only immutable artifacts with a tested revocation path.
