export function executeInternal(proposal, customer) {
  if (proposal.tool === 'customer.read') {
    const record = {id:customer.id, internalRisk:customer.internalRisk};
    for (const field of proposal.args.fields) record[field] = customer[field];
    return {kind:'read', records:[record], serviceTrace:'synthetic-service-read'};
  }
  return {kind:'export', records:[{...customer}], serviceTrace:'synthetic-service-export'};
}

export function validateAndRedactResult(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.records) || raw.records.length > 10) throw new Error('BAD_INTERNAL_RESULT');
  const records = raw.records.map(record => {
    const clean = {id:String(record.id)};
    if (typeof record.name === 'string') clean.name = record.name;
    if (typeof record.email === 'string') clean.email = record.email;
    return clean;
  });
  return {ok:true, records};
}
