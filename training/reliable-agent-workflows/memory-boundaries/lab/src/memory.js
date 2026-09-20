const REQUIRED_PROPOSAL = ["value", "source", "verifiedAt", "sensitivity", "expiresAt"];
const REQUIRED_CONTEXT = ["tenantId", "subjectId", "purpose"];
const LAYERS = ["store", "index", "summary", "cache", "backup"];

export class BoundaryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "BoundaryError";
    this.code = code;
  }
}

function need(condition, code, message) {
  if (!condition) throw new BoundaryError(code, message);
}

function object(value, label) {
  need(value && typeof value === "object" && !Array.isArray(value), "INVALID_INPUT", `${label} must be an object`);
}

function text(value, label) {
  need(typeof value === "string" && value.length > 0, "INVALID_INPUT", `${label} must be a non-empty string`);
}

function instant(value, label) {
  text(value, label);
  const time = Date.parse(value);
  need(Number.isFinite(time), "INVALID_INPUT", `${label} must be an ISO-compatible timestamp`);
  return time;
}

function clone(value) {
  return structuredClone(value);
}

function equal(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function heuristicInjection(value) {
  text(value, "proposal.value");
  return /ignore\s+(all\s+)?(previous|prior)\s+instructions|system\s+prompt|exfiltrat|export\s+every\s+memory/i.test(value);
}

export function propose(input) {
  object(input, "proposal");
  for (const field of REQUIRED_PROPOSAL) need(Object.hasOwn(input, field), "INVALID_INPUT", `proposal.${field} is required`);
  for (const field of REQUIRED_PROPOSAL) text(input[field], `proposal.${field}`);
  instant(input.verifiedAt, "proposal.verifiedAt");
  instant(input.expiresAt, "proposal.expiresAt");
  return Object.freeze(clone(input));
}

export class MemoryService {
  constructor({ policy, now = "2026-09-20T12:00:00.000Z" }) {
    object(policy, "policy");
    object(policy.allowedPurposes, "policy.allowedPurposes");
    object(policy.consents, "policy.consents");
    need(Array.isArray(policy.eligibleSources), "INVALID_INPUT", "eligibleSources must be an array");
    object(policy.allowedSensitivity, "policy.allowedSensitivity");
    need(Number.isInteger(policy.backupRetentionMs) && policy.backupRetentionMs >= 0, "INVALID_INPUT", "backupRetentionMs must be a non-negative integer");
    this.policy = clone(policy);
    this.nowMs = instant(now, "now");
    this.sequence = 0;
    this.store = new Map();
    this.index = new Map();
    this.summary = new Map();
    this.cache = new Map();
    this.backup = new Map();
    this.tombstones = new Map();
    this.deletions = new Map();
    this.requests = new Map();
  }

  setNow(now) {
    this.nowMs = instant(now, "now");
  }

  setConsent(ctx, consent) {
    this.#context(ctx);
    need(typeof consent === "boolean", "INVALID_INPUT", "consent must be boolean");
    this.policy.consents[this.#key(ctx)] = consent;
  }

  removePurpose(tenantId, purpose) {
    text(tenantId, "tenantId");
    text(purpose, "purpose");
    const list = this.policy.allowedPurposes[tenantId];
    need(Array.isArray(list), "DENIED", "tenant has no purpose policy");
    this.policy.allowedPurposes[tenantId] = list.filter(item => item !== purpose);
  }

  propose(input) {
    return propose(input);
  }

  write(rawProposal, ctx, requestId) {
    const proposal = propose(rawProposal);
    this.#authorize(ctx, true);
    this.#requestId(requestId);
    this.#proposalPolicy(proposal, ctx);
    const boundary = this.#boundary(ctx);
    const prior = this.requests.get(requestId);
    if (prior) {
      need(prior.operation === "write" && equal(prior.boundary, boundary) && equal(prior.payload, proposal), "REQUEST_CONFLICT", "requestId does not match the original write");
      return clone(prior.result);
    }
    const id = `mem_${String(++this.sequence).padStart(3, "0")}`;
    const record = this.#record(id, proposal, ctx, null);
    this.#copyEverywhere(record);
    const result = { id, createdAt: record.createdAt };
    this.requests.set(requestId, { operation: "write", boundary, payload: clone(proposal), result: clone(result) });
    return result;
  }

  read(ctx, { layer = "store" } = {}) {
    this.#authorize(ctx, true);
    need(LAYERS.includes(layer), "INVALID_INPUT", "unknown layer");
    const selected = this[layer];
    const results = [];
    for (const candidate of selected.values()) {
      if (candidate.tenantId !== ctx.tenantId || candidate.subjectId !== ctx.subjectId || candidate.purpose !== ctx.purpose) continue;
      const canonical = this.store.get(candidate.id);
      if (!canonical || this.deletions.has(candidate.id)) continue;
      if (canonical.deletedAt !== null || canonical.supersededBy) continue;
      if (!this.#canonicalReadable(canonical, ctx)) continue;
      results.push({
        id: canonical.id,
        value: canonical.value,
        kind: "evidence",
        provenance: {
          source: canonical.source,
          createdAt: canonical.createdAt,
          verifiedAt: canonical.verifiedAt
        }
      });
    }
    return results.sort((a, b) => a.id.localeCompare(b.id));
  }

  correct(oldId, rawProposal, ctx, requestId) {
    text(oldId, "oldId");
    const proposal = propose(rawProposal);
    this.#authorize(ctx, true);
    this.#requestId(requestId);
    this.#proposalPolicy(proposal, ctx);
    const boundary = this.#boundary(ctx);
    const prior = this.requests.get(requestId);
    if (prior) {
      need(prior.operation === "correct" && prior.oldId === oldId && equal(prior.boundary, boundary) && equal(prior.payload, proposal), "REQUEST_CONFLICT", "requestId does not match the original correction");
      return clone(prior.result);
    }
    const old = this.store.get(oldId);
    need(old, "NOT_FOUND", "record not found in authoritative store");
    this.#sameBoundary(old, ctx);
    need(!old.supersededBy && !this.deletions.has(oldId), "DENIED", "record is not current");
    const id = `mem_${String(++this.sequence).padStart(3, "0")}`;
    old.supersededBy = id;
    for (const layer of [this.index, this.summary, this.cache, this.backup]) {
      const copy = layer.get(oldId);
      if (copy) copy.supersededBy = id;
    }
    const record = this.#record(id, proposal, ctx, oldId);
    this.#copyEverywhere(record);
    const result = { id, supersedes: oldId };
    this.requests.set(requestId, { operation: "correct", oldId, boundary, payload: clone(proposal), result: clone(result) });
    return result;
  }

  expire(id, ctx, requestId) {
    text(id, "id");
    this.#authorize(ctx, true);
    this.#requestId(requestId);
    const boundary = this.#boundary(ctx);
    const prior = this.requests.get(requestId);
    if (prior) {
      need(prior.operation === "expire" && prior.id === id && equal(prior.boundary, boundary), "REQUEST_CONFLICT", "requestId does not match the original expiration");
      return clone(prior.result);
    }
    const record = this.store.get(id);
    need(record, "NOT_FOUND", "record not found in authoritative store");
    this.#sameBoundary(record, ctx);
    need(Number.isFinite(Date.parse(record.expiresAt)) && Date.parse(record.expiresAt) <= this.nowMs, "DENIED", "record is not yet expired");
    return this.#removeActive(id, record, requestId, "expire", boundary);
  }

  requestDeletion(id, ctx, requestId) {
    text(id, "id");
    this.#authorize(ctx, false);
    this.#requestId(requestId);
    const boundary = this.#boundary(ctx);
    const prior = this.requests.get(requestId);
    if (prior) {
      need(prior.operation === "delete" && prior.id === id && equal(prior.boundary, boundary), "REQUEST_CONFLICT", "requestId does not match the original deletion");
      return clone(prior.result);
    }
    const known = this.store.get(id) ?? this.tombstones.get(id);
    need(known, "NOT_FOUND", "record is unknown");
    this.#sameBoundary(known, ctx);
    if (!this.deletions.has(id)) {
      const record = this.store.get(id);
      need(record, "NOT_FOUND", "active record is unavailable");
      this.#removeActive(id, record, null, "delete", boundary);
    }
    const result = this.#receipt(id);
    this.requests.set(requestId, { operation: "delete", id, boundary, result: clone(result) });
    return result;
  }

  reconcileDeletion(id, ctx, _claims = {}) {
    text(id, "id");
    this.#authorize(ctx, false);
    const tombstone = this.tombstones.get(id);
    need(tombstone, "NOT_FOUND", "deletion request not found");
    this.#sameBoundary(tombstone, ctx);
    const deletion = this.deletions.get(id);
    need(deletion, "NOT_FOUND", "deletion request not found");
    if (this.nowMs >= Date.parse(deletion.backupPurgeAt)) this.backup.delete(id);
    return this.#receipt(id);
  }

  #record(id, proposal, ctx, supersedes) {
    return {
      id,
      tenantId: ctx.tenantId,
      subjectId: ctx.subjectId,
      purpose: ctx.purpose,
      value: proposal.value,
      source: proposal.source,
      createdAt: new Date(this.nowMs).toISOString(),
      verifiedAt: new Date(Date.parse(proposal.verifiedAt)).toISOString(),
      sensitivity: proposal.sensitivity,
      expiresAt: new Date(Date.parse(proposal.expiresAt)).toISOString(),
      supersedes,
      deletedAt: null
    };
  }

  #removeActive(id, record, requestId, operation, boundary) {
    const deletedAt = new Date(this.nowMs).toISOString();
    this.tombstones.set(id, {
      id,
      tenantId: record.tenantId,
      subjectId: record.subjectId,
      purpose: record.purpose,
      source: record.source,
      createdAt: record.createdAt,
      verifiedAt: record.verifiedAt,
      deletedAt
    });
    this.deletions.set(id, {
      id,
      requestedAt: deletedAt,
      backupPurgeAt: new Date(this.nowMs + this.policy.backupRetentionMs).toISOString()
    });
    this.store.delete(id);
    this.index.delete(id);
    this.summary.delete(id);
    this.cache.delete(id);
    const result = {
      id,
      ...(operation === "expire" ? { expiredAt: deletedAt } : {}),
      ...(operation === "expire" ? { activeRemoved: true, backupPending: this.backup.has(id) } : this.#receipt(id))
    };
    if (requestId) this.requests.set(requestId, { operation, id, boundary, result: clone(result) });
    return result;
  }

  #receipt(id) {
    const deletion = this.deletions.get(id);
    need(deletion, "NOT_FOUND", "deletion request not found");
    const copyStates = Object.fromEntries(LAYERS.map(layer => [layer, this[layer].has(id)]));
    const activeRemoved = !copyStates.store && !copyStates.index && !copyStates.summary && !copyStates.cache;
    const backupPending = copyStates.backup;
    const tombstone = this.tombstones.get(id);
    return {
      id,
      status: backupPending ? "pending-backup" : "completed",
      activeRemoved,
      backupPending,
      copyStates,
      requestedAt: deletion.requestedAt,
      backupPurgeAt: deletion.backupPurgeAt,
      provenance: {
        source: tombstone.source,
        createdAt: tombstone.createdAt,
        verifiedAt: tombstone.verifiedAt
      }
    };
  }

  #canonicalReadable(record, ctx) {
    if (record.tenantId !== ctx.tenantId || record.subjectId !== ctx.subjectId || record.purpose !== ctx.purpose) return false;
    if (typeof record.value !== "string" || typeof record.source !== "string" || typeof record.sensitivity !== "string") return false;
    const verified = Date.parse(record.verifiedAt);
    const expires = Date.parse(record.expiresAt);
    if (!Number.isFinite(verified) || !Number.isFinite(expires)) return false;
    if (verified > this.nowMs || expires <= this.nowMs) return false;
    if (!this.policy.eligibleSources.includes(record.source)) return false;
    const allowed = this.policy.allowedSensitivity[record.purpose];
    return Array.isArray(allowed) && allowed.includes(record.sensitivity);
  }

  #copyEverywhere(record) {
    for (const layer of LAYERS) this[layer].set(record.id, clone(record));
  }

  #context(ctx) {
    object(ctx, "context");
    for (const field of REQUIRED_CONTEXT) {
      text(ctx[field], `context.${field}`);
      need(!ctx[field].includes("|"), "INVALID_INPUT", `context.${field} cannot contain |`);
    }
  }

  #key(ctx) {
    return `${ctx.tenantId}|${ctx.subjectId}|${ctx.purpose}`;
  }

  #boundary(ctx) {
    return [ctx.tenantId, ctx.subjectId, ctx.purpose];
  }

  #authorize(ctx, requireConsent) {
    this.#context(ctx);
    const purposes = this.policy.allowedPurposes[ctx.tenantId];
    need(Array.isArray(purposes) && purposes.includes(ctx.purpose), "DENIED", "purpose is not allowed for tenant");
    if (requireConsent) {
      const key = this.#key(ctx);
      need(Object.hasOwn(this.policy.consents, key) && this.policy.consents[key] === true, "DENIED", "consent is not current");
    }
  }

  #proposalPolicy(proposal, ctx) {
    need(this.policy.eligibleSources.includes(proposal.source), "DENIED", "source is not eligible");
    const sensitivities = this.policy.allowedSensitivity[ctx.purpose];
    need(Array.isArray(sensitivities) && sensitivities.includes(proposal.sensitivity), "DENIED", "sensitivity is not allowed for purpose");
    need(Date.parse(proposal.verifiedAt) <= this.nowMs, "DENIED", "verifiedAt is in the future");
    need(Date.parse(proposal.expiresAt) > this.nowMs, "DENIED", "proposal is not fresh");
    need(!heuristicInjection(proposal.value), "POISONED", "heuristic detected instruction-like content");
  }

  #sameBoundary(record, ctx) {
    need(record.tenantId === ctx.tenantId, "DENIED", "tenant mismatch");
    need(record.subjectId === ctx.subjectId, "DENIED", "subject mismatch");
    need(record.purpose === ctx.purpose, "DENIED", "purpose mismatch");
  }

  #requestId(requestId) {
    text(requestId, "requestId");
  }
}
