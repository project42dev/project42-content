const rootKeys = [
  'version', 'hosts', 'demand', 'queueLimit', 'deadlineMs', 'serviceMs',
  'queueDelayMs', 'hourlyCost', 'maxHourlyCost', 'minFailureDomains'
];
const hostKeys = ['id', 'status', 'slots', 'domain'];
const statuses = new Set(['ready', 'warming', 'draining', 'failed']);

function object(value, path) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
}

function exactKeys(value, expected, path) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, i) => key !== wanted[i])) {
    throw new Error(`${path} has unknown or missing fields`);
  }
}

function text(value, path) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 100) {
    throw new Error(`${path} must be a non-empty bounded string`);
  }
}

function integer(value, min, max, path) {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${path} must be an integer from ${min} through ${max}`);
  }
}

function finite(value, min, max, path) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${path} must be finite from ${min} through ${max}`);
  }
}

export function parseEvidence(value) {
  object(value, 'evidence');
  exactKeys(value, rootKeys, 'evidence');
  integer(value.version, 1, 1, 'version');
  if (!Array.isArray(value.hosts) || value.hosts.length < 1 || value.hosts.length > 100) {
    throw new Error('hosts must contain 1 through 100 entries');
  }
  const ids = new Set();
  for (let i = 0; i < value.hosts.length; i += 1) {
    const host = value.hosts[i];
    object(host, `hosts[${i}]`);
    exactKeys(host, hostKeys, `hosts[${i}]`);
    text(host.id, `hosts[${i}].id`);
    if (ids.has(host.id)) throw new Error('host ids must be unique');
    ids.add(host.id);
    if (!statuses.has(host.status)) throw new Error(`hosts[${i}].status is unknown`);
    integer(host.slots, 0, 1000, `hosts[${i}].slots`);
    text(host.domain, `hosts[${i}].domain`);
  }
  integer(value.demand, 0, 1000000, 'demand');
  integer(value.queueLimit, 0, 1000000, 'queueLimit');
  integer(value.deadlineMs, 1, 3600000, 'deadlineMs');
  integer(value.serviceMs, 0, 3600000, 'serviceMs');
  integer(value.queueDelayMs, 0, 3600000, 'queueDelayMs');
  finite(value.hourlyCost, 0, 1000000000, 'hourlyCost');
  finite(value.maxHourlyCost, 0, 1000000000, 'maxHourlyCost');
  integer(value.minFailureDomains, 1, 100, 'minFailureDomains');
  return structuredClone(value);
}
