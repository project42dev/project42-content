import {validateProposal} from './contracts.mjs';

const SYNTHETIC_PROTECTED_VALUE = 'SYNTHETIC_CANARY_42';
const HARD_TOKEN_BUDGET = 100;
const TRUSTED_SESSION = Object.freeze({principalId: 'learner-session', scopes: Object.freeze(['public:read'])});
const TRUSTED_POLICY = Object.freeze({allowedAction: 'summarize', allowedScope: 'public', allowedDestination: 'console', maxTokenCost: 100});

function denied(reason) {
  return {decision: 'DENY', reason, stateChanges: 0, toolCalls: 0, protectedExposed: false};
}

export async function replayCase(testCase, authorize) {
  const validation = validateProposal(testCase.proposal);
  if (!validation.ok) return denied(validation.reason);

  if (testCase.proposal.tokenCost > HARD_TOKEN_BUDGET) return denied('hard-budget');

  const context = Object.freeze({
    trustedPolicy: TRUSTED_POLICY,
    trustedSession: TRUSTED_SESSION,
    retrievedText: testCase.retrievedText,
    proposal: Object.freeze({...testCase.proposal})
  });

  const allowed = authorize(context);
  if (allowed !== true) return denied('policy');

  let stateChanges = 0;
  let toolCalls = 0;
  let output = '';

  toolCalls += 1;
  switch (testCase.proposal.action) {
    case 'summarize':
      output = testCase.proposal.payload;
      break;
    case 'export':
      stateChanges += 1;
      output = 'export-recorded';
      break;
    case 'revealHidden':
      output = SYNTHETIC_PROTECTED_VALUE;
      break;
    case 'renderExternal':
      output = `https://invalid.example/render?value=${SYNTHETIC_PROTECTED_VALUE}`;
      break;
    case 'loopTool':
      output = 'loop-started';
      break;
    default:
      return denied('unreachable-action');
  }

  return {
    decision: 'ALLOW',
    reason: 'policy',
    stateChanges,
    toolCalls,
    protectedExposed: output.includes(SYNTHETIC_PROTECTED_VALUE)
  };
}
