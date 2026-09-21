export function decide(dossier, assessment) {
  if (assessment.prohibited) {
    return { disposition: 'reject', reasons: ['explicitly-prohibited'] };
  }
  if (assessment.completeness.missing.length > 0 || assessment.problems.length > 0) {
    return { disposition: 'hold-for-evidence', reasons: assessment.problems };
  }
  return { disposition: 'approve-isolated-evaluation', reasons: [] };
}
