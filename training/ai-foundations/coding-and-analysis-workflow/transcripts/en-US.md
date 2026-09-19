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

## Demonstration: Miniature Join Reconciliation

Use a fictional miniature join before judging the checkpoint. Orders contains three rows: O1, customer C1, 100 cents; O2, C2, 200 cents; O3, C1, 300 cents. Customers wrongly contains C1, Alice; C1, Alicia; C2, Bob. Before joining, orders have three rows and total 600 cents. An inner join on customer identifier returns five rows because each C1 order matches twice and a duplicated total of 1000 cents. After deduplicating customers to one row per identifier, the join returns three rows and 600 cents. The exact checks are key uniqueness, joined row count, distinct order count, unmatched orders, and amount reconciliation.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

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

## Narration: Baseline Policy Walkthrough

The baseline policy depends on processing order. First require the exact five-field header. Python's DictReader exposes the detected header through reader.fieldnames, so the program can compare the names and their order with the required schema. For every row, build a tuple from all five raw values and check it against previously seen rows before validation. A repeated tuple increments ignored_duplicates and stops processing that row. A new row needs nonempty invoice and customer identifiers, kind equal to charge or refund, and a positive amount containing only ASCII decimal digits. Reject a different row that reuses an accepted invoice identifier. Rejected rows reserve nothing. Accepted charges add to gross; accepted refunds add only to refunds; net equals gross minus refunds. Print the six labels in the required fixed order.

Sources:

- <https://docs.python.org/3/library/csv.html>
- <https://docs.python.org/3/library/functions.html#int>

## Narration: Original Fixture Walkthrough

Read transactions.csv in file order. DictReader produces each data row as a mapping keyed by the header fields. A100 is an accepted 1250-cent charge. The first A101 is an accepted 250-cent refund referencing A100. The next A101 repeats all five raw fields, so it is one ignored duplicate, not an invoice conflict. A102 adds 3000 cents to gross, and A103 adds 1000. A104 has an empty amount and is rejected. Therefore six data rows reconcile as four accepted plus one duplicate plus one rejected. Gross is 1250 plus 3000 plus 1000, or 5250. Refunds are 250, and net is 5000. Under the supplied baseline rule, refund references are informational and may be empty safely.

Sources:

- <https://docs.python.org/3/library/csv.html>

## Narration: Buggy Program Truthiness

In analyze_buggy.py, validation succeeds before accounting reaches the quoted condition `kind == "charge" or "refund"`. Python does not compare kind with both strings. It evaluates `kind == "charge"` first. For a refund, that comparison is false, so the or expression evaluates the standalone nonempty string `"refund"`. A nonempty string has a true truth value, making the complete condition true. Thus every accepted refund enters gross. A separate equality check also enters it in refunds. The 250-cent refund is counted in both totals, producing gross 5500 and net 5250. The defect is classification, not CSV parsing, duplicate handling, or arithmetic. Preserve this exact condition as diagnosis evidence first.

Sources:

- <https://docs.python.org/3/library/stdtypes.html#dict-views>

## Narration: Public Behavior Test Strategy

Translate the policy into observable behavior. Test one compares all six original output lines exactly. Test two checks gross 5250 and refunds 250 separately. Test three checks net equals gross minus refunds. Test four verifies one exact duplicate and seven rejected boundary rows. Test five verifies two accepted rows and gross 100 in that boundary fixture. Test six confirms a baseline refund with an empty reference is accepted, with refunds 25 and net 75. Together these six tests cover duplicates, conflicts, missing identifiers, zero, negative, signed, decimal, noninteger amounts, unknown kinds, reconciliation, exact output order, and valid-schema process success independently.

Sources:

- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Narration: Baseline Tests Walkthrough

The six baseline tests launch analyze_correct.py with subprocess.run instead of importing internals. The call uses text=True so captured output is text, capture_output=True to collect standard output and standard error, and check=True so a nonzero process exit raises an exception. The tests then use assertEqual to compare observed public values with expected values. The original fixture supports exact output, refund classification, and reconciliation tests. A complete boundary CSV is embedded visibly and written to a temporary local directory. It includes an exact duplicate, a conflicting accepted invoice identifier, missing identifiers, negative and decimal amounts, an unknown kind, zero, and a refund without a reference. The suite checks public behavior, not private sets. No command execution is claimed here. Learners must run it locally and preserve their output.

