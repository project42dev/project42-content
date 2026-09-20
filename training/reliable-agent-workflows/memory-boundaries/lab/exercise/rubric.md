# Causal rubric, 10 points

Score observed enforcement, not the presence of security vocabulary.

* **2 points, trusted setup:** Uses the changed notification fixture and restricted sensitivity, obtains IDs from operation results, and does not assume a literal generated ID.
* **2 points, isolation and revocation:** Shows that another subject is denied and that revocation after writing causes cache access to fail. Award only if the changed identity or consent state causes the failure.
* **2 points, correction:** Restores consent, appends a correction, proves the new ID differs, and proves normal retrieval excludes the superseded ID.
* **2 points, pending deletion:** Proves active removal, empty backup lookup, and `pending-backup` despite a false completion claim. Award only if actual backup state remains present during reconciliation.
* **1 point, completion and minimization:** Advances the explicit clock to the governed purge time, verifies every copy state is false, and verifies receipts omit both values while retaining provenance.
* **1 point, honest limits:** States that the detector is heuristic and cannot establish semantic safety, and that an in-memory map simulation does not prove production deletion or legal compliance.

A submission that edits internal maps before the pending-state assertion, hardcodes `mem_001`, or merely asserts expected constants without invoking lifecycle operations cannot receive more than 5 points. A submission that returns pending-deletion content from any layer cannot pass.
