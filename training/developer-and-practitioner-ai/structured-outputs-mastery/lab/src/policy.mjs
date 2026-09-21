export class GateError extends Error {
  constructor(reason, path = '') {
    super(reason);
    this.reason = reason;
    this.path = path;
  }
}

const reject = (reason, path = '') => ({ ok: false, reason, ...(path ? { path } : {}) });
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonemptyString = (value) => typeof value === 'string' && value.length > 0;
const positiveSafeInteger = (value) => Number.isSafeInteger(value) && value > 0;

function exactKeys(value, expected, path, reason) {
  if (!isObject(value)) throw new GateError(reason, path);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    throw new GateError(reason, path);
  }
}

function validateOutput(value) {
  exactKeys(value, ['schema_version', 'request_id', 'action', 'subject_id', 'amount', 'currency', 'evidence_ids'], '$', 'unknown_or_missing_field');
  if (value.schema_version !== '1' || value.action !== 'refund') throw new GateError('shape_invalid', '$');
  for (const key of ['request_id', 'subject_id', 'currency']) {
    if (!nonemptyString(value[key])) throw new GateError('shape_invalid', `$.${key}`);
  }
  if (!positiveSafeInteger(value.amount)) throw new GateError('invariant_failed', '$.amount');
  if (!Array.isArray(value.evidence_ids) || value.evidence_ids.length === 0 || value.evidence_ids.some((id) => !nonemptyString(id))) {
    throw new GateError('shape_invalid', '$.evidence_ids');
  }
  if (new Set(value.evidence_ids).size !== value.evidence_ids.length) throw new GateError('evidence_invalid', '$.evidence_ids');
  return value;
}

function validateTrustedContext(bundle) {
  exactKeys(bundle.request, ['request_id', 'subject_id'], '$bundle.request', 'trusted_context_invalid');
  if (!nonemptyString(bundle.request.request_id) || !nonemptyString(bundle.request.subject_id)) {
    throw new GateError('trusted_context_invalid', '$bundle.request');
  }

  if (!Array.isArray(bundle.evidence) || bundle.evidence.length === 0) {
    throw new GateError('trusted_context_invalid', '$bundle.evidence');
  }
  const evidenceById = new Map();
  for (let index = 0; index < bundle.evidence.length; index += 1) {
    const item = bundle.evidence[index];
    const path = `$bundle.evidence[${index}]`;
    exactKeys(item, ['id', 'subject_id', 'currency', 'refundable_amount'], path, 'trusted_context_invalid');
    if (!nonemptyString(item.id) || !nonemptyString(item.subject_id) || !nonemptyString(item.currency) || !positiveSafeInteger(item.refundable_amount)) {
      throw new GateError('trusted_context_invalid', path);
    }
    if (evidenceById.has(item.id)) throw new GateError('evidence_registry_duplicate', `${path}.id`);
    evidenceById.set(item.id, item);
  }

  exactKeys(bundle.authorization, ['subject_id', 'actions', 'max_refund'], '$bundle.authorization', 'trusted_context_invalid');
  if (!nonemptyString(bundle.authorization.subject_id) ||
      !Array.isArray(bundle.authorization.actions) ||
      bundle.authorization.actions.length === 0 ||
      bundle.authorization.actions.some((action) => !nonemptyString(action)) ||
      new Set(bundle.authorization.actions).size !== bundle.authorization.actions.length ||
      !positiveSafeInteger(bundle.authorization.max_refund)) {
    throw new GateError('trusted_context_invalid', '$bundle.authorization');
  }
  return evidenceById;
}

export function evaluateWithParser(bundle, parseUniqueJson) {
  try {
    exactKeys(bundle, ['response', 'request', 'evidence', 'authorization'], '$bundle', 'trusted_context_invalid');
    exactKeys(bundle.response, ['state', 'refusal', 'text'], '$bundle.response', 'trusted_context_invalid');
    if (!nonemptyString(bundle.response.state) || !(bundle.response.refusal === null || typeof bundle.response.refusal === 'string')) {
      throw new GateError('trusted_context_invalid', '$bundle.response');
    }
    if (bundle.response.refusal !== null) return reject('refused');
    if (bundle.response.state === 'incomplete') return reject('incomplete');
    if (bundle.response.state !== 'completed') return reject('bad_response_state');
    if (!nonemptyString(bundle.response.text) || !bundle.response.text.trim()) return reject('missing_text');

    const output = validateOutput(parseUniqueJson(bundle.response.text));
    const evidenceById = validateTrustedContext(bundle);

    if (output.request_id !== bundle.request.request_id || output.subject_id !== bundle.request.subject_id) {
      return reject('request_binding_failed');
    }

    const cited = [];
    for (const id of output.evidence_ids) {
      const record = evidenceById.get(id);
      if (!record) return reject('evidence_missing');
      if (record.subject_id !== output.subject_id || record.currency !== output.currency) {
        return reject('evidence_binding_failed');
      }
      cited.push(record);
    }

    if (cited.length !== 1) return reject('evidence_aggregation_unsupported');
    if (output.amount > cited[0].refundable_amount) return reject('invariant_failed');

    if (bundle.authorization.subject_id !== output.subject_id ||
        !bundle.authorization.actions.includes(output.action) ||
        output.amount > bundle.authorization.max_refund) {
      return reject('unauthorized');
    }

    return {
      ok: true,
      action: output.action,
      requestId: output.request_id,
      subjectId: output.subject_id,
      amount: output.amount,
      currency: output.currency,
      evidenceIds: output.evidence_ids
    };
  } catch (error) {
    if (error instanceof GateError) return reject(error.reason, error.path);
    return reject('invalid_json');
  }
}
