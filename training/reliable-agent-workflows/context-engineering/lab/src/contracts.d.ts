export type Role = 'governingPolicy' | 'userGoal' | 'trustedState' | 'evidence' | 'untrustedData' | 'priorDecision' | 'toolContract' | 'outputRequirement' | 'missingInformation';
export interface Mutation { path: string; from: unknown; to: unknown }
export interface ToolProposal { toolId: string; expectedRevision: string; authorityRevision: string; mutation: Mutation }
export interface ToolContract { id: string; trustedConfiguration: true; allowedAuthoritySourceIds: string[]; allowedMutationPaths: string[] }
export interface Authority { sourceId: string; revision: string }
export interface StateRecord { revision: string; data: Record<string, unknown> }
export interface Decision { status: 'READY' | 'ESCALATE' }
export interface ContextResult {
  caseId: string;
  status: 'READY' | 'ESCALATE';
  selected: string[];
  untrusted: string[];
  omissions: { id: string; reason: string }[];
  conflicts: string[];
  missing: string[];
  refreshes: string[];
  rehydrated: string[];
  reservations: { total: number; reserved: number; evidenceCapacity: number; used: number };
}
export function buildContext(input: unknown): ContextResult;
export function authorizeAndApply(args: { contract: ToolContract; proposal: ToolProposal; state: StateRecord; authority: Authority; decision: Decision; apply: (next: StateRecord) => void }): StateRecord;
