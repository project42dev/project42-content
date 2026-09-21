Evidence-Binding: {"attemptId":"attempt-0","version":"0.9.0","caseId":"support-017","outcome":"failed"}
# Architecture and state model
States: intake, planning, authorization, execution, verification, reconciliation, completed, failed. The draft incorrectly treats a model success string as the postcondition. Feedback: require destination read-back and preserve this failed attempt.