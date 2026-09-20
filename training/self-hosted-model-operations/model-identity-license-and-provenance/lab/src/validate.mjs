import { parseDate } from './date.mjs';

const evidenceStatuses = new Set(['direct','inferred','unknown','contradictory']);
const termStatuses = new Set(['allowed','prohibited','unknown']);
const shapes = new Set(['offline-workstation','internal-service','external-api']);
const distributions = new Set(['none','internal-service','external-api','redistribution']);
const users = new Set(['internal-researchers','employees','public']);
const derivativeTypes = new Set(['fine-tune','adapter','merge','conversion','none']);
const dimensions = new Set(['use','distribution','users']);

function fail(path, message) { throw new TypeError(`${path}: ${message}`); }
function object(value, path) { if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(path, 'expected object'); return value; }
function array(value, path) { if (!Array.isArray(value)) fail(path, 'expected array'); return value; }
function text(value, path) { if (typeof value !== 'string' || value.length === 0) fail(path, 'expected nonempty string'); return value; }
function enumValue(value, allowed, path) { text(value, path); if (!allowed.has(value)) fail(path, `unexpected enum ${value}`); return value; }
function integer(value, path, min, max) { if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) fail(path, `expected integer from ${min} through ${max}`); return value; }
function digest(value, path) { text(value, path); if (!/^[a-f0-9]{64}$/.test(value)) fail(path, 'expected lowercase SHA-256 hex'); }
function revision(value, path) { text(value, path); if (!/^[a-f0-9]{40}$/.test(value)) fail(path, 'expected immutable 40-character revision'); }
function exactKeys(value, allowed, path) { for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${path}.${key}`, 'unexpected field'); for (const key of allowed) if (!(key in value)) fail(`${path}.${key}`, 'missing field'); }

export function validateDossier(input) {
  const d = object(input, 'dossier');
  exactKeys(d, ['schemaVersion','fixtureNotice','identity','proposed','terms','provenance','decision'], 'dossier');
  integer(d.schemaVersion, 'dossier.schemaVersion', 1, 1);
  text(d.fixtureNotice, 'dossier.fixtureNotice');

  const i = object(d.identity, 'dossier.identity');
  exactKeys(i, ['publisher','repository','revision','architecture','weights','derivative','base','quantization','tokenizer','promptTemplate','runtime','deploymentShape'], 'dossier.identity');
  text(i.publisher, 'identity.publisher'); text(i.repository, 'identity.repository'); revision(i.revision, 'identity.revision'); text(i.architecture, 'identity.architecture');
  for (const field of ['weights','tokenizer']) { const a = object(i[field], `identity.${field}`); exactKeys(a, ['file','bytes','sha256'], `identity.${field}`); text(a.file, `identity.${field}.file`); integer(a.bytes, `identity.${field}.bytes`, 0, 1000000); digest(a.sha256, `identity.${field}.sha256`); }
  const derivative = object(i.derivative, 'identity.derivative'); exactKeys(derivative, ['type','publisher','revision'], 'identity.derivative'); enumValue(derivative.type, derivativeTypes, 'identity.derivative.type'); text(derivative.publisher, 'identity.derivative.publisher'); revision(derivative.revision, 'identity.derivative.revision');
  const base = object(i.base, 'identity.base'); exactKeys(base, ['repository','revision','evidenceStatus'], 'identity.base'); text(base.repository, 'identity.base.repository'); revision(base.revision, 'identity.base.revision'); enumValue(base.evidenceStatus, evidenceStatuses, 'identity.base.evidenceStatus');
  const q = object(i.quantization, 'identity.quantization'); exactKeys(q, ['method','bits','groupSize','groupSizeUnit'], 'identity.quantization'); text(q.method, 'identity.quantization.method'); integer(q.bits, 'identity.quantization.bits', 2, 16); integer(q.groupSize, 'identity.quantization.groupSize', 1, 65536); if (q.groupSizeUnit !== 'weights') fail('identity.quantization.groupSizeUnit', 'expected weights');
  const template = object(i.promptTemplate, 'identity.promptTemplate'); exactKeys(template, ['id','revision'], 'identity.promptTemplate'); text(template.id, 'identity.promptTemplate.id'); revision(template.revision, 'identity.promptTemplate.revision');
  const runtime = object(i.runtime, 'identity.runtime'); exactKeys(runtime, ['name','version','architecture'], 'identity.runtime'); text(runtime.name, 'identity.runtime.name'); if (!/^22\.\d+\.\d+$/.test(runtime.version)) fail('identity.runtime.version', 'expected Node 22 semantic version'); enumValue(runtime.architecture, new Set(['x64','arm64']), 'identity.runtime.architecture');
  enumValue(i.deploymentShape, shapes, 'identity.deploymentShape');

  const p = object(d.proposed, 'dossier.proposed'); exactKeys(p, ['use','distribution','users'], 'dossier.proposed'); text(p.use, 'proposed.use'); enumValue(p.distribution, distributions, 'proposed.distribution'); enumValue(p.users, users, 'proposed.users');
  const terms = object(d.terms, 'dossier.terms'); exactKeys(terms, ['metadataLicense','controllingText','controllingStatus','contradiction','matrix'], 'dossier.terms'); text(terms.metadataLicense, 'terms.metadataLicense'); text(terms.controllingText, 'terms.controllingText'); enumValue(terms.controllingStatus, evidenceStatuses, 'terms.controllingStatus'); if (typeof terms.contradiction !== 'boolean') fail('terms.contradiction', 'expected boolean');
  array(terms.matrix, 'terms.matrix'); if (terms.matrix.length !== 3) fail('terms.matrix', 'expected use, distribution, and users rows');
  const seen = new Set();
  terms.matrix.forEach((row, index) => {
    object(row, `terms.matrix[${index}]`); exactKeys(row, ['dimension','proposedValue','status','evidenceStatus','source'], `terms.matrix[${index}]`);
    enumValue(row.dimension, dimensions, `terms.matrix[${index}].dimension`); if (seen.has(row.dimension)) fail(`terms.matrix[${index}].dimension`, 'duplicate dimension'); seen.add(row.dimension);
    text(row.proposedValue, `terms.matrix[${index}].proposedValue`); if (row.proposedValue !== p[row.dimension]) fail(`terms.matrix[${index}].proposedValue`, `must equal proposed.${row.dimension}`);
    enumValue(row.status, termStatuses, `terms.matrix[${index}].status`); enumValue(row.evidenceStatus, evidenceStatuses, `terms.matrix[${index}].evidenceStatus`); text(row.source, `terms.matrix[${index}].source`);
  });
  for (const dimension of dimensions) if (!seen.has(dimension)) fail('terms.matrix', `missing ${dimension} row`);

  const provenance = object(d.provenance, 'dossier.provenance'); exactKeys(provenance, ['links','gaps'], 'dossier.provenance'); array(provenance.links, 'provenance.links').forEach((v, n) => text(v, `provenance.links[${n}]`)); array(provenance.gaps, 'provenance.gaps').forEach((v, n) => text(v, `provenance.gaps[${n}]`));
  const decision = object(d.decision, 'dossier.decision'); exactKeys(decision, ['date','expiresAfterDays'], 'dossier.decision'); parseDate(decision.date, 'decision.date'); integer(decision.expiresAfterDays, 'decision.expiresAfterDays', 1, 365);
  return d;
}
