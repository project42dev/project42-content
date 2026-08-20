# Coding and Analysis Workflow

Package: `coding-and-analysis-workflow-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class turns AI-assisted coding and analysis into a controlled evidence loop. You will inspect the real system before proposing work, define what may change and what must remain true, make one reviewable increment at a time, and test the result outside the model's explanation. You will also preserve failures and recover narrowly instead of hiding evidence. Success means you can reproduce the change, show why it is correct, and reverse it safely.

## Narration: Bounded Work Order Explanation

Prepare a work order before asking for code, a query, or a conclusion. For code, state the behavior to change, relevant files and interfaces, constraints, acceptance checks, and invariants that must not change. For analysis, state the decision or question, data fields, units, time period, population, permitted transformations, and reconciliation checks. Inspect the actual repository, schema, sample, documentation, and current tests. Do not let a model guess their contents. Choose a workspace appropriate to risk: a branch or isolated copy for code, and a sandbox or read-only source for data. Remove credentials and unnecessary personal or restricted information. Name actions that require separate authorization, including package installation, network access, production writes, deletion, or permission changes. Finally, record a rollback path. A bounded work order prevents a useful suggestion from silently becoming authority to change the system.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/latest-model>

## Demonstration: Work Order Demonstration

Suppose a report drops orders that have no matching customer row. The bounded question is not, fix the analytics. It is: identify unmatched orders and report their value without changing the accepted revenue total. I inspect the order and customer keys, row grain, null rules, currency units, existing query, and reconciliation test. I work on a copy of the query against approved sample data. The invariant is that the original order count and amount remain traceable. The checks compare source counts, unique keys, unmatched keys, joined counts, and totals. Production data writes and schema changes are outside scope. Rollback means restoring the prior query and saved results. This definition makes a join proposal testable and prevents an unrelated model-generated cleanup from entering the work.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Small Increments Explanation

Execute one coherent increment at a time. Ask for a short plan tied to the inspected inputs, then verify that each step remains inside the work order. For code, change one behavior, inspect the diff, and run the nearest check before expanding scope. Prefer established project patterns. Reject unrequested frameworks, dependencies, permissions, configuration changes, and broad rewrites. For analysis, preserve raw inputs and write transformations in an inspectable sequence. Record filters, joins, calculations, missing-value decisions, units, and assumptions. Keep intermediate row counts and totals so later conclusions can be traced backward. If a tool proposes a command, query, or file change, read it before execution and confirm the target, environment, and effect. Separate planning authority from execution authority: generating a command is not permission to run it. Small increments localize errors and make rollback a routine step instead of a crisis.

Sources:

- <https://developers.openai.com/api/docs/guides/latest-model>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Learner Prompt: Invariant Prompt

Choose a low-risk code or data task. Write one observable outcome, one invariant that must remain true, one check that proves the outcome, and one action that is explicitly outside your authority.

Expected learner action: Define a bounded result, protected invariant, direct check, and authorization limit.

Sources:

- <https://developers.openai.com/api/docs/guides/latest-model>

## Pause: Invariant Work Time

## Narration: Direct Verification Explanation

Verify with the system and data, not with the model's confidence. For code, run the formatter, type checker, focused unit tests, relevant integration tests, and production build that match the change. Exercise the success path, an important failure path, and the actual user-visible behavior. Review the final diff for unrelated files, disabled checks, weakened assertions, exposed secrets, new dependencies, and generated artifacts. For analysis, validate field types, missingness, units, value ranges, duplicates, keys, join cardinality, unmatched rows, filters, outliers, and before-and-after totals. Confirm that the sample represents the population needed for the conclusion. Recalculate a small case independently. A successful query proves only that the query executed. A passing test proves only what it actually asserts. Link each acceptance criterion to direct output, and record gaps rather than converting them into confident prose.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/latest-model>

## Checkpoint: Join Explosion Checkpoint

Checkpoint. The order table has one thousand three hundred rows. The customer table has one thousand rows. After joining on customer name, the result has one thousand six hundred fifty rows. The generated explanation says the increase is normal because customers can place multiple orders. Is that sufficient evidence, and what should you check next?

Expected learner action: Reject the explanation as evidence and inspect key uniqueness, row grain, duplicate names, unmatched rows, join cardinality, and reconciled amounts before accepting the result.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Join Explosion Response Time

## Feedback: Join Explosion Feedback

The explanation is not sufficient. Multiple orders already exist as separate order rows; they do not by themselves explain why a join created three hundred fifty additional rows. Inspect the grain and uniqueness of both keys. Customer name may be duplicated or may identify different people. Count matched and unmatched keys, test for many-to-many combinations, compare distinct order identifiers, and reconcile amounts before and after the join. If you accepted the result because the query succeeded, revise your criterion: successful execution is not data validity. If the key is unsafe, use an approved stable identifier or report that the available data cannot support the join.

Correct feedback: You treated the extra rows as a verification failure, checked key grain and cardinality, and required reconciliation before using the result.

Retry feedback: Ask whether one source row can match more than one row on the other side and whether order identifiers and amounts still reconcile.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Failure Recovery Explanation

Preserve failure evidence before attempting repair. Save the command or query, exact error, relevant input, environment, and smallest reproduction. Classify the responsible layer: expectation, code, data, dependency, permission, network, configuration, or environment. Return to the last verified increment and change the narrowest responsible layer. Do not delete a test, weaken an assertion, discard inconvenient rows, increase a timeout, or regenerate the entire solution merely to obtain green output. Rerun the failed check, neighboring regression checks, and the original acceptance checks. If the environment is uncertain, stop and compare versions and configuration before changing code. If recovery requires destructive action, production access, new permissions, or cost beyond the work order, preserve state and escalate. Use version control or a verified backup to reverse unsafe work, but do not erase logs or artifacts needed to understand the failure.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Security Privacy Impact Explanation

Review security, privacy, and downstream impact before accepting the work. Inspect authentication, authorization, input validation, output encoding, secrets, logs, dependencies, network calls, file targets, data exposure, error handling, and failure defaults. Generated code may compile while bypassing an account state or logging a credential. A statistically correct transformation may still expose personal data, erase a protected group, use incompatible units, or support a conclusion beyond the sample. Scan the diff and outputs for sensitive material. Confirm the reviewer, deployment boundary, backup, monitoring, and rollback evidence. Destructive, external, costly, or permission-expanding actions require the authorized workflow and explicit approval; model confidence never substitutes for authority. Record the work order, inspected inputs, diff or query, check outputs, failure-and-recovery evidence, limitations, reviewer, and disposition. Commit or publish only the verified scoped result.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Transition: Activity Transition

Open the verified code or analysis activity. Choose a low-risk defect or dataset question. Write the outcome, inspected inputs, constraints, invariants, checks, workspace, authorization boundary, and rollback. Make one coherent change or transformation and preserve its diff or query log. Run at least three relevant checks, including one boundary or failure case. Preserve one failure, classify its layer, correct it narrowly, rerun the checks, and save the recovery and rollback evidence.

Sources:

- <https://developers.openai.com/api/docs/guides/latest-model>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a safe work order, distinguish executable evidence from explanation, select join reconciliation checks, recover from a failed test without hiding evidence, and recognize the controls required before destructive production action. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the loop controlled: inspect reality, bound the work, change one thing, verify directly, preserve failures, and recover without exceeding your authority.
