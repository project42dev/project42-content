import { readFile } from 'node:fs/promises';

function normalize(text) {
  return String(text).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

async function loadJson(path) {
  return JSON.parse(normalize(await readFile(path, 'utf8')));
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function refKey(ref) {
  return isObject(ref) ? `${ref.id}@${ref.revision}` : 'invalid@invalid';
}

function printable(value) {
  if (value === undefined) return 'UNKNOWN';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function buildRecords(dossier, errors = []) {
  const records = new Map();
  for (const record of dossier.evidence ?? []) {
    if (!isObject(record) || typeof record.id !== 'string' || typeof record.revision !== 'string') {
      errors.push('malformed evidence record');
      continue;
    }
    const key = refKey(record);
    if (records.has(key)) errors.push(`duplicate evidence ${key}`);
    records.set(key, record);
  }
  return records;
}

function requiredRefs(criterion, dossier) {
  const rule = criterion.rule;
  if (rule.type === 'all_claims_supported') {
    const keys = [];
    for (const claimId of rule.claimIds) {
      const claim = dossier.claims.find(item => item.id === claimId);
      for (const ref of claim?.evidenceRefs ?? []) keys.push(refKey(ref));
    }
    return [...new Set(keys)];
  }
  if (rule.type === 'authorized_action') {
    return [refKey(rule.authorizationRef), refKey(rule.traceRef)];
  }
  if (['observed_value', 'postcondition', 'binding_match'].includes(rule.type)) {
    return [refKey(rule.evidenceRef)];
  }
  return [];
}

function deriveCheck(check, records) {
  if (!isObject(check) || check.type !== 'observed_value' || !isObject(check.evidenceRef) || typeof check.field !== 'string' || !Object.hasOwn(check, 'equals')) {
    return {error: `check ${check?.id ?? 'unknown'} is malformed`};
  }
  const record = records.get(refKey(check.evidenceRef));
  if (!record) return {error: `check ${check.id} dangling evidence ${refKey(check.evidenceRef)}`};
  if (record.kind !== 'observed-state') return {error: `check ${check.id} requires observed-state evidence`};
  const observation = record.observation;
  const known = observation?.state === 'known';
  const fieldMatches = observation?.field === check.field;
  const value = fieldMatches ? observation?.value : undefined;
  const pass = known && fieldMatches && value === check.equals;
  const output = [
    `CHECK ${check.id}`,
    `revision ${record.revision}`,
    `observed ${check.field}=${printable(value)}`,
    `result ${pass ? 'PASS' : 'FAIL'}`
  ].join('\n') + '\n';
  return {record, output, pass};
}

function validateRule(criterion, dossier, records, errors) {
  const rule = criterion.rule;
  if (!isObject(rule) || typeof rule.type !== 'string') {
    errors.push(`criterion ${criterion.id} malformed rule`);
    return;
  }
  if (rule.type === 'all_claims_supported') {
    if (!Array.isArray(rule.claimIds) || rule.claimIds.length === 0) {
      errors.push(`criterion ${criterion.id} malformed claimIds`);
      return;
    }
    for (const claimId of rule.claimIds) {
      if (!(dossier.claims ?? []).some(claim => claim.id === claimId)) errors.push(`criterion ${criterion.id} unknown claim ${claimId}`);
    }
    return;
  }
  if (rule.type === 'authorized_action') {
    for (const [name, ref, kind] of [
      ['authorizationRef', rule.authorizationRef, 'authorization'],
      ['traceRef', rule.traceRef, 'tool-trace']
    ]) {
      if (!isObject(ref) || typeof ref.id !== 'string' || typeof ref.revision !== 'string') {
        errors.push(`criterion ${criterion.id} malformed ${name}`);
        continue;
      }
      const record = records.get(refKey(ref));
      if (!record) errors.push(`criterion ${criterion.id} dangling rule evidence ${refKey(ref)}`);
      else if (record.kind !== kind) errors.push(`criterion ${criterion.id} ${name} requires ${kind}`);
    }
    return;
  }
  if (['observed_value', 'postcondition', 'binding_match'].includes(rule.type)) {
    if (!isObject(rule.evidenceRef) || typeof rule.evidenceRef.id !== 'string' || typeof rule.evidenceRef.revision !== 'string') {
      errors.push(`criterion ${criterion.id} malformed evidenceRef`);
      return;
    }
    const record = records.get(refKey(rule.evidenceRef));
    if (!record) errors.push(`criterion ${criterion.id} dangling rule evidence ${refKey(rule.evidenceRef)}`);
    if (['observed_value', 'postcondition'].includes(rule.type)) {
      if (typeof rule.field !== 'string' || !Object.hasOwn(rule, 'equals')) errors.push(`criterion ${criterion.id} malformed observed comparison`);
      if (record && record.kind !== 'observed-state') errors.push(`criterion ${criterion.id} requires observed-state evidence`);
    } else if (!Array.isArray(rule.fields) || rule.fields.length === 0 || rule.fields.some(field => !['operation', 'target', 'tenant', 'identity'].includes(field))) {
      errors.push(`criterion ${criterion.id} malformed binding fields`);
    }
    return;
  }
  errors.push(`criterion ${criterion.id} unsupported rule type ${rule.type}`);
}

function expectedStatus(criterion, dossier, records) {
  const rule = criterion.rule;
  if (rule.type === 'all_claims_supported') {
    const claims = rule.claimIds.map(id => dossier.claims.find(claim => claim.id === id));
    if (claims.some(claim => !claim || claim.assessment === 'unknown')) return 'unknown';
    return claims.every(claim => claim.assessment === 'supported') ? 'verified' : 'failed';
  }
  if (['observed_value', 'postcondition'].includes(rule.type)) {
    const record = records.get(refKey(rule.evidenceRef));
    if (!record || record.observation?.state !== 'known') return 'unknown';
    return record.observation.field === rule.field && record.observation.value === rule.equals ? 'verified' : 'failed';
  }
  if (rule.type === 'authorized_action') {
    const authorization = records.get(refKey(rule.authorizationRef));
    const trace = records.get(refKey(rule.traceRef));
    if (!authorization || !trace) return 'unknown';
    const sameBinding = ['operation', 'target', 'tenant'].every(key => authorization.binding?.[key] === trace.binding?.[key]);
    const sameIdentity = typeof authorization.identity === 'string' && authorization.identity === trace.identity;
    const allowed = (authorization.allowedOperations ?? []).includes(trace.binding?.operation);
    return sameBinding && sameIdentity && allowed ? 'verified' : 'failed';
  }
  if (rule.type === 'binding_match') {
    const record = records.get(refKey(rule.evidenceRef));
    if (!record) return 'unknown';
    return rule.fields.every(field => {
      const actual = field === 'identity' ? record.identity : record.binding?.[field];
      const expected = field === 'identity' ? dossier.workOrder.identity : dossier.workOrder.binding?.[field];
      return actual === expected;
    }) ? 'verified' : 'failed';
  }
  return 'unknown';
}

function requiredDecision(statuses, criteria) {
  if (criteria.some((criterion, index) => criterion.consequential && statuses[index] === 'unknown')) return 'escalate';
  if (statuses.includes('failed')) return 'request_changes';
  if (statuses.includes('unknown')) return 'escalate';
  return 'accept';
}

function validateStructure(dossier, packet) {
  const errors = [];
  if (dossier.schemaVersion !== '1.0') errors.push('unsupported dossier schemaVersion');
  if (packet.schemaVersion !== '1.0') errors.push('unsupported packet schemaVersion');
  if (packet.dossier?.id !== dossier.id || packet.dossier?.revision !== dossier.revision) errors.push('packet dossier id or revision mismatch');
  if (!isObject(dossier.workOrder) || !isObject(dossier.workOrder.binding)) errors.push('malformed workOrder');
  if (!Array.isArray(dossier.claims)) errors.push('claims must be an array');
  if (!Array.isArray(dossier.evidence)) errors.push('evidence must be an array');

  const records = buildRecords(dossier, errors);
  const sourceKeys = new Set((dossier.sources ?? []).map(source => `${source.id}@${source.revision}`));

  for (const record of records.values()) {
    const key = refKey(record);
    if (record.binding) {
      for (const field of ['target', 'tenant']) {
        if (record.binding[field] !== dossier.workOrder.binding?.[field]) errors.push(`evidence ${key} ${field} binding mismatch`);
      }
    }
    if (record.kind === 'source-excerpt') {
      const sourceKey = `${record.provenance?.sourceId}@${record.revision}`;
      if (!sourceKeys.has(sourceKey)) errors.push(`evidence ${key} has no matching source ${sourceKey}`);
    }
  }

  for (const claim of dossier.claims ?? []) {
    if (!['supported', 'unsupported', 'unknown'].includes(claim.assessment)) errors.push(`claim ${claim.id} invalid assessment`);
    if (!Array.isArray(claim.evidenceRefs) || claim.evidenceRefs.length === 0) errors.push(`claim ${claim.id} requires evidence`);
    for (const ref of claim.evidenceRefs ?? []) {
      const record = records.get(refKey(ref));
      if (!record) errors.push(`claim ${claim.id} dangling evidence ${refKey(ref)}`);
      else if (record.kind !== 'source-excerpt') errors.push(`claim ${claim.id} evidence ${refKey(ref)} is not source-excerpt`);
    }
  }

  const criteria = dossier.workOrder?.criteria ?? [];
  if (!Array.isArray(criteria) || criteria.length === 0) errors.push('criteria must be a nonempty array');
  for (const criterion of criteria) validateRule(criterion, dossier, records, errors);

  const reviews = packet.claimReviews ?? [];
  const materialClaims = (dossier.claims ?? []).filter(claim => claim.material);
  const reviewIds = new Set();
  for (const review of reviews) {
    if (reviewIds.has(review.claimId)) errors.push(`duplicate claim review ${review.claimId}`);
    reviewIds.add(review.claimId);
    const claim = materialClaims.find(item => item.id === review.claimId);
    if (!claim) {
      errors.push(`unknown material claim review ${review.claimId}`);
      continue;
    }
    if (!review.observation || !review.inference) errors.push(`claim review ${review.claimId} requires observation and inference`);
    if (!Array.isArray(review.evidenceRefs) || review.evidenceRefs.length === 0) errors.push(`claim review ${review.claimId} requires evidenceRefs`);
    if (!Array.isArray(review.sourceRefs) || review.sourceRefs.length === 0) errors.push(`claim review ${review.claimId} requires sourceRefs`);
    const allowedEvidence = new Set(claim.evidenceRefs.map(refKey));
    for (const ref of review.evidenceRefs ?? []) {
      const key = refKey(ref);
      if (!records.has(key)) errors.push(`claim review ${review.claimId} dangling evidence ${key}`);
      else if (!allowedEvidence.has(key)) errors.push(`claim review ${review.claimId} unrelated evidence ${key}`);
    }
    for (const required of allowedEvidence) {
      if (!(review.evidenceRefs ?? []).some(ref => refKey(ref) === required)) errors.push(`claim review ${review.claimId} missing evidence ${required}`);
    }
    const expectedSources = new Set((claim.evidenceRefs ?? []).map(ref => {
      const record = records.get(refKey(ref));
      return `${record?.provenance?.sourceId}@${record?.revision}`;
    }));
    for (const sourceRef of review.sourceRefs ?? []) {
      const key = refKey(sourceRef);
      if (!sourceKeys.has(key)) errors.push(`claim review ${review.claimId} dangling source ${key}`);
      else if (!expectedSources.has(key)) errors.push(`claim review ${review.claimId} unrelated source ${key}`);
    }
    for (const required of expectedSources) {
      if (!(review.sourceRefs ?? []).some(ref => refKey(ref) === required)) errors.push(`claim review ${review.claimId} missing source ${required}`);
    }
  }
  for (const claim of materialClaims) {
    if (!reviewIds.has(claim.id)) errors.push(`missing material claim review ${claim.id}`);
  }

  const rows = packet.criteria ?? [];
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.criterionId)) errors.push(`duplicate criterion row ${row.criterionId}`);
    seen.add(row.criterionId);
    const criterion = criteria.find(item => item.id === row.criterionId);
    if (!criterion) {
      errors.push(`unknown criterion ${row.criterionId}`);
      continue;
    }
    if (!['verified', 'failed', 'unknown'].includes(row.status)) errors.push(`criterion ${row.criterionId} invalid status`);
    if (!row.observation || !row.inference || !row.nextAction) errors.push(`criterion ${row.criterionId} requires observation, inference, and nextAction`);
    if (!Array.isArray(row.evidenceRefs) || row.evidenceRefs.length === 0) errors.push(`criterion ${row.criterionId} requires relevant evidenceRefs`);
    const required = new Set(requiredRefs(criterion, dossier));
    for (const ref of row.evidenceRefs ?? []) {
      const key = refKey(ref);
      if (!records.has(key)) errors.push(`criterion ${row.criterionId} dangling evidence ${key}`);
      else if (!required.has(key)) errors.push(`criterion ${row.criterionId} unrelated evidence ${key}`);
    }
    for (const key of required) {
      if (!(row.evidenceRefs ?? []).some(ref => refKey(ref) === key)) errors.push(`criterion ${row.criterionId} missing evidence ${key}`);
    }
  }
  for (const criterion of criteria) {
    if (!seen.has(criterion.id)) errors.push(`missing criterion row ${criterion.id}`);
  }

  const checks = dossier.checks ?? [];
  for (const check of checks) {
    const derived = deriveCheck(check, records);
    if (derived.error) {
      errors.push(derived.error);
      continue;
    }
    if (check.revision !== derived.record.revision) errors.push(`check ${check.id} revision does not match evidence`);
    if (normalize(check.exactOutput ?? '').trimEnd() !== normalize(derived.output).trimEnd()) errors.push(`check ${check.id} documented output stale`);
  }

  if (!Array.isArray(packet.reproducedChecks) || packet.reproducedChecks.length === 0) errors.push('at least one reproduced check is required');
  for (const reproduction of packet.reproducedChecks ?? []) {
    const check = checks.find(item => item.id === reproduction.checkId);
    if (!check) {
      errors.push(`unknown reproduced check ${reproduction.checkId}`);
      continue;
    }
    const derived = deriveCheck(check, records);
    if (derived.error) {
      errors.push(derived.error);
      continue;
    }
    if (reproduction.revision !== derived.record.revision) errors.push(`check ${check.id} revision mismatch`);
    if (normalize(reproduction.exactOutput ?? '').trimEnd() !== normalize(derived.output).trimEnd()) errors.push(`check ${check.id} output mismatch`);
  }

  if (!['accept', 'request_changes', 'escalate'].includes(packet.decision)) errors.push('invalid decision');
  if (!packet.decisionRationale) errors.push('decisionRationale is required');
  return {errors: [...new Set(errors)].sort(), records};
}

