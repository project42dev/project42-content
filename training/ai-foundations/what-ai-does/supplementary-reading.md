# What AI Does—and Does Not Do

An AI experience is more than the model behind it. The **model** is the component that generates or transforms information based on patterns it learned during training. It does not actively "detect" patterns at the time you use it; instead, it produces outputs based on statistical relationships it has already learned. The **product** is the larger system that makes that capability useful: it supplies instructions, accepts your input, adds context, retrieves information, applies policies, and may connect to tools or take actions.

This boundary matters because an answer that looks like “the AI’s response” may actually depend on many parts of the product, not just the model.

## Model, product, and agent

A **model** generates outputs—such as text, classifications, summaries, images, or code—based on its training data and the input it receives. It does not inherently know which sources are current, whether a claim is true, or whether an action is safe. Its behavior is shaped by the data it was trained on and the instructions it receives at the time of use.

A **product** wraps the model in a user experience. It may add instructions such as “answer in a friendly tone,” include a document you uploaded, search a collection of information, remember earlier messages, or filter certain requests. When an answer is wrong, the problem might be in the model—or in the product’s instructions, retrieved information, context selection, or policy.

An **agentic system** goes one step further. It can repeat a cycle such as:

1. interpret a goal,
2. decide what to do next,
3. use a tool or retrieve information,
4. inspect the result,
5. continue or finish.

This loop can be useful for multi-step work, but it creates more opportunities for failure. A system can misunderstand the goal, select the wrong information, use a tool incorrectly, or continue after the situation has changed. More autonomy means more need for boundaries, review, and a clear stopping condition.

## A practical verification ladder

Verification should match the stakes. For a low-consequence task, such as brainstorming names, a quick scan may be enough. For a higher-consequence task, such as deciding whether a document meets a legal or safety requirement, you need stronger evidence and often a qualified human review.

Four questions help set the level:

- **Consequence:** What could happen if the output is wrong?
- **Volatility:** How quickly might the relevant information change?
- **Uncertainty:** How difficult is it to tell whether the output is correct?
- **Reversibility:** Can the result be easily undone?

When consequence and uncertainty are high, verify against authoritative sources and use an appropriate reviewer. When information changes quickly, check its date and source. When an action is difficult to undo, require approval before it happens. Verification is not a single activity; it can include checking a source, testing an output, comparing independent evidence, or asking a subject-matter expert.

A useful rule is: **the harder an error is to notice or repair, the stronger the verification should be before use.**

## Common ways AI work fails

Some failures are visible, while others sound confident.

- **Fabrication:** The system supplies a detail, quotation, citation, or event that is not supported by any source.
- **Staleness:** The answer was once reasonable but no longer reflects current information.
- **Scope drift:** The system answers a broader or different question than the one asked.
- **Bias:** The output treats people, groups, or viewpoints unfairly because of data, instructions, or context.
- **Inconsistency:** Similar inputs receive materially different answers without a meaningful reason.
- **Context failure:** The system misses, misreads, or overweights information in the conversation or attached material.
- **Tool uncertainty:** A connected search, calculator, database, or other tool returns incomplete, ambiguous, or incorrect results.
- **Untested code:** Generated code appears plausible but contains defects, unsafe behavior, or assumptions that were never tested.

Each failure mode suggests an evidence check. Look for supporting sources when a claim may be fabricated. Check dates when information may be stale. Restate the scope and compare the response with the original request. Test for fairness using varied examples. Repeat a task to identify inconsistency. Confirm that important context was actually included. Inspect tool results rather than trusting the system’s summary. Run tests and review generated code before using it.

## When to stop

Stopping is a valid result, not a failure. **Prevent** the use of AI outputs when you cannot establish what they are based on, when the task exceeds the system’s reliable scope, or when the potential harm is greater than the benefit of speed. **Stop using** the system if it begins taking actions you cannot review, if evidence conflicts, or if a required expert or approval is unavailable.

You may be able to redesign the task instead: narrow the question, provide better context, use retrieval from an authoritative source, remove permission to take actions, add a human approval step, or use the system only for a low-risk part of the work.

The goal is not to trust AI or reject it completely. The goal is to place the model, product, and any agentic behavior inside a process where people can understand the output, check it, and intervene when necessary.

---