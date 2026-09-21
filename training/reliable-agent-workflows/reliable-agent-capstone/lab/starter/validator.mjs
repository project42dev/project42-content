import { validatePackageCore } from '../shared/package-validation.mjs';

export async function validatePackage(dir) {
  // Deliberate single defect: shared structural checks run, but referenced evidence
  // is not yet bound to manifest attemptId, version, caseId, and outcome.
  return validatePackageCore(dir);
}
