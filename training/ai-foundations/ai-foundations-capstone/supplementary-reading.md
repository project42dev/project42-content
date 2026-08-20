# From an Interesting Idea to a Trustworthy Result

A capstone project is not mainly a test of whether an AI system can produce fluent text. It is a test of whether you can design and supervise a small, useful process. The most important decisions happen before the prompt is written: What problem are you solving? What information may be used? What must remain under human control? How will you know whether the result is good enough?

## Start with a bounded objective

A useful objective is specific enough to finish and inspect. “Use AI to improve our communications” is too broad. “Create a one-page checklist for preparing a weekly team meeting, using the team’s approved agenda template” is bounded.

A bounded objective usually identifies:

- **An audience:** Who will use the result?
- **An artifact:** What will be produced?
- **A source boundary:** Which information may be used?
- **A quality threshold:** What must be true before the result is accepted?
- **A time or size limit:** How large or complex may the result become?

Boundaries prevent a project from quietly expanding. They also make failure easier to recognize. If the objective is vague, almost any output can appear successful.

## Treat authority as a separate question from usefulness

Information can be useful without being authoritative. A search result, an old document, or an AI-generated suggestion may help you think, but it may not be approved for making a decision. Before using a source, ask:

1. Who created or approved it?
2. Is it current enough for this task?
3. Does it apply to this audience or situation?
4. Can the important claim be checked?
5. Are you allowed to use or share it?

For a beginner, an authority limit can be written in plain language. For example: “This document explains the usual steps, but it does not approve requests or replace a current manager’s instruction.” Stating the limit helps prevent a helpful reference from being treated as a final rule.

The same distinction applies to the AI system. It may be authorized to summarize or organize information, but not to make a final decision, send a message, approve an expense, or expose private information. Write these limits down before starting. A human approval step is not a failure of automation; it is part of a safe design.

## Make the workflow reproducible

A reproducible workflow is one another person could follow and understand. Save the objective, source list, prompt or procedure, important settings that are visible to the user, the output, and the checks performed. You do not need a complicated system. A clearly labeled folder or document is often enough.

When planning an instruction, consider including the role and purpose, allowed sources, audience, output format, exclusions, authority limits, acceptance criteria, and a request to mark uncertainty. This is a planning checklist, not a rigid formula. Some tasks are clearer when handled in stages: first extract relevant facts, then organize them, then draft the artifact. The important feature is that the same boundaries and checks remain visible throughout the process.

A prompt is not a guarantee. It is one instruction within a larger workflow. The surrounding checks are what make the result dependable.

## Define acceptance before seeing the output

Acceptance criteria should be observable. “Sounds professional” is difficult to test consistently. “Contains five steps, uses plain language, includes a source note, and does not invent deadlines” is easier to inspect.

Include both positive and negative criteria. Positive criteria describe what the result must contain. Negative criteria describe what it must avoid, such as unsupported claims, private details, unexplained acronyms, or actions outside the system’s authority.

A result can satisfy the format and still be wrong. Check important claims against the original sources. If the result will affect people, money, access, health, safety, or reputation, increase the level of human review.

## Keep an evidence trail

Evidence is the connection between what you did and what you claim. A small evidence record might include:

- The original objective and boundaries
- The source titles, links, or file names
- The prompt or workflow instructions
- The unedited output
- Changes made during review
- Verification notes
- The final approved version
- A record of any failure and recovery

Separate source evidence from output evidence. A source proves where information came from; it does not prove that the output represented it correctly. Verification evidence shows what you checked and what you found by comparing the result with the relevant sources and criteria.

## Plan for failure without hiding it

Failures may occur unexpectedly: a source may be omitted, two claims may be combined, the audience may be misunderstood, or an unsupported statement may sound confident. If a meaningful failure occurs, preserve it and document the recovery. If no meaningful failure occurs naturally, you can test a safe recovery path by temporarily changing one controlled input, such as removing a required source from a copy of the work. Label this as a test rather than presenting it as an accidental failure.

A recovery usually follows this pattern:

- Stop and preserve the failed or test result.
- Identify the exact failure.
- Return to the authoritative source and acceptance criteria.
- Narrow or clarify the instruction.
- Run the revised process.
- Compare the new result with the criteria.
- Record what changed and why.

If review reveals that the artifact could cause harm, expose information, or encourage an unauthorized action, stop. Do not publish or use it merely because the claims appear accurate. Record the hazard, seek appropriate human guidance, and document the tested recovery path if the task can be safely redesigned.

## Present the result as a reasoned decision

Your final presentation should explain more than what the AI produced. Show the objective, the boundaries, the workflow, the evidence, the checks, and the remaining uncertainty. A short demonstration of one failure and its recovery is often more convincing than a claim that everything worked perfectly.

Reflection turns a completed task into reusable learning. Ask: Was the answer correct? Which evidence supports it? What authority limits mattered? Could another person reproduce the process? What would be unsafe to automate? How clearly did I communicate the result?

A trustworthy capstone is not the most impressive-looking output. It is a small result whose purpose, limits, evidence, and review process are clear.

---