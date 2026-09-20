'use strict';

// Intentionally broken learner baseline.
// This verifies quantity, not the identities of required workers.
// Repair only this function.
function hasRequiredWorkers(validResults, requiredWorkerIds) {
  if (!Array.isArray(validResults) || !Array.isArray(requiredWorkerIds) || requiredWorkerIds.length === 0) return false;
  return validResults.length >= requiredWorkerIds.length;
}

module.exports = { hasRequiredWorkers };
