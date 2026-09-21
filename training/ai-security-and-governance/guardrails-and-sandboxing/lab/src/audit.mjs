export function auditBase(session, proposal, guard) {
  return {
    event:'tool_execution',
    triggerText:proposal.note.slice(0, 80),
    parsed:{tool:proposal.tool, customerId:proposal.args.customerId},
    auth:{method:session.authMethod, authenticatedAt:session.authenticatedAt, subject:session.subject, tenant:session.tenant},
    guardrail:{allowed:guard.allowed, rule:guard.rule}
  };
}

export function deniedAudit(base, reasonCode) {
  return {...base, decision:'deny', reasonCode, downstream:{called:false}, reinsertion:'secret_failure'};
}

export function allowedAudit(base, count) {
  return {...base, decision:'allow', downstream:{called:true, resultCount:count}, reinsertion:'validated_redacted_result'};
}
