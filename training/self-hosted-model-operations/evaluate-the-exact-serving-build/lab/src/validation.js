import { readFile } from 'node:fs/promises';

const RESULT = new Set(['pass', 'fail']);
const GRADER = new Set(['deterministic', 'human', 'model-assisted']);
const IDENTITY_KEYS = ['artifactDigest', 'tokenizerDigest', 'templateDigest', 'adapter', 'runtime', 'quantization', 'hardware', 'policyDigest', 'configDigest', 'caseSet'];
const DIGEST_KEYS = new Set(['artifactDigest', 'tokenizerDigest', 'templateDigest', 'policyDigest', 'configDigest']);
const CONDITION_KEYS = ['caseSet', 'promptSet', 'seed', 'sampling', 'requestLimit', 'concurrency', 'hardwareAllocation', 'runtime', 'rubric', 'deterministicGrader', 'humanRubric', 'modelGrader', 'loadSchedule'];
const CHANGE_KEYS = new Set(['artifactDigest', 'tokenizerDigest', 'templateDigest', 'adapter', 'runtime', 'quantization', 'hardware', 'policyDigest', 'configDigest']);

function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
}
function exactKeys(value, keys, name) {
  object(value, name);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new TypeError(`${name} has missing or unknown fields`);
}
function text(value, name) {
  if (typeof value !== 'string' || value.trim().length === 0) throw new TypeError(`${name} must be non-empty text`);
}
function bool(value, name) {
  if (typeof value !== 'boolean') throw new TypeError(`${name} must be boolean`);
}
function number(value, name, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} must be finite in [${min}, ${max}]`);
}
function integer(value, name, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new RangeError(`${name} must be an integer in [${min}, ${max}]`);
}
function array(value, name, nonempty = false) {
  if (!Array.isArray(value) || (nonempty && value.length === 0)) throw new TypeError(`${name} must be ${nonempty ? 'a non-empty' : 'an'} array`);
}
function sameRecord(a, b) {
  const keys = Object.keys(a).sort();
  return keys.length === Object.keys(b).length && keys.every((key) => Object.hasOwn(b, key) && a[key] === b[key]);
}
function uniqueTexts(value, name, nonempty = true) {
  array(value, name, nonempty);
  const seen = new Set();
  for (const item of value) {
    text(item, `${name} item`);
    if (seen.has(item)) throw new Error(`${name} contains duplicate ${item}`);
    seen.add(item);
  }
  return seen;
}
function validateIdentity(value, name) {
  exactKeys(value, IDENTITY_KEYS, name);
  for (const key of IDENTITY_KEYS) {
    text(value[key], `${name}.${key}`);
    if (DIGEST_KEYS.has(key) && !/^sha256:[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value[key])) throw new TypeError(`${name}.${key} must be a sha256: identifier`);
  }
}
function validateConditions(value, name) {
  exactKeys(value, CONDITION_KEYS, name);
  text(value.caseSet, `${name}.caseSet`); text(value.promptSet, `${name}.promptSet`);
  integer(value.seed, `${name}.seed`); text(value.sampling, `${name}.sampling`);
  integer(value.requestLimit, `${name}.requestLimit`, 1); integer(value.concurrency, `${name}.concurrency`, 1);
  text(value.hardwareAllocation, `${name}.hardwareAllocation`); text(value.runtime, `${name}.runtime`);
  text(value.rubric, `${name}.rubric`); text(value.deterministicGrader, `${name}.deterministicGrader`);
  text(value.humanRubric, `${name}.humanRubric`); text(value.modelGrader, `${name}.modelGrader`);
  text(value.loadSchedule, `${name}.loadSchedule`);
}
function validateResults(value, name, caseIds) {
  array(value, `${name}.results`, true);
  const results = new Map();
  for (const item of value) {
    exactKeys(item, ['caseId', 'status', 'evidenceId'], `${name}.result`);
    text(item.caseId, `${name}.result.caseId`);
    if (!caseIds.has(item.caseId) || results.has(item.caseId)) throw new Error(`${name} has unknown or duplicate result ${item.caseId}`);
    if (!RESULT.has(item.status)) throw new RangeError(`${name} has unknown result status ${item.status}`);
    text(item.evidenceId, `${name}.result.evidenceId`);
    results.set(item.caseId, item);
  }
  return results;
}
function validateRun(value, name, caseIds, requireConditions) {
  const keys = requireConditions ? ['identity', 'conditions', 'declaredPassed', 'declaredTotal', 'results'] : ['identity', 'declaredPassed', 'declaredTotal', 'results'];
  exactKeys(value, keys, name);
  validateIdentity(value.identity, `${name}.identity`);
  if (requireConditions) validateConditions(value.conditions, `${name}.conditions`);
  const results = validateResults(value.results, name, caseIds);
  integer(value.declaredPassed, `${name}.declaredPassed`, 0, caseIds.size);
  integer(value.declaredTotal, `${name}.declaredTotal`, 1, caseIds.size);
  const passed = [...results.values()].filter((item) => item.status === 'pass').length;
  if (results.size !== caseIds.size || value.declaredTotal !== caseIds.size || value.declaredPassed !== passed) throw new Error(`${name} denominator does not match complete results`);
  return { results, passed, total: results.size };
}
function requireCaseList(value, name, caseIds) {
  const set = uniqueTexts(value, name);
  for (const id of set) if (!caseIds.has(id)) throw new Error(`${name} contains unknown case ${id}`);
  return set;
}
function requireEvidenceIds(value, name, evidenceById, predicate) {
  const ids = uniqueTexts(value, name);
  for (const id of ids) {
    const record = evidenceById.get(id);
    if (!record || !predicate(record)) throw new Error(`${name} references missing or wrongly bound evidence ${id}`);
  }
  return ids;
}

export async function loadDossier(path) {
  return validateDossier(JSON.parse(await readFile(path, 'utf8')));
}

export function validateDossier(dossier) {
  object(dossier, 'dossier');
  const requiredTop = ['schemaVersion','dossierId','fixtureNotice','gate','claims','prohibitedEffects','serviceObjectives','recoveryClaim','expectedCandidateIdentity','declaredCandidateVariables','baseline','candidate','cases','evidenceRecords','metrics','graderCalibration','dataGovernance','disposition'];
  exactKeys(dossier, requiredTop, 'dossier');
  if (dossier.schemaVersion !== 'serving-release-dossier.v2') throw new RangeError('unsupported schemaVersion');
  text(dossier.dossierId, 'dossierId'); text(dossier.fixtureNotice, 'fixtureNotice');
  exactKeys(dossier.gate, ['declaredBeforeResults','aggregateThreshold','criticalFailuresAllowed','rules'], 'gate');
  bool(dossier.gate.declaredBeforeResults, 'gate.declaredBeforeResults');
  number(dossier.gate.aggregateThreshold, 'gate.aggregateThreshold', 0, 1);
  integer(dossier.gate.criticalFailuresAllowed, 'gate.criticalFailuresAllowed', 0);
  object(dossier.gate.rules, 'gate.rules');
  for (const key of ['PASS','BOUNDED_PILOT','HOLD_FOR_EVIDENCE','REJECT','ROLL_BACK']) text(dossier.gate.rules[key], `gate.rules.${key}`);

  array(dossier.cases, 'cases', true);
  const caseIds = new Set();
  const caseById = new Map();
  const caseKeys = ['id','coverage','slice','critical','owner','source','permission','sensitivity','expected','prohibited','allowedToolTrajectory','rubric','expiry','grader'];
  for (const item of dossier.cases) {
    exactKeys(item, caseKeys, 'case');
    for (const key of ['id','coverage','slice','owner','source','permission','sensitivity','expected','prohibited','allowedToolTrajectory','rubric','expiry']) text(item[key], `case.${key}`);
    if (caseIds.has(item.id)) throw new Error(`duplicate case ${item.id}`);
    caseIds.add(item.id); caseById.set(item.id, item);
    bool(item.critical, 'case.critical');
    if (!GRADER.has(item.grader)) throw new RangeError(`unknown grader ${item.grader}`);
  }

  validateIdentity(dossier.expectedCandidateIdentity, 'expectedCandidateIdentity');
  const changed = uniqueTexts(dossier.declaredCandidateVariables, 'declaredCandidateVariables');
  for (const key of changed) if (!CHANGE_KEYS.has(key)) throw new RangeError(`unknown candidate variable ${key}`);
  const baseline = validateRun(dossier.baseline, 'baseline', caseIds, true);
  const candidate = validateRun(dossier.candidate, 'candidate', caseIds, true);
  if (!sameRecord(dossier.baseline.conditions, dossier.candidate.conditions)) throw new Error('baseline and candidate comparison conditions must match exactly');
  if (dossier.baseline.conditions.caseSet !== dossier.baseline.identity.caseSet || dossier.candidate.conditions.caseSet !== dossier.candidate.identity.caseSet) throw new Error('condition caseSet must match both identities');
  for (const key of IDENTITY_KEYS) {
    const differs = dossier.baseline.identity[key] !== dossier.candidate.identity[key];
    if (differs !== changed.has(key)) throw new Error(`declared candidate variable mismatch for ${key}`);
  }

  array(dossier.evidenceRecords, 'evidenceRecords', true);
  const evidenceById = new Map();
  for (const record of dossier.evidenceRecords) {
    exactKeys(record, ['id','kind','subject','caseId','observation'], 'evidence record');
    text(record.id, 'evidence.id'); text(record.kind, 'evidence.kind'); text(record.subject, 'evidence.subject');
    text(record.caseId, 'evidence.caseId'); text(record.observation, 'evidence.observation');
    if (evidenceById.has(record.id)) throw new Error(`duplicate evidence ${record.id}`);
    if (!['case','service','recovery'].includes(record.kind)) throw new RangeError(`unknown evidence kind ${record.kind}`);
    if (!['baseline','candidate'].includes(record.subject)) throw new RangeError(`unknown evidence subject ${record.subject}`);
    evidenceById.set(record.id, record);
  }
  for (const [subject, run] of [['baseline', baseline], ['candidate', candidate]]) {
    for (const result of run.results.values()) {
      const record = evidenceById.get(result.evidenceId);
      if (!record || record.kind !== 'case' || record.subject !== subject || record.caseId !== result.caseId) throw new Error(`${subject} result ${result.caseId} lacks correctly bound evidence`);
    }
  }

  function validateClaimList(value, name, expectedLength) {
    array(value, name, true);
    if (value.length !== expectedLength) throw new Error(`${name} must contain exactly ${expectedLength} items`);
    const ids = new Set();
    for (const item of value) {
      exactKeys(item, ['id','text','cases'], `${name} item`); text(item.id, `${name}.id`); text(item.text, `${name}.text`);
      if (ids.has(item.id)) throw new Error(`duplicate ${name} id ${item.id}`); ids.add(item.id);
      requireCaseList(item.cases, `${name}.${item.id}.cases`, caseIds);
    }
  }
  validateClaimList(dossier.claims, 'claims', 5);
  validateClaimList(dossier.prohibitedEffects, 'prohibitedEffects', 3);

  array(dossier.serviceObjectives, 'serviceObjectives', true);
  if (dossier.serviceObjectives.length !== 2) throw new Error('exactly two service objectives required');
  const serviceIds = new Set();
  let serviceObjectivesMet = true;
  for (const item of dossier.serviceObjectives) {
    exactKeys(item, ['id','metric','operator','limit','observed','met','evidenceIds'], 'service objective');
    text(item.id, 'service objective.id'); text(item.metric, 'service objective.metric');
    if (serviceIds.has(item.id)) throw new Error(`duplicate service objective ${item.id}`); serviceIds.add(item.id);
    number(item.observed, `${item.id}.observed`); number(item.limit, `${item.id}.limit`); bool(item.met, `${item.id}.met`);
    if (!['lte','eq'].includes(item.operator)) throw new RangeError(`unknown operator ${item.operator}`);
    const computed = item.operator === 'lte' ? item.observed <= item.limit : item.observed === item.limit;
    if (item.met !== computed) throw new Error(`${item.id}.met does not match observation`);
    requireEvidenceIds(item.evidenceIds, `${item.id}.evidenceIds`, evidenceById, (record) => record.kind === 'service' && record.subject === 'candidate' && record.caseId === item.id);
    serviceObjectivesMet = serviceObjectivesMet && computed;
  }

  exactKeys(dossier.recoveryClaim, ['id','text','cases','met','evidenceIds'], 'recoveryClaim');
  text(dossier.recoveryClaim.id, 'recoveryClaim.id'); text(dossier.recoveryClaim.text, 'recoveryClaim.text'); bool(dossier.recoveryClaim.met, 'recoveryClaim.met');
  const recoveryCases = requireCaseList(dossier.recoveryClaim.cases, 'recoveryClaim.cases', caseIds);
  const recoveryEvidence = requireEvidenceIds(dossier.recoveryClaim.evidenceIds, 'recoveryClaim.evidenceIds', evidenceById, (record) => record.kind === 'recovery' && record.subject === 'candidate' && recoveryCases.has(record.caseId));
  for (const caseId of recoveryCases) {
    if (![...recoveryEvidence].some((id) => evidenceById.get(id).caseId === caseId)) throw new Error(`recovery case ${caseId} lacks evidence`);
    if (dossier.recoveryClaim.met && candidate.results.get(caseId).status !== 'pass') throw new Error(`met recovery claim conflicts with failed ${caseId}`);
  }

  const identityMatches = sameRecord(dossier.expectedCandidateIdentity, dossier.candidate.identity);
  const denominatorMatches = true;
  const evidenceComplete = true;
  const criticalFailures = dossier.cases.filter((item) => item.critical && candidate.results.get(item.id).status !== 'pass').map((item) => item.id);

  exactKeys(dossier.metrics, ['baseline','candidate','slices','candidateLatencyMilliseconds','p95Method','candidateP95Milliseconds','candidateCrashes'], 'metrics');
  for (const [name, run] of [['baseline', baseline], ['candidate', candidate]]) {
    exactKeys(dossier.metrics[name], ['passed','total','rate'], `metrics.${name}`);
    integer(dossier.metrics[name].passed, `metrics.${name}.passed`, 0, caseIds.size);
    integer(dossier.metrics[name].total, `metrics.${name}.total`, 1, caseIds.size);
    number(dossier.metrics[name].rate, `metrics.${name}.rate`, 0, 1);
    if (dossier.metrics[name].passed !== run.passed || dossier.metrics[name].total !== run.total || dossier.metrics[name].rate !== run.passed / run.total) throw new Error(`metrics.${name} arithmetic mismatch`);
  }
  array(dossier.metrics.slices, 'metrics.slices', true);
  for (const slice of dossier.metrics.slices) {
    exactKeys(slice, ['slice','cases','baselinePassed','baselineTotal','candidatePassed','candidateTotal'], 'slice metric');
    text(slice.slice, 'slice.slice'); const ids = requireCaseList(slice.cases, `slice.${slice.slice}.cases`, caseIds);
    for (const key of ['baselinePassed','baselineTotal','candidatePassed','candidateTotal']) integer(slice[key], `slice.${slice.slice}.${key}`, 0, ids.size);
    const bp = [...ids].filter((id) => baseline.results.get(id).status === 'pass').length;
    const cp = [...ids].filter((id) => candidate.results.get(id).status === 'pass').length;
    if (slice.baselineTotal !== ids.size || slice.candidateTotal !== ids.size || slice.baselinePassed !== bp || slice.candidatePassed !== cp) throw new Error(`slice ${slice.slice} arithmetic mismatch`);
  }
  array(dossier.metrics.candidateLatencyMilliseconds, 'candidateLatencyMilliseconds', true);
  for (const value of dossier.metrics.candidateLatencyMilliseconds) number(value, 'latency observation');
  text(dossier.metrics.p95Method, 'p95Method'); number(dossier.metrics.candidateP95Milliseconds, 'candidateP95Milliseconds'); integer(dossier.metrics.candidateCrashes, 'candidateCrashes');
  const sortedLatency = [...dossier.metrics.candidateLatencyMilliseconds].sort((a,b) => a-b);
  const p95 = sortedLatency[Math.ceil(0.95 * sortedLatency.length) - 1];
  if (dossier.metrics.candidateP95Milliseconds !== p95) throw new Error('candidate p95 arithmetic mismatch');
  const latencyObjective = dossier.serviceObjectives.find((item) => item.id === 'SO-1');
  const crashObjective = dossier.serviceObjectives.find((item) => item.id === 'SO-2');
  if (!latencyObjective || latencyObjective.observed !== p95 || !crashObjective || crashObjective.observed !== dossier.metrics.candidateCrashes) throw new Error('service observations do not match metrics');

  exactKeys(dossier.graderCalibration, ['modelGrader','authority','labeledItems','agreementNumerator','agreementDenominator','disagreementRule'], 'graderCalibration');
  text(dossier.graderCalibration.modelGrader, 'graderCalibration.modelGrader'); text(dossier.graderCalibration.authority, 'graderCalibration.authority'); text(dossier.graderCalibration.disagreementRule, 'graderCalibration.disagreementRule');
  array(dossier.graderCalibration.labeledItems, 'graderCalibration.labeledItems', true);
  let agreements = 0;
  const calibrationIds = new Set();
  for (const item of dossier.graderCalibration.labeledItems) {
    exactKeys(item, ['id','human','model','adjudication'], 'calibration item');
    text(item.id, 'calibration.id'); text(item.adjudication, 'calibration.adjudication');
    if (calibrationIds.has(item.id)) throw new Error(`duplicate calibration item ${item.id}`); calibrationIds.add(item.id);
    if (!RESULT.has(item.human) || !RESULT.has(item.model)) throw new RangeError('unknown calibration label');
    if (item.human === item.model) agreements += 1;
  }
  integer(dossier.graderCalibration.agreementNumerator, 'agreementNumerator'); integer(dossier.graderCalibration.agreementDenominator, 'agreementDenominator', 1);
  if (dossier.graderCalibration.agreementNumerator !== agreements || dossier.graderCalibration.agreementDenominator !== dossier.graderCalibration.labeledItems.length) throw new Error('calibration arithmetic mismatch');
  object(dossier.dataGovernance, 'dataGovernance'); object(dossier.disposition, 'disposition');

  return { dossier, passed: candidate.passed, total: candidate.total, aggregate: candidate.passed / candidate.total, denominatorMatches, evidenceComplete, criticalFailures, identityMatches, serviceObjectivesMet, recoveryMet: dossier.recoveryClaim.met };
}
