// Learner file. There is one focused defect in capacityForAdmission.
function capacityForAdmission(evidence) {
  // DEFECT: nominal slots include warming, draining, and failed hosts.
  return evidence.hosts.reduce((sum, host) => sum + host.slots, 0);
}

export function assess(evidence) {
  const readyHosts = evidence.hosts.filter((host) => host.status === 'ready');
  const readyCapacity = readyHosts.reduce((sum, host) => sum + host.slots, 0);
  const nominalCapacity = evidence.hosts.reduce((sum, host) => sum + host.slots, 0);
  const admissionCapacity = capacityForAdmission(evidence);
  const domains = new Set(readyHosts.filter((host) => host.slots > 0).map((host) => host.domain));
  const causes = [];
  if (evidence.demand > admissionCapacity + evidence.queueLimit) causes.push('capacity');
  if (evidence.queueDelayMs + evidence.serviceMs > evidence.deadlineMs) causes.push('deadline');
  if (domains.size < evidence.minFailureDomains) causes.push('failure-domain');
  if (evidence.hourlyCost > evidence.maxHourlyCost) causes.push('cost');
  return {
    readyCapacity,
    nominalCapacity,
    admission: causes.length === 0 ? 'ADMIT' : 'REJECT',
    decision: causes.length === 0 ? 'APPROVE' : 'REJECT',
    causes
  };
}
