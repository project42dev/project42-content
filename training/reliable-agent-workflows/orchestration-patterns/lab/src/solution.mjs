import {base, node} from './graphs.mjs';

export const solutionGraph = base('learner-parallel', 'parallel', [
  node('research', 'research', [], 'researcher', ['read']),
  node('review', 'review', [], 'reviewer', ['read']),
  node('validate', 'validate', [], 'validator', ['validate']),
  node('parent', 'parent', ['research', 'review', 'validate'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
]);

export const feedback = {
  broken: 'Review depends on research, so it cannot overlap research. The parent still joins all three branches, but the false edge lengthens the execution path.',
  solution: 'Remove the false review dependency while retaining all three parent dependencies. The runtime can now overlap the independent branches without weakening final evidence requirements.',
  causalRubric: [
    'Research, review, and validation have empty dependency lists because their inputs are independent.',
    'The parent depends on all three branches, so a required failure prevents approval.',
    'Only parent authority can approve.',
    'The solution changes observed overlap, not merely a label or assertion.'
  ]
};
