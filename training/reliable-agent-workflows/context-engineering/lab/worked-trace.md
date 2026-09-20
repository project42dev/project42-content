# Full worked trace

Trace `normal-sufficient` without relying on a saved answer string.

1. Validation finds all mandatory slots, known candidate roles, non-conflicting source revisions, and linked tool results.
2. The total is 32 simulated size units. Reserved units are 5, 3, 4, 4, and 2, for `18`. Evidence capacity is `32 - 18 = 14` units.
3. The trusted contract names `approval-register` and `safety-register` as authoritative. Candidate labels do not alter that set.
4. `approval-r7` satisfies `approval`. It is one day old against a seven-day fixture rule and costs 4 units.
5. `safety-r3` satisfies `safety`, carries disconfirming value, is one day old, and costs 4 units. The comparator therefore ranks it before `approval-r7`.
6. `retrieved-note` contains useful batch text and an instruction to ignore policy. Its retrieved origin fixes its classification as untrusted data. It costs 2 units but cannot satisfy an authoritative claim or change tool authority.
7. `large-manual` is irrelevant and is omitted with reason `irrelevant` before any capacity decision.
8. Used space is `4 + 4 + 2 = 10` of 14. Both required claims are present, no authoritative values conflict, and the status is `READY`.
9. `READY` does not perform a side effect. The separate tool gate still verifies trusted configuration, allowed authority source, authority revision, state revision, tool ID, allowed path, and the exact mutation before calling `apply`.

Exact generated line:

```text
normal-sufficient READY selected=safety-r3,approval-r7 untrusted=retrieved-note missing=- conflicts=- budget=10/14
```

For the changed-input exercise, `forum-safety` is retrieved and explicitly irrelevant. The untrusted-selection loop records `forum-safety` with reason `irrelevant` and does not charge its 3 units. Adding the supplied authoritative `safety-r5` record gives `approval-r7` and `safety-r5`, using 8 of the 10 evidence-capacity units, and produces:

```text
changed-input READY selected=approval-r7,safety-r5 untrusted=- missing=- conflicts=- budget=8/10
```

Removing safety produces `missing=claim:safety` and `ESCALATE`. Adding a current authoritative safety record with a different value retains both records, reports `conflicts=safety`, and produces `ESCALATE`. Marking retrieved text `trust: trusted` does not promote it because validation rejects the forged label.
