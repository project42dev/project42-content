import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { expiryStatus } from './date.mjs';

export function isArtifactPathContained(artifactsRoot, candidate, pathApi = { dirname, isAbsolute, relative, resolve, sep }) {
  const rel = pathApi.relative(artifactsRoot, candidate);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${pathApi.sep}`) && !pathApi.isAbsolute(rel) && pathApi.resolve(pathApi.dirname(candidate)) !== candidate;
}

async function verifyArtifact(labRoot, record) {
  const artifactsRoot = await realpath(resolve(labRoot, 'artifacts'));
  const candidate = await realpath(resolve(labRoot, record.file));
  if (!isArtifactPathContained(artifactsRoot, candidate)) {
    throw new TypeError(`identity artifact file: must resolve beneath ${artifactsRoot}`);
  }
  const bytes = await readFile(candidate);
  return bytes.length === record.bytes && createHash('sha256').update(bytes).digest('hex') === record.sha256;
}

export async function assessEvidence(dossier, labRoot, asOf) {
  const weightsMatch = await verifyArtifact(labRoot, dossier.identity.weights);
  const tokenizerMatch = await verifyArtifact(labRoot, dossier.identity.tokenizer);
  const matrixKnown = dossier.terms.matrix.every(row => row.evidenceStatus === 'direct' && row.status !== 'unknown');
  const expiry = expiryStatus(dossier.decision.date, dossier.decision.expiresAfterDays, asOf);
  const checks = [
    ['identity.publisher', Boolean(dossier.identity.publisher)], ['identity.repository', Boolean(dossier.identity.repository)], ['identity.revision', Boolean(dossier.identity.revision)],
    ['weights.digest', weightsMatch], ['tokenizer.digest', tokenizerMatch], ['promptTemplate', Boolean(dossier.identity.promptTemplate.id)], ['runtime', Boolean(dossier.identity.runtime.version)],
    ['lineage.base', dossier.identity.base.evidenceStatus === 'direct'], ['terms.controllingText', dossier.terms.controllingStatus === 'direct'], ['terms.matrix', matrixKnown],
    ['provenance.noGaps', dossier.provenance.gaps.length === 0], ['decision.expiry', !expiry.expired]
  ];
  const missing = checks.filter(([, known]) => !known).map(([name]) => name);
  const prohibited = dossier.terms.matrix.some(row => row.status === 'prohibited' && row.evidenceStatus === 'direct');
  const problems = [];
  if (!weightsMatch || !tokenizerMatch) problems.push('artifact-digest-mismatch');
  if (dossier.terms.contradiction) problems.push('contradictory-terms');
  if (dossier.identity.base.evidenceStatus !== 'direct' || dossier.provenance.gaps.length > 0) problems.push('lineage-gap');
  if (!prohibited && !matrixKnown) problems.push('use-not-covered');
  if (expiry.expired) problems.push('decision-expired');
  const known = checks.length - missing.length;
  return { completeness: { known, total: checks.length, percent: Number(((known / checks.length) * 100).toFixed(2)), missing }, prohibited, problems, expiryDate: expiry.expiryDate };
}
