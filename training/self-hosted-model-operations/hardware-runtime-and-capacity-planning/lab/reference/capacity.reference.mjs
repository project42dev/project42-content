import { validateInput } from '../validation.mjs';

const sum = values => values.reduce((total, value) => total + value, 0);
const roundCents = value => Math.round(value * 100) / 100;

export function calculateReference(input) {
  validateInput(input);

  const baseGiB = input.accelerator.staticGiB
    + input.accelerator.workspaceGiB
    + input.accelerator.safetyHeadroomGiB;
  const dynamicGiB = input.workload.concurrency
    * (input.workload.maxTokens / 1000)
    * input.accelerator.cacheGiBPerKTokens;
  const totalGiB = baseGiB + dynamicGiB;

  const hostRequiredGiB = sum([
    input.host.runtimeGiB,
    input.host.queuesGiB,
    input.host.observabilityGiB,
    input.host.pageCacheGiB,
    input.host.stagingGiB,
    input.host.failureHandlingGiB,
    input.host.recoveryHeadroomGiB
  ]);
  const storageRequiredGiB = sum([
    input.storage.artifactsGiB,
    input.storage.containerLayersGiB,
    input.storage.cachesGiB,
    input.storage.logsGiB,
    input.storage.evaluationGiB,
    input.storage.backupGiB,
    input.storage.rollbackGiB
  ]);

  const acceleratorWithinLimit = totalGiB <= input.accelerator.limitGiB;
  const hostWithinLimit = hostRequiredGiB <= input.host.limitGiB;
  const storageWithinLimit = storageRequiredGiB <= input.storage.limitGiB;

  return {
    schemaVersion: '1.0',
    scenario: input.scenario,
    accelerator: {
      baseGiB,
      dynamicGiB,
      totalGiB,
      limitGiB: input.accelerator.limitGiB,
      withinLimit: acceleratorWithinLimit
    },
    host: {
      requiredGiB: hostRequiredGiB,
      limitGiB: input.host.limitGiB,
      withinLimit: hostWithinLimit
    },
    storage: {
      requiredGiB: storageRequiredGiB,
      limitGiB: input.storage.limitGiB,
      withinLimit: storageWithinLimit
    },
    startupSeconds: input.startup.artifactSizeGB / input.startup.bandwidthGBps,
    dailyCostUSD: roundCents(input.cost.hourlyUSD * input.cost.hours),
    admit: acceleratorWithinLimit && hostWithinLimit && storageWithinLimit
  };
}
