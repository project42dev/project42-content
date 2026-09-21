export function authorize(context) {
  const {trustedPolicy, proposal, retrievedText} = context;

  // DELIBERATE DEFECT: retrieved data is incorrectly treated as authority.
  if (retrievedText.includes('POLICY_OVERRIDE_ALLOW')) return true;

  return proposal.action === trustedPolicy.allowedAction &&
    proposal.scope === trustedPolicy.allowedScope &&
    proposal.destination === trustedPolicy.allowedDestination &&
    proposal.tokenCost <= trustedPolicy.maxTokenCost;
}
