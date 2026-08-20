# Coding and Analysis as a Controlled Workflow

A coding or analysis task becomes easier to manage when you treat it as a small investigation rather than one large request. Before changing code or drawing conclusions from data, define what is inside the task and what is outside it.

A useful boundary has four parts:

- **The question:** What are you trying to learn or change?
- **The inputs:** Which files, rows, fields, or functions may be used?
- **The constraints:** What must remain unchanged? Which assumptions are not allowed?
- **The success evidence:** What observation would convince you that the work is correct?

For example, “analyze the sales file” is too broad. “Calculate the average amount for completed orders, using only the supplied CSV, and report how many rows were excluded” is bounded. The second task gives you something you can inspect, test, and explain.

## Make the environment visible

Many failures are caused by invisible assumptions. A program may be run from the wrong directory, use a different input file than expected, or depend on a package that is not available. Before working, inspect the environment that matters:

- List the files you are allowed to use.
- Confirm the input file exists.
- Inspect the header and a few rows.
- Identify the expected columns or function names.
- Record the exact command you intend to run.

Write the command down before running it. If you later run a variation, record that too. This small habit makes results reproducible. It also creates a trail for diagnosing a failure.

An environment check is not proof that the task is correct. It is a check that you are working on the intended materials under known conditions.

## Prefer small, inspectable changes

A large change is difficult to review because several decisions are mixed together. A safer pattern is to separate the work into visible increments:

1. Read the input.
2. Check its structure.
3. Validate and convert values.
4. Apply the selection rule.
5. Calculate the result.
6. Print or save the evidence.

After each increment, inspect an output. A row count, list of column names, or small sample can reveal a mistake before it affects the final result. In code, this may mean making one function at a time. In analysis, it may mean checking a filtered table before calculating a statistic.

Small increments also make recovery cheaper. If the fourth step is wrong, you can return to the last known-good result instead of reconstructing the entire task.

## Verification needs several signals

A program running without an error is not proof that it is correct. An analysis producing a plausible number is not proof either. Verification should combine different kinds of evidence.

**Tests** check rules automatically. For example, a test can confirm that a cancelled order is not included in the completed-order calculation.

**Data checks** examine the input and intermediate results. You might count missing identifiers, compare the number of rows before and after filtering, list the selected order IDs, or check that amounts are nonnegative.

**Direct evidence** is an output that a person can inspect: a printed summary, a saved report, or a few manually verified records. Direct evidence helps catch errors that a narrow automated test does not cover.

These checks should be tied to the question. If the task concerns completed orders, verify both the status rule and the selected IDs. If it concerns a percentage, show the numerator and denominator. A check is most useful when it makes the reasoning visible.

## Separate facts, assumptions, and decisions

Analysis often includes choices that are not contained in the data. For instance, a blank amount might be excluded, treated as zero, or reported as an error. None of these choices should be hidden.

Write down:

- **Facts:** what the input actually contains.
- **Assumptions:** what you decided when the input was ambiguous.
- **Decisions:** which rule you applied and why.
- **Limitations:** what the result does not establish.

This separation prevents an assumption from being mistaken for a fact. It also makes the work easier for another person to review or reproduce.

## Use the right numeric representation

The example uses `Decimal` for money. A binary floating-point number such as `float` is useful for many measurements, but some decimal fractions cannot be represented exactly in binary. Repeated calculations can then display small rounding differences. `Decimal` represents decimal values more directly, which makes it a sensible choice for currency examples.

This does not remove the need for a policy about rounding. Decide whether the final result should be rounded to cents, and state that decision. Do not round every intermediate value unless the task requires it.

## Recover instead of improvising

When code fails, pause and classify the failure. Is the input missing? Is the format different from expected? Is there a syntax or logic error? Did the environment stop responding? Each type calls for a different response.

Keep the original input unchanged. Save the last known-good command and output. Change one thing at a time. If a change makes the result worse, revert it rather than adding another change on top. For analysis, write cleaned data to a separate output. For code, use a separate working copy or a small reversible edit.

A failure is useful when it tells you something specific. “The file was not found” narrows the problem to the path or working directory. “The expected column is missing” tells you the input contract was not met. Record that information instead of hiding it.

The goal is not to eliminate all mistakes. The goal is to make mistakes limited, visible, and recoverable.

---