function inspect(dossier, checkId) {
  const check = (dossier.checks ?? []).find(item => item.id === checkId);
  if (!check) {
    console.error(`Unknown check: ${checkId}`);
    process.exitCode = 1;
    return;
  }
  const derived = deriveCheck(check, buildRecords(dossier));
  if (derived.error) {
    console.error(`ERROR ${derived.error}`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(derived.output);
  if (!derived.pass) process.exitCode = 1;
}

function validate(dossier, packet) {
  const structural = validateStructure(dossier, packet);
  if (structural.errors.length) {
    console.log('STRUCTURAL FAIL');
    for (const error of structural.errors) console.log(`- ${error}`);
    console.log('RESULT FAIL');
    process.exitCode = 1;
    return;
  }

  console.log('STRUCTURAL PASS');
  const policyErrors = [];
  const statuses = [];
  for (const criterion of dossier.workOrder.criteria) {
    const expected = expectedStatus(criterion, dossier, structural.records);
    statuses.push(expected);
    const row = packet.criteria.find(item => item.criterionId === criterion.id);
    if (row.status !== expected) policyErrors.push(`criterion ${criterion.id} packet=${row.status} evidence=${expected}`);
  }
  const expectedDecision = requiredDecision(statuses, dossier.workOrder.criteria);
  if (packet.decision !== expectedDecision) policyErrors.push(`decision packet=${packet.decision} evidence=${expectedDecision}`);

  if (policyErrors.length) {
    console.log('POLICY FAIL');
    for (const error of policyErrors) console.log(`- ${error}`);
    console.log('RESULT FAIL');
    process.exitCode = 1;
    return;
  }

  const counts = Object.fromEntries(['verified', 'failed', 'unknown'].map(status => [status, statuses.filter(value => value === status).length]));
  console.log('POLICY PASS');
  console.log(`DECISION ${packet.decision}`);
  console.log(`CRITERIA verified=${counts.verified} failed=${counts.failed} unknown=${counts.unknown}`);
  console.log('RESULT PASS');
}

const [command, dossierPath, packetOrCheck] = process.argv.slice(2);
if (!command || !dossierPath || !packetOrCheck || !['validate', 'inspect'].includes(command)) {
  console.error('Usage: node checker.js validate <dossier.json> <packet.json>');
  console.error('   or: node checker.js inspect <dossier.json> <check-id>');
  process.exit(2);
}

try {
  const dossier = await loadJson(dossierPath);
  if (command === 'inspect') inspect(dossier, packetOrCheck);
  else validate(dossier, await loadJson(packetOrCheck));
} catch (error) {
  console.error(`ERROR ${error.message}`);
  process.exitCode = 2;
}
