import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';

export const requiredArtifacts = ['architecture-and-state-model.md','tool-inventory-and-permission-matrix.md','trust-boundary-and-threat-model.md','evaluation-set-and-rubric.json','failure-tests-and-results.md','observability-plan.md','operating-runbook.md','evidence-map-and-handoff.md'];
export const criterionMaxima = new Map([['reliable-capstone-correctness',20],['reliable-capstone-safety',20],['reliable-capstone-evidence',15],['reliable-capstone-reliability',20],['reliable-capstone-maintainability',15],['reliable-capstone-communication',10]]);
export const bindingKeys = ['attemptId','version','caseId','outcome'];

export async function validatePackageCore(dir, options = {}) {
  try {
    const names = await readdir(dir);
    for (const name of requiredArtifacts) if (!names.includes(name)) return invalid('E_MISSING', name);
    const evaluation = JSON.parse(await readFile(join(dir, 'evaluation-set-and-rubric.json'), 'utf8'));
    const manifest = evaluation.manifest;
    if (!manifest || bindingKeys.some((key) => typeof manifest[key] !== 'string' || manifest[key].length === 0)) return invalid('E_MANIFEST', 'binding');
    if (!['failed','passed'].includes(manifest.outcome)) return invalid('E_MANIFEST', 'outcome');
    if (!Array.isArray(evaluation.criterionScores) || evaluation.criterionScores.length !== criterionMaxima.size) return invalid('E_CRITERIA', 'count');
    const seen = new Set();
    let score = 0;
    for (const item of evaluation.criterionScores) {
      if (!item || !criterionMaxima.has(item.criterionId) || seen.has(item.criterionId)) return invalid('E_CRITERION_ID', String(item?.criterionId));
      seen.add(item.criterionId);
      if (!Number.isInteger(item.pointsAwarded) || item.pointsAwarded < 0 || item.pointsAwarded > criterionMaxima.get(item.criterionId)) return invalid('E_POINTS', item.criterionId);
      if (!Array.isArray(item.evidenceRefs) || item.evidenceRefs.length === 0) return invalid('E_REFERENCE', item.criterionId);
      score += item.pointsAwarded;
      for (const ref of item.evidenceRefs) {
        if (typeof ref !== 'string' || basename(ref) !== ref || !requiredArtifacts.includes(ref)) return invalid('E_REFERENCE', String(ref));
        if (!names.includes(ref)) return invalid('E_MISSING', ref);
        if (options.validateBinding) {
          const problem = await options.validateBinding({ dir, ref, evaluation, manifest, readFile, join, bindingKeys });
          if (problem) return invalid(problem.code, problem.detail);
        }
      }
    }
    if (seen.size !== criterionMaxima.size) return invalid('E_CRITERIA', 'missing');
    if (!Number.isInteger(evaluation.declaredTotal) || evaluation.declaredTotal !== score) return invalid('E_SUM', String(evaluation.declaredTotal));
    if (score > 100) return invalid('E_SUM', String(score));
    return { valid: true, score, passed: score >= 80 };
  } catch (error) {
    if (error && error.code === 'ENOENT') return invalid('E_MISSING', 'referenced-file');
    return invalid('E_PARSE', error instanceof Error ? error.message : String(error));
  }
}

function invalid(code, detail) { return { valid: false, code, detail }; }
