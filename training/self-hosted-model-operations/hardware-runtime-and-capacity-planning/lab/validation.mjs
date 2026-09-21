import { readFile } from 'node:fs/promises';

const numericPaths = [
  'workload.concurrency',
  'workload.maxTokens',
  'accelerator.staticGiB',
  'accelerator.workspaceGiB',
  'accelerator.safetyHeadroomGiB',
  'accelerator.cacheGiBPerKTokens',
  'accelerator.limitGiB',
  'host.runtimeGiB',
  'host.queuesGiB',
  'host.observabilityGiB',
  'host.pageCacheGiB',
  'host.stagingGiB',
  'host.failureHandlingGiB',
  'host.recoveryHeadroomGiB',
  'host.limitGiB',
  'storage.artifactsGiB',
  'storage.containerLayersGiB',
  'storage.cachesGiB',
  'storage.logsGiB',
  'storage.evaluationGiB',
  'storage.backupGiB',
  'storage.rollbackGiB',
  'storage.limitGiB',
  'startup.artifactSizeGB',
  'startup.bandwidthGBps',
  'cost.hourlyUSD',
  'cost.hours'
];

function valueAt(input, path) {
  return path.split('.').reduce((value, key) => value?.[key], input);
}

export function validateInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }
  if (input.schemaVersion !== '1.0') {
    throw new TypeError('schemaVersion must equal 1.0');
  }
  if (typeof input.scenario !== 'string' || input.scenario.trim() === '') {
    throw new TypeError('scenario must be a non-empty string');
  }
  if (input.memoryUnit !== 'GiB') {
    throw new TypeError('memoryUnit must equal GiB');
  }
  if (input.transferUnit !== 'GB') {
    throw new TypeError('transferUnit must equal GB');
  }
  for (const path of numericPaths) {
    const value = valueAt(input, path);
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new TypeError(`${path} must be a finite non-negative number`);
    }
  }
  if (!Number.isInteger(input.workload.concurrency) || input.workload.concurrency <= 0) {
    throw new TypeError('workload.concurrency must be a positive integer');
  }
  if (!Number.isInteger(input.workload.maxTokens) || input.workload.maxTokens <= 0) {
    throw new TypeError('workload.maxTokens must be a positive integer');
  }
  for (const path of ['accelerator.limitGiB', 'host.limitGiB', 'storage.limitGiB', 'startup.bandwidthGBps', 'cost.hours']) {
    if (valueAt(input, path) <= 0) {
      throw new TypeError(`${path} must be greater than zero`);
    }
  }
  return input;
}

export async function readInput(path) {
  if (typeof path !== 'string' || path.length === 0) {
    throw new TypeError('an input JSON path is required');
  }
  const text = await readFile(path, 'utf8');
  return validateInput(JSON.parse(text));
}
