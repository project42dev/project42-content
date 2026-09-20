# Worked trace

1. The fixed clock is `2026-09-20T12:00:00.000Z`.
2. Trusted context supplies tenant `tenant-a`, subject `subject-1`, and purpose `writing-style`. None comes from the proposed value.
3. `write` checks current consent, purpose, source, sensitivity, verification time, expiration, and the heuristic. Trusted code assigns `mem_001` and independently copies it into five maps.
4. Cache retrieval still checks the authoritative record and returns the value only as evidence with provenance.
5. `correct` creates `mem_002` with `supersedes: mem_001`. Every old copy is marked superseded, so normal index retrieval returns only `mem_002`.
6. `requestDeletion` removes `mem_002` from store, index, summary, and cache. It retains a backup until the synthetic purge time. Its tombstone and receipt retain identity and provenance timestamps, but not the deleted value.
7. A backup lookup returns an empty list because an active deletion request and missing authoritative record remove retrieval authority.
8. Early reconciliation receives a false caller claim that the backup is absent. It ignores that claim, inspects the map, and remains `pending-backup`.
9. At the governed purge time, reconciliation removes the actual backup copy. Only then does the receipt become `completed`.
