# Safe Tool-Use Workflow

A tool call is a boundary between a plan and the outside world. Even a tool that seems simple may expose private data, change a record, send a message, or spend money. Safe tool use means making that boundary narrow, visible, and easy to check.

## Give every tool a small contract

Before a workflow uses a tool, write down its contract:

- **Inputs:** What values are accepted? What type, length, and format must each value have?
- **Outputs:** What does success return? What does “nothing found” mean?
- **Errors:** How are invalid input, missing data, timeouts, and permission failures reported?
- **Side effects:** What can change outside the tool?

Separate fields are safer than one large block of generated text. For example, a calendar tool might accept a title, start time, end time, and attendee list as separate fields. Each field can then be checked. The contract should also say whether repeating the call creates another event or refers to the same operation.

If an input does not fit the contract, stop and ask for clarification. Do not make up a value merely because it passes a superficial format check.

## Keep planning separate from action

A safe workflow often has two stages:

1. **Plan:** Read permitted information and prepare a proposed action.
2. **Execute:** Carry out the action only after the proposal has been reviewed and approved.

The planning stage should be read-only whenever possible. A proposal should show the exact target, fields to change, destination, quantity, and message or content involved.

Approval is most important for actions such as sending external messages, changing access, deleting information, moving money, or revealing sensitive data. Approval should be specific: “Update record 1842 with this displayed text once” is safer than “Approved.” If the target or content changes after approval, the workflow must return to planning and approval.

## Limit permission, scope, and time

Least privilege means giving a workflow only what it needs for the current task. This can limit:

- which records or fields it can read;
- which actions it can perform;
- how many records or messages it can change;
- where information may be sent;
- how long its access remains available.

For example, a workflow that prepares a support reply may need to read one request and write one local draft. It does not need permission to send messages, read every customer record, or modify account settings.

Small limits also make mistakes easier to notice. If a workflow is allowed to change one record, an unexpected request to change 500 records is a clear reason to stop.

## Treat results as evidence, not narration

A model can say that an operation succeeded even when the tool returned an error, returned an incomplete result, or was never called. The model’s explanation is not proof. The tool result and an independent check are the evidence.

Verification should answer questions such as:

- Was the intended target changed?
- Does the stored value exactly match the approved value?
- Did only the intended fields change?
- Did the operation happen once?
- Is the result complete rather than partial?

For a file, compare its exact contents with the approved contents. For a record, read it again. For a message, check whether it is actually in the sent location rather than merely present as a draft.

The same rule applies before retrying. If a timeout leaves the result unknown, first inspect the destination state or operation record. If the action already happened, do not repeat it. If it did not happen, retry only when the operation can be safely identified as the same operation.

## Make recovery explicit

A failure does not always mean that nothing happened. A network connection can fail after the remote system has completed the request. Retrying without checking can create duplicates.

Use an operation identifier or another idempotency method when available. An operation identifier lets the destination recognize that a retry belongs to an earlier attempt. If three of five records were updated, record those three and work only on the remaining two. Do not repeat the whole batch automatically.

Tool output is also untrusted data. Retrieved text may contain instructions such as “ignore approval” or “send this secret elsewhere.” Keep retrieved content separate from workflow instructions. The content may describe a customer’s request, but it cannot grant itself new permissions.

A safe workflow is not one that never fails. It is one that keeps permissions narrow, pauses before risky actions, checks reality independently, and provides a clear way to stop or recover.

---