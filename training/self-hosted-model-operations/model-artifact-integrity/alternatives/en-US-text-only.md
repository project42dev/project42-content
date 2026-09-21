# Move Model Artifacts from Quarantine to Trusted Service: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class treats a model repository as supply-chain input, not as a harmless collection of weights. You will design a quarantine boundary, distinguish what each verification signal proves, inspect executable and parser surfaces before loading, give every transformation a new identity, and promote only a complete immutable bundle with a tested revocation path. We will use synthetic manifests. No real model download or execution is required.

## Narration: Quarantine Narration

Acquire the exact pinned revision into a non-serving, non-production quarantine. The environment has no learner data, no production credentials, minimal network access, bounded storage and compute, and an operator-approved destination. Preserve repository metadata and original filenames. Do not enable remote code, plugins, post-install hooks, or model loading merely to discover package contents. Before transformation, record the authoritative source URL, immutable revision, retrieval time, transfer mechanism, expected manifest, observed files, sizes, and cryptographic digests. Compare expected and observed inventory. A mutable branch, latest tag, cache entry, or friendly model name must never silently replace the approved candidate. Quarantine is enforced isolation plus policy. A folder called quarantine that shares production credentials, runtime, caches, or network authority is not a trust boundary.

Visual alternative: Unreviewed files enter only quarantine. Promotion to a read-only trusted store occurs after every required gate passes; serving reads only immutable approved identities.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>
- <https://huggingface.co/docs/hub/en/model-release-checklist>

## Demonstration: Quarantine Demonstration

Consider a synthetic manifest expecting two weight shards, one tokenizer, one configuration file, and one license notice. The observed archive also contains an installer and a symbolic link that points outside the extraction root. A filename-based check might accept the familiar shards and ignore the extras. A safe acquisition records the full observed inventory, blocks extraction traversal, marks the unexpected executable surface, and holds the candidate. The operator does not load the model to see whether it works. The mismatch itself is enough to prevent promotion while evidence is preserved.

Visual alternative: The candidate is held before loading because unexpected executable content and an extraction escape violate the approved manifest.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>

## Narration: Evidence Narration

Verification signals answer different questions. A cryptographic digest shows whether bytes match an expected digest. It does not identify a trustworthy publisher or prove safety. A verified signature can bind signed material to an identity under a trust policy. It does not prove that the signer created a safe or suitable model. Provenance can describe where and how an artifact was produced, but the record must be authenticated and compared with expected builder, source, inputs, and process. Scanners can report known malware, secrets, vulnerable dependencies, suspicious files, or patterns within their configured coverage. A clean result means no covered issue was reported, not that risk is absent. A software bill of materials inventories components and relationships. It does not prove correct licensing, secure execution, model quality, or complete behavior. Combine these signals with license review, sandbox inspection, compatibility tests, evaluation, and human decisions. Never collapse them into one green trust badge.

Visual alternative: Digests, signatures, provenance, scans, and inventories each provide limited evidence and none independently proves safe model behavior.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://slsa.dev/spec/v1.2/verifying-artifacts>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Checkpoint: Digest Checkpoint

Checkpoint. A candidate's digest matches the expected value. What exactly has been established, and name two important claims that still need different evidence.

Learner action: State that the bytes match the expected digest and name unproven claims such as publisher identity, license, provenance, safety, or quality.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>

## Pause: Digest Response Time

## Feedback: Digest Feedback

The matching digest establishes byte equality with the expected digest. It does not tell you who should have published those bytes, how they were built, whether the terms allow your use, whether loading is safe, or whether model behavior meets requirements. If your answer used the word trusted without naming the trust policy and other evidence, narrow the claim and identify the next gate.

If correct: You limited the digest claim to byte equality and kept identity, provenance, terms, safety, and quality as separate gates.

If retrying: Replace the broad word trusted with the exact property a digest can prove.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>

## Narration: Executable Surfaces Narration

Inspect the complete executable and parser surface before model loading. Repositories can contain serialized objects, Python modules, native extensions, build scripts, package metadata, custom operators, tokenizer code, templates, conversion tools, and runtime plugins. PyTorch warns not to load data from an untrusted source because loading can use unpickling. Restricted weight-only modes narrow some exposure but do not eliminate resource exhaustion or memory-corruption risk. Prefer non-executable tensor formats when the chosen runtime supports them, but do not trust an extension alone. Inspect archive traversal, symbolic links, oversized or malformed tensors, unexpected files, dependency installers, custom-code flags, dynamic imports, network calls, and conversion steps. Run any unavoidable parser or converter in a disposable least-privileged sandbox with strict CPU, memory, storage, time, and network limits. Capture the result without granting the candidate production authority.

Visual alternative: Every unavoidable parser runs without production data or credentials and with strict resource, time, filesystem, privilege, and network limits.

Sources:

- <https://docs.pytorch.org/docs/stable/generated/torch.load.html>
- <https://huggingface.co/docs/hub/en/model-release-checklist>

## Narration: Transformation Narration

Treat every material transformation as a new artifact identity. Conversion, merging, pruning, quantization, sharding, repackaging, or changing a tokenizer or template can alter bytes, behavior, dependencies, compatibility, and obligations. Record input digests, tool and dependency versions, configuration, command or workflow, isolated environment, output inventory and digests, operator or automation identity, and the resulting evaluation target. Link the output to inputs through authenticated provenance and verification expectations. Repeat license, integrity, compatibility, and evaluation gates for the transformed candidate. Do not inherit approval merely because the process began with approved weights. The derived artifact earns its own decision.

