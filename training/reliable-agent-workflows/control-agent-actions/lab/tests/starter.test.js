import test from 'node:test';
import assert from 'node:assert/strict';
import {unsafeExecute} from '../starter/unsafe-executor.js';
import {base} from '../fixtures.js';

test('unsafe starter must reject an unauthorized tenant before mutation',() => {
  const x = base();
  x.context.actor.tenantId = 'tenant_other';
  const result = unsafeExecute(x.action,x.context,x.env);
  assert.equal(result.callMutations,0,'EXPECTED FAILURE: starter mutated before tenant authorization');
});
