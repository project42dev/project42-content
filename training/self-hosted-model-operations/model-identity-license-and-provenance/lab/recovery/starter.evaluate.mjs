// DELIBERATE DEFECT: this starter ignores missing and contradictory evidence.
export function decide(dossier, assessment) {
  if (assessment.prohibited) {
    return { disposition: 'reject', reasons: ['explicitly-prohibited'] };
  }

  return { disposition: 'approve-isolated-evaluation', reasons: [] };
}
