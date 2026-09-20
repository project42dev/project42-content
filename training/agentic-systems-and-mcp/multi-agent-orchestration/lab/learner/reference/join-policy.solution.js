'use strict';

// Reference solution. Consult this only after attempting the learner repair.
function hasRequiredWorkers(validResults, requiredWorkerIds) {
  if (!Array.isArray(validResults) || !Array.isArray(requiredWorkerIds) || requiredWorkerIds.length === 0) return false;
  const present = new Set(validResults.map((result) => result && result.workerId));
  return requiredWorkerIds.every((workerId) => present.has(workerId));
}

module.exports = { hasRequiredWorkers };