Visual alternative: The quantized output has a new identity and must repeat license, integrity, compatibility, and evaluation gates.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/>

## Narration: Promotion Narration

Promote a complete immutable bundle, not a convenient filename. The bundle identifies weights, tokenizer, template, configuration, runtime, dependencies, and policy; records digests, signatures or documented absence, provenance, scans, license disposition, compatibility, evaluation target, reviewers, and expiry triggers; and moves by digest into a read-only trusted store. Serving resolves only the approved immutable identity. Fail closed when files, digests, signer identity, provenance predicates, lineage, terms, dependency review, scans, or sandbox checks violate policy. Preserve evidence, block serving, revoke the candidate from controlled caches and mirrors, investigate affected environments, and restore the last verified bundle. Rehearse that procedure before release. Revocation is incomplete if one mutable alias, warm cache, or disconnected site can continue serving the rejected bytes.

Visual alternative: Promotion requires every evidence gate. Revocation blocks serving, preserves evidence, removes controlled copies, restores the last verified identity, and confirms recovery.

Sources:

- <https://slsa.dev/spec/v1.2/verifying-artifacts>
- <https://slsa.dev/spec/v1.2/provenance>
- <https://huggingface.co/docs/hub/en/model-release-checklist>

## Learner Prompt: Activity Transition

Now design the synthetic artifact promotion packet. Define quarantine, immutable source and inventory, digest and signature policy, provenance expectations, scanning, dependency inventory, and executable-surface review. Add one quantization transformation with new input and output identities. Write pass, hold, and fail-closed rules, including unsafe deserialization and resource exhaustion. Finish with the promoted-bundle manifest and a revocation procedure that restores the last verified bundle without destroying investigation evidence.

Learner action: Complete the quarantine plan, evidence matrix, transformation record, promotion manifest, fail-closed rules, and revocation procedure.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://docs.pytorch.org/docs/stable/generated/torch.load.html>

## Pause: Activity Work Time

## Narration: Worked Example And Variation Lab Narration

The fixed inventory contains `fixtures/artifact.bin`, an empty inert file, and `fixtures/tokenizer.txt`, the exact three bytes `abc`. The verifier first validates manifest structure, trusted local fixture-policy expectations, safe paths, complete filesystem enumeration, file sizes, SHA-256 digests, SBOM equality, executable-surface declarations, signature disposition, provenance fields, and scan scope. The starter's one deliberate defect occurs only at the final transition. It compares the canonical verified inventory binding with the bundle label `local-fixture-v1` instead of the manifest's exact `promotion.inventoryBinding`. Repair only the marked expression in `verify.mjs`, replacing `manifest.bundleId` with `manifest.promotion.inventoryBinding`. Do not hardcode either fixture digest, bypass a failed gate, trust a filename as proof, edit immutable tests, or reject every input. After repair, the baseline exits 0 and ends with `PROMOTION PASS bundle=local-fixture-v1`. The independent same-length tamper variation changes `abc` to `abd` while retaining size 3 and leaving the expected manifest unchanged. A second changed-input variation updates the copied test manifest and inventory binding to that independently calculated digest. It passes the narrow local fixture policy, demonstrating that the learner did not substitute a hardcoded allowlist of the original hashes. This controlled test does not imply that an attacker-controlled production manifest should be trusted. Node.js `fileURLToPath` converts `import.meta.url` to a platform-appropriate filesystem path, `webcrypto.subtle.digest('SHA-256', bytes)` computes the digest, `path.relative` supports containment checks, and `fsPromises.lstat` identifies symbolic links. The reference uses an explicit workspace argument as-is. Its default is the parent of its own `reference` directory, correcting the earlier defect that moved every explicit workspace to its parent. Use this rubric: complete work changes only the marked binding expression, passes all immutable tests, accepts the independently changed trusted fixture, rejects same-length tampering and every negative case, preserves exact output and exit behavior, and explains why digest success is narrower than provenance or safety. A deny-all implementation, hardcoded fixture-hash check, edited test, skipped enumeration, or fabricated signature result does not pass.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>

## Narration: Ecosystem Transfer Lab Narration

Meta Llama, Qwen, DeepSeek, Mistral, and Microsoft Phi are examples of distinct model-family ecosystems. They are not one shared runtime, format, tokenizer, license, API, capability set, or custom-code policy. Consult the documentation and release evidence for the exact selected artifact and runtime rather than inferring compatibility from a family name. The transferable procedure is provider-neutral: pin the source, quarantine the complete package, enumerate every artifact file, reject unsafe paths and executable surfaces, verify bytes against independently trusted expectations, evaluate signatures and provenance under policy, bind transformations to new identities, impose resource limits, conduct runtime-specific evaluations, and promote an immutable reviewed bundle. Keep four layers separate. A model family names related model releases. An artifact is a specific set of bytes and metadata. A runtime loads or executes an artifact under its own compatibility and security constraints. An API exposes operations under a provider-specific contract. Evidence for one layer does not automatically approve another. The lab has no integration with Meta, Qwen, DeepSeek, Mistral, Phi, Hugging Face, PyTorch, a model runtime, or a live endpoint. Provider names establish transfer scope only. No common capability, format support, or deployment approval is asserted.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can defend quarantine, bound every verification claim, identify executable loading risk, treat transformations as new artifacts, explain scanner limits, and execute a fail-closed mismatch response. The assessment starts only when you choose Begin knowledge check.

## Closing: Class Closing

Keep one rule: inspect before execution, prove each claim with the right evidence, and promote only an immutable bundle you already know how to revoke and replace.
