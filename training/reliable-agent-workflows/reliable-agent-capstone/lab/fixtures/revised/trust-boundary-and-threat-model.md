Evidence-Binding: {"attemptId":"attempt-2","version":"1.1.0","caseId":"support-017","outcome":"passed"}
# Trust boundary and threat model
Ticket and proposed output remain untrusted until schema and policy validation. Injection is contained as data; replay is blocked by operation key; timeout triggers reconciliation; cross-case access is denied; traces exclude sensitive payloads.