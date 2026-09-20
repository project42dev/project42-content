import {base, node} from '../src/graphs.mjs';

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

export const originalBrokenLearnerGraph = deepFreeze(base('learner-parallel', 'parallel', [
  node('research', 'research', [], 'researcher', ['read']),
  node('review', 'review', ['research'], 'reviewer', ['read']),
  node('validate', 'validate', [], 'validator', ['validate']),
  node('parent', 'parent', ['research', 'review', 'validate'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
]));