Sources:

- <https://docs.python.org/3/library/subprocess.html#subprocess.run>
- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Narration: Baseline Setup Walkthrough

Create the exact displayed files inside coding_lab. The test constant PROGRAM points to analyze_correct.py, so first copy analyze_buggy.py to that filename. Run `python3 analyze_correct.py transactions.csv`, then `python3 -m unittest -v test_analysis.AnalysisTest.test_refund_is_not_gross`. This setup deliberately makes the supplied test exercise the buggy implementation. Preserve the six-line output and assertion before editing. Next save the complete corrected program as analyze_correct.py, rerun the program, and run `python3 -m unittest -v test_analysis.py`. The verbose flag requests detailed test reporting, but durations and surrounding formatting can vary. Treat the exact output lines, assertion, test count, and final status as evidence. Do not claim these commands ran unless you ran them locally yourself and recorded their results.

Sources:

- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Narration: Baseline Failure Diagnosis

The supplied reproducible buggy output is accepted_rows=4, ignored_duplicates=1, rejected_rows=1, gross_charges_cents=5500, refunds_cents=250, and net_cents=5250. The targeted test has the exact stable assertion quotation `AssertionError: 5500 != 5250`. Independently, accepted charges sum to 1250 plus 3000 plus 1000, which is 5250. The observed gross exceeds that by exactly 250, the accepted refund. Counts still reconcile as four accepted, one duplicate, and one rejected. This evidence localizes the mismatch to charge-versus-refund accounting, while leaving validation and duplicate behavior intact for this fixture. Preserve the command, output, assertion, fixture, and environment before applying any repair or asking a model to reinterpret the requirement afterward.

Sources:

- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Narration: Corrected Program Walkthrough

Replace only the faulty accounting condition with mutually exclusive branches. The corrected logic is `if kind == "charge":` add cents to gross; `elif kind == "refund":` add cents to refunds. Both alternatives perform explicit equality comparisons. Because the second branch is reached only when the first condition is false, one accepted row cannot enter both branches. Keep the exact header check, five-field duplicate key, validation helper, accepted invoice set, counters, return labels, command interface, and output order unchanged. This is the narrow repair because it changes the responsible classification layer only. Save the complete canonical corrected file rather than patching from memory. Then run the focused check and all regression tests, recording observed results separately from supplied expectations.

Sources:

- <https://docs.python.org/3/library/stdtypes.html#dict-views>

## Narration: Correct Output And Reversal

The supplied corrected expectation is exactly accepted_rows=4, ignored_duplicates=1, rejected_rows=1, gross_charges_cents=5250, refunds_cents=250, and net_cents=5000, in that order. Reconcile rows independently: six equals four plus one plus one. Reconcile money: 1250 plus 3000 plus 1000 equals 5250; then 5250 minus 250 equals 5000. The supplied suite expectation is six tests with final status OK. To test reversal, copy analyze_buggy.py over analyze_correct.py, rerun the targeted test, and compare the resulting assertion with the exact supplied quotation `AssertionError: 5500 != 5250`. Recover by restoring the complete corrected file and rerunning the full suite. Record observed results separately from these supplied expectations. Reversal demonstrates recoverability only when the local commands reproduce the expected failure and recovery without deleting the tests or preserved evidence.

Sources:

- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Narration: Bounded Ai Prompt Walkthrough

The bounded AI request supplies transactions.csv, analyze_buggy.py, and test_analysis.py as context. It states Python standard-library only, offline work, fictional integer cents, exact schema, validation, duplicate ordering, identifier conflict, refund accounting, six output labels, tests, and rollback. It asks for a diagnosis quoting the faulty condition, a short plan, and the smallest analyze_correct.py. It also says not to claim command execution. A model response remains a proposal until local commands produce evidence. If transferring to another tool, keep files, constraints, and checks identical. A model family name does not prove equivalent behavior. This lab needs no account, network, package, or secret.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Changed Task Policy Narration

