export function authorize({trustedPolicy, proposal, trustedSession}) {
  const sessionCanReadPublic = trustedSession.scopes.includes('public:read');
  if (!sessionCanReadPublic) return false;
  if (proposal.action !== trustedPolicy.allowedAction) return false;
  if (proposal.scope !== trustedPolicy.allowedScope) return false;
  if (proposal.destination !== trustedPolicy.allowedDestination) return false;
  if (proposal.tokenCost > trustedPolicy.maxTokenCost) return false;
  return true;
}
