import {base, node} from './graphs.mjs';

export const learnerGraph = base('learner-parallel', 'parallel', [
  node('research', 'research', [], 'researcher', ['read']),
  node('review', 'review', ['research'], 'reviewer', ['read']),
  node('validate', 'validate', [], 'validator', ['validate']),
  node('parent', 'parent', ['research', 'review', 'validate'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
]);

export function assessLearnerGraph(graph) {
  const branches = ['research', 'review', 'validate'].map(id => graph.nodes.find(item => item.id === id));
  const parent = graph.nodes.find(item => item.id === 'parent');
  const independent = branches.every(item => item && item.dependsOn.length === 0);
  const requiredJoin = ['research', 'review', 'validate'].every(id => parent?.dependsOn.includes(id));
  return {independent, requiredJoin, pass: independent && requiredJoin};
}