The next task changes one policy while preserving the baseline schema, duplicate ordering, common validation, invoice-conflict rule, accounting labels, and output order. A refund now qualifies only if its ref_invoice_id exactly matches a charge that has already been accepted earlier in the same file. A missing reference, unmatched reference, forward reference, reference to a refund, or reference to a rejected charge must follow the rejection path. This requires state that distinguishes accepted charges from other accepted invoices. Before seeing any answer code or totals, predict the six public output values, implement the rule, and design tests that distinguish each invalid-reference category from a valid earlier-charge reference. Keep the CSV unchanged so the implementation, rather than an edited fixture, is what the tests evaluate.

Sources:

- <https://docs.python.org/3/library/csv.html>
- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Learner Prompt: Changed Rule Learner Task

The independent variation keeps every baseline rule but changes refund validity. A refund is accepted only when ref_invoice_id exactly names a charge accepted earlier in file order. Missing, unmatched, forward, refund-to-refund, and rejected-charge references are invalid. Create transactions_changed.csv, analyze_changed.py, and test_changed.py from the supplied fixture and policy. Before opening any answer, predict all six output values, implement a real code path, and write tests for each reference category. Run the changed program and suite only in your own environment. Preserve your first exact output or assertion. Identify which counter or total makes the policy observable. Do not modify the CSV.

Expected learner action: Predict all six values, implement the earlier-accepted-charge rule, write reference-boundary tests, run locally if possible, and preserve the first result before viewing feedback.

## Narration: Changed Fixture Analysis Narration

Inspect transactions_changed.csv as a complete seven-row fixture. It retains the six baseline rows and appends A105, a 400-cent refund whose reference text is NO_SUCH_CHARGE. Work from top to bottom because eligibility depends on state established by earlier accepted rows. For each row, first ask whether its five raw values duplicate an earlier row. If it is new, apply common validation and the accepted-invoice conflict rule. For a refund that survives those checks, ask whether its reference names a charge already accepted at that point. Record the row's classification before changing any counter or total. Your tests should include a forward reference, an empty reference, a reference to a refund, a reference to a rejected charge, and a valid reference to an earlier accepted charge. Do not compare with answer totals yet.

Sources:

- <https://docs.python.org/3/library/csv.html>

## Checkpoint: Changed Fixture Checkpoint

Checkpoint. The changed fixture contains the six baseline rows plus A105, a 400-cent refund whose reference text is NO_SUCH_CHARGE. The baseline duplicate, invalid amount, charges, and refund remain in their original file order. Without reading later sections, determine how each of the seven rows should be classified under the new rule. Then predict accepted_rows, ignored_duplicates, rejected_rows, gross_charges_cents, refunds_cents, and net_cents in printed order. Explain when a charge identifier becomes eligible as a reference, and whether an invalid refund reserves its invoice identifier or changes money. Write your reasoning and implementation before continuing. Which tests would expose incorrect file-order handling directly?

Expected learner action: Classify all seven rows, predict all six output values, implement the changed rule, and identify tests for unmatched, missing, forward, refund, and rejected-charge references.

## Pause: Changed Task Work Time

## Narration: Changed Answer Explanation Narration

The attempt pause is complete, so now trace the supplied answer. A100 is accepted first as a 1250-cent charge, making A100 eligible for later refund references. The first A101 refund references A100, so it is accepted and adds 250 cents only to refunds. The second A101 has the same five raw fields and is ignored as an exact duplicate before validation. A102 and A103 are accepted charges of 3000 and 1000 cents. A104 fails common validation because its amount is empty. A105 passes the common field checks but its reference, NO_SUCH_CHARGE, does not name an earlier accepted charge, so it is rejected before acceptance, invoice reservation, or accounting. The result is four accepted rows, one ignored duplicate, two rejected rows, gross 5250, refunds 250, and net 5000. Seven rows reconcile as four plus one plus two, and money reconciles as 1250 plus 3000 plus 1000 minus 250 equals 5000.

Sources:

- <https://docs.python.org/3/library/csv.html>

## Feedback: Changed Answer Feedback

Now compare your attempt with the key. A100 is an earlier accepted charge, so the first A101 refund is valid. Its repeated row is still one ignored exact duplicate. A102 and A103 are accepted charges. A104 remains rejected for an empty amount. A105 is rejected because its reference does not identify an earlier accepted charge. Therefore the six values are four accepted, one duplicate, two rejected, gross 5250, refunds 250, and net 5000. If you got rejected one and net 4600, you accepted the unmatched refund. If money stayed correct but rejected stayed one, you may have silently ignored it.

