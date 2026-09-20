# Changed-input exercise

Do not edit the implementation. Complete `starter.mjs` so it tests a new synthetic notification preference whose generated record ID is unknown in advance.

Your test must causally demonstrate all of these outcomes:

1. A permitted restricted notification preference can be written and read as evidence.
2. Another subject cannot retrieve it.
3. Revoking consent after the write blocks cache retrieval.
4. Restoring consent allows an append-and-supersede correction.
5. A deletion receipt stays pending despite a false caller claim while the actual backup exists.
6. No pending-deletion content is returned from backup lookup.
7. Completion occurs only after the synthetic backup purge time.
8. The receipt contains provenance but not either deleted value.
9. Assertions use IDs returned by operations, not literal `mem_...` IDs.

Record your causal explanation in a copy of `artifact-template.json`. Run your test with:

```sh
node --test exercise/starter.mjs
```

After attempting it, compare with `solution.mjs` and score it using `rubric.md`.
