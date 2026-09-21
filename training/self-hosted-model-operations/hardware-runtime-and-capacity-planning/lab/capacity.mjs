import { pathToFileURL } from 'node:url';
import { readInput, validateInput } from './validation.mjs';

const sum = values => values.reduce((total, value) => total + value, 0);
const roundCents = value => Math.round(value * 100) / 100;

export function calculate(input) {
  validateInput(input);

  const baseGiB = input.accelerator.staticGiB
    + input.accelerator.workspaceGiB
    + input.accelerator.safetyHeadroomGiB;

  // LEARNER DEFECT: dynamic cache for each concurrent request is omitted.
  const dynamicGiB = 0;
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

async function main() {
  const input = await readInput(process.argv[2]);
  process.stdout.write(`${JSON.stringify(calculate(input))}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    process.stderr.write(`${error.name}: ${error.message}\n`);
    process.exitCode = 1;
  });
}
