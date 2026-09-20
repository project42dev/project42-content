import assert from 'node:assert/strict';

export const ROLES = new Set([
  'governingPolicy', 'userGoal', 'trustedState', 'evidence', 'untrustedData',
  'priorDecision', 'toolContract', 'outputRequirement', 'missingInformation'
]);

const REQUIRED_SLOTS = [
  'governingPolicy', 'userGoal', 'trustedState', 'toolContract',
  'outputRequirement', 'missingInformation'
];
const RESERVE_KEYS = ['instructions', 'request', 'tools', 'output', 'results'];

function fail(message) {
  throw new Error(message);
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function validate(input) {
  if (!input || typeof input !== 'object') fail('input must be an object');
  if (!input.contract || input.contract.trustedConfiguration !== true) {
    fail('contract must be trusted configuration');
  }
  if (!Array.isArray(input.contract.authoritativeSourceIds)) {
    fail('authoritativeSourceIds must be an array');
  }
  for (const slot of REQUIRED_SLOTS) {
    if (!input.slots?.[slot]) fail(`missing mandatory slot: ${slot}`);
  }
  if (!isNonNegativeInteger(input.budget?.total)) fail('malformed budget total');
  for (const key of RESERVE_KEYS) {
    if (!isNonNegativeInteger(input.budget?.reserve?.[key])) {
      fail(`malformed budget reserve: ${key}`);
    }
  }

  const records = input.records ?? [];
  if (!Array.isArray(records)) fail('records must be an array');
  const ids = new Set();
  const sourceRevisions = new Map();
  for (const record of records) {
    if (!record || typeof record !== 'object') fail('record must be an object');
    if (!record.id || typeof record.id !== 'string') fail('record identity is incomplete');
    if (ids.has(record.id)) fail(`duplicate record id: ${record.id}`);
    ids.add(record.id);
    if (!record.sourceId || typeof record.sourceId !== 'string' ||
        !record.revision || typeof record.revision !== 'string' ||
        typeof record.digest !== 'string' || record.digest.length === 0) {
      fail(`record identity is incomplete: ${record.id}`);
    }
    if (!ROLES.has(record.role)) fail(`unknown role: ${record.role}`);
    if (!isNonNegativeInteger(record.sizeUnits)) {
      fail(`malformed sizeUnits: ${record.id}`);
    }
    if ((record.role === 'evidence' || record.origin === 'retrieved' || record.origin === 'tool') &&
        record.trust === 'trusted') {
      fail(`forged trust label: ${record.id}`);
    }
    if (record.role === 'toolContract' && record.trustedConfiguration !== true) {
      fail(`untrusted tool contract: ${record.id}`);
    }
    const key = `${record.sourceId}@${record.revision}`;
    if (sourceRevisions.has(key)) {
      fail(`duplicate source revision clash: ${key}`);
    }
    sourceRevisions.set(key, record.digest);
  }

  const byId = new Map(records.map(record => [record.id, record]));
  for (const record of records) {
    if (!record.summary) continue;
    if (!Array.isArray(record.sourceRefs) || record.sourceRefs.length === 0 ||
        !record.transformation || !record.verifiedAt) {
      fail(`summary missing provenance linkage: ${record.id}`);
    }
    for (const ref of record.sourceRefs) {
      if (typeof ref !== 'string' || !byId.has(ref)) {
        fail(`unresolved source reference: ${record.id}->${ref}`);
      }
    }
  }

  const callIds = new Set((input.toolCalls ?? []).map(call => call.id));
  for (const result of input.toolResults ?? []) {
    if (!result.callId || !callIds.has(result.callId)) {
      fail(`unlinked tool result: ${result.id}`);
    }
  }
}

function compareRecords(a, b, authoritative) {
  const score = record =>
    (record.relevant ? 100 : 0) +
    (authoritative.has(record.sourceId) ? 40 : 0) +
    (record.disconfirming ? 20 : 0) - record.ageDays;
  return score(b) - score(a) || a.id.localeCompare(b.id);
}

export function buildContext(input) {
  validate(input);
  const reserved = RESERVE_KEYS.reduce((sum, key) => sum + input.budget.reserve[key], 0);
  const capacity = input.budget.total - reserved;
  if (capacity < 0) fail('mandatory reservations exceed total budget');

  const authoritative = new Set(input.contract.authoritativeSourceIds);
  const maxAge = input.contract.maxAgeDaysByClaim ?? {};
  const exactClaims = new Set(input.contract.exactClaims ?? []);
  const records = input.records ?? [];
  const byId = new Map(records.map(record => [record.id, record]));
  const omissions = [];
  const selected = [];
  const untrusted = [];
  const missing = [];
  const conflicts = [];
  const refreshes = [];
  const rehydrated = [];
  const usable = [];
  const excluded = new Set();
  let used = 0;

  for (const record of records) {
    const isUntrusted = record.role === 'untrustedData' ||
      record.origin === 'retrieved' || record.origin === 'tool';
    if (isUntrusted) continue;
    if (!record.relevant) {
      omissions.push({ id: record.id, reason: 'irrelevant' });
      excluded.add(record.id);
      continue;
    }
    if (record.sizeUnits > capacity) {
      omissions.push({ id: record.id, reason: 'oversize' });
      excluded.add(record.id);
      continue;
    }
    const staleLimit = maxAge[record.claimId];
    if (Number.isInteger(staleLimit)) {
      if (!Number.isInteger(record.ageDays) || record.ageDays < 0) {
        omissions.push({ id: record.id, reason: 'invalid_freshness' });
        missing.push(`fresh:${record.claimId}`);
        excluded.add(record.id);
        continue;
      }
      if (record.ageDays > staleLimit) {
        const replacement = records.find(candidate =>
          candidate.replaces === record.id &&
          candidate.relevant === true &&
          authoritative.has(candidate.sourceId) &&
          candidate.claimId === record.claimId &&
          Number.isInteger(candidate.ageDays) &&
          candidate.ageDays >= 0 && candidate.ageDays <= staleLimit
        );
        omissions.push({
          id: record.id,
          reason: replacement ? `stale_replaced_by:${replacement.id}` : 'stale_refresh_required'
        });
        refreshes.push(replacement ? `${record.id}->${replacement.id}` : `${record.id}->MISSING`);
        if (!replacement) missing.push(`fresh:${record.claimId}`);
        excluded.add(record.id);
        continue;
      }
    }
    usable.push(record);
  }

  usable.sort((a, b) => compareRecords(a, b, authoritative));
  const requiredClaims = input.contract.requiredClaims ?? [];
  const mandatory = [];

  for (const claimId of requiredClaims) {
    let candidates = usable.filter(record =>
      record.claimId === claimId && authoritative.has(record.sourceId)
    );
    if (exactClaims.has(claimId)) {
      const expanded = [];
      for (const candidate of candidates) {
        if (!candidate.summary) {
          if (candidate.exactAvailable) expanded.push(candidate);
          continue;
        }
        const exact = candidate.sourceRefs
          .map(ref => byId.get(ref))
          .find(record =>
            record && record.exactAvailable === true &&
            record.relevant === true &&
            record.claimId === claimId &&
            authoritative.has(record.sourceId) &&
            Number.isInteger(record.ageDays) && record.ageDays >= 0 &&
            (!Number.isInteger(maxAge[claimId]) || record.ageDays <= maxAge[claimId])
          );
        if (exact) {
          expanded.push(exact);
          rehydrated.push(`${candidate.id}->${exact.id}`);
          omissions.push({ id: candidate.id, reason: `superseded_by:${exact.id}` });
          excluded.add(candidate.id);
        } else {
          missing.push(`exact:${claimId}`);
          omissions.push({ id: candidate.id, reason: 'exact_source_required' });
          excluded.add(candidate.id);
        }
      }
      candidates = expanded;
    }
    const unique = [...new Map(candidates.map(record => [record.id, record])).values()];
    if (unique.length === 0) missing.push(`claim:${claimId}`);
    for (const record of unique) {
      if (!mandatory.some(item => item.id === record.id)) mandatory.push(record);
    }
    const values = new Set(unique.map(record => JSON.stringify(record.value)));
    if (values.size > 1) conflicts.push(claimId);
  }

  mandatory.sort((a, b) => compareRecords(a, b, authoritative));
  for (const record of mandatory) {
    if (used + record.sizeUnits > capacity) {
      omissions.push({ id: record.id, reason: 'mandatory_evidence_does_not_fit' });
      missing.push(`budget:${record.claimId}`);
    } else {
      selected.push(record.id);
      used += record.sizeUnits;
    }
  }

  for (const record of usable) {
    if (excluded.has(record.id) || selected.includes(record.id) ||
        mandatory.some(item => item.id === record.id)) continue;
    if (used + record.sizeUnits <= capacity) {
      selected.push(record.id);
      used += record.sizeUnits;
    } else {
      omissions.push({ id: record.id, reason: 'lower_ranked_budget_exclusion' });
    }
  }

  for (const record of records) {
    const isUntrusted = record.role === 'untrustedData' ||
      record.origin === 'retrieved' || record.origin === 'tool';
    if (!isUntrusted) continue;
    if (!record.relevant) {
      omissions.push({ id: record.id, reason: 'irrelevant' });
      continue;
    }
    if (used + record.sizeUnits <= capacity) {
      untrusted.push(record.id);
      used += record.sizeUnits;
    } else {
      omissions.push({ id: record.id, reason: 'untrusted_data_does_not_fit' });
    }
  }

  return {
    caseId: input.caseId,
    status: missing.length === 0 && conflicts.length === 0 ? 'READY' : 'ESCALATE',
    selected,
    untrusted,
    omissions,
    conflicts: [...new Set(conflicts)],
    missing: [...new Set(missing)],
    refreshes,
    rehydrated,
    reservations: { total: input.budget.total, reserved, evidenceCapacity: capacity, used }
  };
}

function sameMutation(a, b) {
  return a?.path === b?.path && Object.is(a?.from, b?.from) && Object.is(a?.to, b?.to);
}

export function authorizeAndApply({ contract, proposal, state, authority, decision, apply }) {
  if (!contract || contract.trustedConfiguration !== true) fail('tool contract is not trusted configuration');
  if (!Array.isArray(contract.allowedAuthoritySourceIds) || !Array.isArray(contract.allowedMutationPaths)) {
    fail('tool contract is malformed');
  }
  if (decision?.status !== 'READY') fail('context decision is not ready');
  if (!proposal || proposal.toolId !== contract.id) fail('tool id mismatch');
  if (!authority || !contract.allowedAuthoritySourceIds.includes(authority.sourceId)) {
    fail('authority source is not allowed');
  }
  if (proposal.authorityRevision !== authority.revision) fail('authority revision mismatch');
  if (proposal.expectedRevision !== state?.revision) fail('state revision mismatch');
  if (!proposal.mutation || !contract.allowedMutationPaths.includes(proposal.mutation.path)) {
    fail('mutation path is not allowed');
  }
  const current = state.data[proposal.mutation.path];
  const intended = { path: proposal.mutation.path, from: current, to: proposal.mutation.to };
  if (!sameMutation(proposal.mutation, intended)) fail('mutation does not exactly match current state');
  assert.equal(typeof apply, 'function', 'apply callback required');
  const next = { revision: `${state.revision}+1`, data: { ...state.data, [proposal.mutation.path]: proposal.mutation.to } };
  apply(next);
  return next;
}
