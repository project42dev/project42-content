# Model artifact integrity repair lab

Repository entry: [training/self-hosted-model-operations/model-artifact-integrity/lab/README.md](/training/self-hosted-model-operations/model-artifact-integrity/lab/README.md)

Run every command from the repository root. Node.js 22 is the only requirement. The lab uses no dependencies, API keys, network access, downloads, model loading, deserialization, conversion, or inference. `fixtures/artifact.bin` is empty and `fixtures/tokenizer.txt` contains exactly the three bytes `abc`. This is fixture simulation, not live-model integration or production approval.

## Files and trust roles

- `manifest.json` is the fixed baseline fixture manifest.
- `fixtures/` is the only enumerated artifact directory.
- `verify.mjs` is the learner starter with one deliberate final binding defect.
- `verifier-core.mjs` contains shared path, inventory, digest, evidence, and policy controls. Do not edit it.
- `reference/verify.mjs` is the repaired reference. Do not edit it.
- `tests.mjs` creates repository-local workspaces and independently checks immutable, changed-input, and negative behavior. Do not edit it.
- `evidence-matrix.md`, `transformation-record.json`, `promoted-manifest.json`, and `recovery-record.example.json` form the worked promotion packet.
- `reset.mjs` restores fixture bytes and removes generated test workspaces without deleting investigation examples.

## Starter execution

Run:

    node training/self-hosted-model-operations/model-artifact-integrity/lab/verify.mjs

The starter exits 1. Its exact stdout is:

    INVENTORY PASS files=2
    DIGEST PASS fixtures/artifact.bin e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    DIGEST PASS fixtures/tokenizer.txt ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    SBOM PASS inventory-covered
    EXECUTABLE-SURFACE PASS no-load
    SIGNATURE NOT-APPLICABLE local-fixture-policy
    PROVENANCE PASS expected-local-builder
    SCAN PASS stated-fixture-scope
    PROMOTION REJECT inventory-binding-mismatch expected=local-fixture-v1 observed=fixtures/artifact.bin=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855|fixtures/tokenizer.txt=ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad

The digest and inventory gates have passed. The final comparison is wrong because a bundle label is not an inventory binding.

## Learner repair

Open `verify.mjs`. Change only the marked expression:

    manifest.bundleId

into:

    manifest.promotion.inventoryBinding

Do not hardcode either SHA-256 digest, bypass a gate, edit the tests or reference, trust a filename, or reject all candidates.

Run the verifier again. It exits 0. Its exact stdout is:

    INVENTORY PASS files=2
    DIGEST PASS fixtures/artifact.bin e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    DIGEST PASS fixtures/tokenizer.txt ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    SBOM PASS inventory-covered
    EXECUTABLE-SURFACE PASS no-load
    SIGNATURE NOT-APPLICABLE local-fixture-policy
    PROVENANCE PASS expected-local-builder
    SCAN PASS stated-fixture-scope
    PROMOTION PASS bundle=local-fixture-v1

## Independent tests

Run:

    node training/self-hosted-model-operations/model-artifact-integrity/lab/tests.mjs

After the repair, the command exits 0 with exact stdout:

    TEST PASS immutable promotion
    TEST PASS same-length tamper rejection
    TEST PASS changed trusted input promotion
    TEST PASS accurate size rejection
    TEST PASS unlisted artifact rejection
    TEST PASS duplicate inventory rejection
    TEST PASS absolute path rejection
    TEST PASS SBOM mismatch rejection
    TEST PASS reference agreement
    TEST PASS source fixture immutability
    TEST SUMMARY 10 passed

The same-length tamper changes `abc` to `abd` without changing size 3. With the baseline manifest unchanged, its verifier stdout is exactly:

    INVENTORY PASS files=2
    DIGEST PASS fixtures/artifact.bin e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    DIGEST REJECT fixtures/tokenizer.txt expected=ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad observed=a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9
    PROMOTION REJECT digest-mismatch

It exits 1. The separate size test writes one byte to the empty file and accurately expects `REJECT size-mismatch fixtures/artifact.bin expected=0 observed=1`, rather than incorrectly claiming a digest rejection.

The changed trusted-input variation uses a copied manifest, replaces `abc` with `abd`, independently calculates the new digest, and updates both the inventory digest and complete promotion binding. It exits 0 under the narrow local fixture policy. This prevents a solution that merely hardcodes the two original hashes. It does not show that a candidate-controlled production manifest is trustworthy.

## Production boundary

The fixture signature status is `not-applicable` because the local policy explicitly allows unsigned inert fixtures with serving disabled. No signature is generated or verified. If production policy requires a signature and it is missing, the outcome is HOLD. Production verification must check the cryptographic signature over the intended subject, the key or certificate chain, signer authorization, revocation state, and policy. A valid signature still does not prove safe behavior.

Likewise, matching digests in an attacker-controlled manifest are not authenticated provenance. Real deployment additionally requires authenticated expectations and provenance, runtime-specific sandboxing, dependency and license review, immutable storage, resource enforcement, compatibility testing, and behavioral evaluation.

## Recovery

To restore the source fixture and remove generated test workspaces, run:

    node training/self-hosted-model-operations/model-artifact-integrity/lab/reset.mjs

It exits 0 with exact stdout:

    RECOVERY PASS fixture restored; investigation example retained

The recovery command does not delete `recovery-record.example.json` or overwrite the fixed manifest. In a real incident, preserve rejected bytes, the original manifest, observed digests, verifier output, timestamps, and operator identity in immutable or content-addressed storage before restoring the last verified identity.