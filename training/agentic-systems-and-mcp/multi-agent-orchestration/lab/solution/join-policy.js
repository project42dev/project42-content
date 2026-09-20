'use strict';

function hasRequiredWorkers(validResults, requiredWorkerIds) {
  const present = new Set(validResults.map((result) => result.workerId));
  return requiredWorkerIds.every((workerId) => present.has(workerId));
}

module.exports = { hasRequiredWorkers };
