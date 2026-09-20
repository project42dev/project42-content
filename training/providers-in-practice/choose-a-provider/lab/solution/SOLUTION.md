# Complete solution

Hard gates must constrain the candidate set before any weighted ranking. In `src/learner.js`, add this filter immediately before the existing unknown-metric filter:

```js
.filter(candidate => gateById.get(candidate.id).eligible)
```

The corrected pipeline is:

```js
const ranking = sortRanking(candidates
  .filter(candidate => gateById.get(candidate.id).eligible)
  .filter(candidate => unknownMetrics(candidate, requirements.weights).length === 0)
  .map(candidate => scoreCandidate(candidate, requirements.weights)));
```

This correction removes Quartz because its license gate is FAIL and Fog because its access gate is UNKNOWN. Alder passes its gates but remains in `insufficientEvidence` because its quality metric is UNKNOWN. Maple and Cedar are then scored from their actual metrics.

`reference.js` is a separate complete implementation. It first creates gate assessments, constructs an eligible set, and only then computes scores. Run it with `npm run reference`. After repairing the learner file, run `npm test` and `npm run evaluate`; both must exit 0.
