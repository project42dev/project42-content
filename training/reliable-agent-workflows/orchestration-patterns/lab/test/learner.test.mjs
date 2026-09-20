import test from 'node:test';
import assert from 'node:assert/strict';
import {execute} from '../src/executor.mjs';
import {fixtures} from '../src/fixtures.mjs';
import {input} from '../src/graphs.mjs';
import {learnerGraph, assessLearnerGraph} from '../src/learner.mjs';

test('edited learner graph overlaps independent branches and preserves the required join', async () => {
  assert.deepEqual(assessLearnerGraph(learnerGraph), {independent: true, requiredJoin: true, pass: true});
  const starts = [];
  let active = 0;
  let maximum = 0;
  const result = await execute({
    graph: learnerGraph,
    fixtures,
    input: {...input, researchDelayMs: 20},
    config: {
      runId: 'learner-assessment',
      hooks: {
        onStart(id) {
          starts.push(id);
          active += 1;
          maximum = Math.max(maximum, active);
        },
        onEnd() {
          active -= 1;
        }
      }
    }
  });
  assert.equal(result.terminal.state, 'success');
  assert.equal(maximum, 3);
  assert.deepEqual(starts.slice(0, 3).sort(), ['research', 'review', 'validate']);
  assert.ok(starts.indexOf('parent') >= 3);
  assert.deepEqual(result.evidence.find(item => item.id === 'parent').result.aggregation, ['research', 'review', 'validate']);
  assert.ok(result.effects.some(effect => effect.node === 'parent' && effect.action === 'approve'));
});