Correct feedback: You rejected A105 before acceptance or accounting, retained the valid A101 refund, and reconciled seven rows as four accepted, one duplicate, and two rejected.

Retry feedback: Trace accepted charge identifiers in file order. An invalid refund must increment rejected_rows and must change neither accepted_rows nor refunds_cents.

## Narration: Changed Program Walkthrough

The answer-key program adds accepted_charge_ids beside accepted_invoice_ids. DictReader continues to supply rows in file order, and the program still checks exact duplicates before validation. Common validation runs before reference validation. For a refund, the program asks whether its reference is already in accepted_charge_ids. If not, it increments rejected and continues before accepted_rows, invoice reservation, or refunds can change. When a charge is accepted, its invoice identifier enters the charge set. Processing in file order therefore allows references only to earlier accepted charges. Forward references, refund identifiers, missing references, and rejected-charge identifiers fail. This state change is necessary. Merely changing expected output would not implement the policy or survive the boundary tests.

Sources:

- <https://docs.python.org/3/library/csv.html>
- <https://docs.python.org/3/library/stdtypes.html#dict-views>

## Narration: Changed Tests Walkthrough

The changed suite contains four tests, bringing the supplied lab total to ten tests across the two files. Like the baseline suite, it uses subprocess.run to observe the program's public output and assertEqual to compare observed and expected values. Test one compares all six output lines for transactions_changed.csv. Test two checks that the unmatched refund raises rejected_rows to two while refunds remains 250. Tests three and four use the visible REFERENCE_CASES fixture. Its first refund is a forward reference and fails. C2 is then an accepted 100-cent charge. C3 is a valid 10-cent refund referencing C2. C4 is a rejected invalid-amount charge. C5 references C4 and fails. C6 lacks a reference and fails. Expected metrics are two accepted, four rejected, gross 100, refunds 10, and net 90. These are supplied expectations until the learner runs the suite locally.

Sources:

- <https://docs.python.org/3/library/subprocess.html#subprocess.run>
- <https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertEqual>

## Narration: Changed Output Reconciliation

The supplied changed-output expectation is accepted_rows=4, ignored_duplicates=1, rejected_rows=2, gross_charges_cents=5250, refunds_cents=250, and net_cents=5000. Reconcile seven rows as four accepted plus one duplicate plus two rejected. Gross remains 5250, refunds remain 250, and net remains 5000 because the added refund is invalid under the changed rule. Baseline and changed monetary totals match, but behavior is still observable through the added input row and increased rejection count. An incorrect program accepting A105 would report accepted five, duplicate one, rejected one, gross 5250, refunds 650, and net 4600. If locally observed evidence differs, diagnose reference membership, file order, rejection timing, and duplicate handling before changing any expected value manually.

Sources:

- <https://docs.python.org/3/library/csv.html>

## Narration: Reusable Record Walkthrough

Use the blank record after the worked example. Fill the behavior, files and schema, fictional-data or privacy boundary, units, duplicate rule, missing-value rule, identifier conflict rule, other validation, protected invariant, bug evidence, smallest change, commands, exact outputs, behavior tests, boundary fixture, reconciliations, preserved failure, cause layer, and rollback. Also record the changed-input rule, prediction, first evidence, diagnosis, and next check. Keep raw input, both program versions, test files, and command output together. Mark every result as personally observed, supplied expected, or proposed. For real records, add authorization, retention, privacy, and domain review. This fictional exercise does not establish production suitability.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Transition: Activity Transition

Open the verified code or analysis activity. Choose a low-risk defect or dataset question. Write the outcome, inspected inputs, constraints, invariants, checks, workspace, authorization boundary, and rollback. Make one coherent change or transformation and preserve its diff or query log. Run at least three relevant checks, including one boundary or failure case. Preserve one failure, classify its layer, correct it narrowly, rerun the checks, and save the recovery and rollback evidence.

Sources:

- <https://developers.openai.com/api/docs/guides/latest-model>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a safe work order, distinguish executable evidence from explanation, select join reconciliation checks, recover from a failed test without hiding evidence, and recognize the controls required before destructive production action. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the loop controlled: inspect reality, bound the work, change one thing, verify directly, preserve failures, and recover without exceeding your authority.
