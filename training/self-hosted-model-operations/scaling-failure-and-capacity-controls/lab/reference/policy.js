// Independent recovery implementation. It does not import learner policy code.
export function assess(evidence) {
  const eligible = [];
  for (const host of evidence.hosts) {
    if (host.status === 'ready') eligible.push(host);
  }
  let readyCapacity = 0;
  let nominalCapacity = 0;
  const domains = new Set();
  for (const host of evidence.hosts) nominalCapacity += host.slots;
  for (const host of eligible) {
    readyCapacity += host.slots;
    if (host.slots > 0) domains.add(host.domain);
  }
  const causes = [];
  if (evidence.demand > readyCapacity + evidence.queueLimit) causes.push('capacity');
  if (evidence.queueDelayMs + evidence.serviceMs > evidence.deadlineMs) causes.push('deadline');
  if (domains.size < evidence.minFailureDomains) causes.push('failure-domain');
  if (evidence.hourlyCost > evidence.maxHourlyCost) causes.push('cost');
  const accepted = causes.length === 0;
  return {
    readyCapacity,
    nominalCapacity,
    admission: accepted ? 'ADMIT' : 'REJECT',
    decision: accepted ? 'APPROVE' : 'REJECT',
    causes
  };
}
