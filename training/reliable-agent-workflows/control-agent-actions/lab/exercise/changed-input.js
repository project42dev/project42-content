import {environment} from '../fixtures.js';

// Deliberately incomplete learner input. Exactly two required bindings are already correct:
// actor.allowedResources and policy.resourceId. Repair the three approval values only.
export function changedInput() {
  return {
    action:{action:'update_ticket_status',targetId:'ticket_87654321',toStatus:'RESOLVED',operationKey:'op_beta_resolve_0001',expectedVersion:4},
    context:{
      actor:{id:'actor_learner',tenantId:'tenant_beta',allowedResources:['ticket_87654321']},
      policy:{allowedActions:['update_ticket_status'],tenantId:'tenant_beta',resourceId:'ticket_87654321',fromStatus:'OPEN',toStatus:'RESOLVED'},
      approval:{approvalId:'approval_beta_1',actorId:'actor_learner',tenantId:'tenant_beta',action:'update_ticket_status',resourceId:'ticket_12345678',toStatus:'RESOLVED',expectedVersion:3,operationKey:'op_beta_wrong_0001'},
      limits:{maxSteps:2,maxCostUnits:2,maxRateActions:1,rateWindowMs:10000},
      usage:{steps:0,costUnits:0,rateActions:0,windowStartMs:5000},
      charge:{steps:1,costUnits:1,rateActions:1},
      clock:{nowMs:6000},
      toolOutput:'untrusted adapter text'
    },
    env:environment('ticket_87654321','tenant_beta',4)
  };
}
