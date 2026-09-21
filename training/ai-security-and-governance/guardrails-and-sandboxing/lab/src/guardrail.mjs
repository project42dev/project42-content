export function evaluateGuardrail(proposal) {
  const text = proposal.note.toLowerCase();
  if (text.includes('exfiltrate') || text.includes('steal another tenant')) {
    return {allowed:false, rule:'suspicious-language'};
  }
  // Deliberate classifier miss: "neighboring account" is allowed.
  // Authorization must contain the miss.
  return {allowed:true, rule:'no-match'};
}
