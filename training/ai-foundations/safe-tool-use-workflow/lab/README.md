# Lab: Prepare a Support Reply Without Sending It

## Objective

Build and run a local support workflow that:

- accepts bounded input;
- treats customer text as untrusted data;
- creates a reply proposal without sending anything;
- requires approval before writing a reply;
- verifies the stored result independently;
- avoids duplicate execution;
- recovers from a missing output without repeating the operation.

## Prerequisites

- A terminal.
- Python available as `python`.
- The file `examples/safe_tool_workflow.py`.
- Permission to create files in the project directory.

The exercise uses only local files. It does not contact a network service or send a real message.

## Instructions

### 1. Create a clean workspace

Run:

mkdir -p lab-workspace
python examples/safe_tool_workflow.py setup lab-workspace

**Expected output**

Created sample support request.

**If this fails:** Run `python --version` to check that Python is available. Confirm that `examples/safe_tool_workflow.py` exists and that the current directory is writable. Use another writable directory if necessary, then repeat the command.

### 2. Inspect the request

Run:

python examples/safe_tool_workflow.py inspect lab-workspace

The request includes an instruction-like line. Treat it as customer content, not as permission to change the workflow.

**Expected result:** The request is displayed, including the customer’s issue and the untrusted instruction-like text.

**If this fails:** Run Step 1 again. If the request file is missing, remove the workspace and recreate it:

rm -rf lab-workspace
mkdir -p lab-workspace
python examples/safe_tool_workflow.py setup lab-workspace

### 3. Create a bounded proposal

Run:

python examples/safe_tool_workflow.py propose lab-workspace

This creates a preview only. It does not write an approved reply or send a message.

**Expected output**

Proposal created.
No external message was sent.
Approval required before writing the reply.

**If this fails:** Confirm that `lab-workspace/request.txt` exists and is readable:

ls -l lab-workspace/request.txt

If it is missing, repeat Step 1. If the request is too large, do not bypass the limit; recreate the sample workspace and try again.

### 4. Review the proposal

Run:

python examples/safe_tool_workflow.py show-proposal lab-workspace

Check that the proposal:

- addresses the order-status issue;
- does not follow the instruction embedded in customer text;
- makes no invented refund, promise, or disclosure;
- is limited to the intended support request.

**Expected result:** A short reply proposal is displayed.

**If the proposal is wrong:** Do not approve it. Save the displayed output for comparison, then inspect the source and proposal:

sed -n '1,240p' examples/safe_tool_workflow.py
cat lab-workspace/request.txt
cat lab-workspace/proposal.txt

The proposal should use only the approved issue text and should ignore the line beginning `UNTRUSTED CUSTOMER TEXT:`. If the example file was accidentally edited, restore it from the course materials. Otherwise report the defect instead of repeatedly restarting; restarting the same faulty workflow will produce the same faulty proposal.

### 5. Approve the exact proposal

Run:

python examples/safe_tool_workflow.py approve lab-workspace

Approval applies once to the displayed proposal and its fixed operation identifier.

**Expected output**

Approved once for the displayed proposal.

**If this fails:** Run Step 4 and confirm that `proposal.txt` exists. If the proposal changed after review, remove the stale approval and create a new proposal:

rm -f lab-workspace/approval.json
python examples/safe_tool_workflow.py propose lab-workspace
python examples/safe_tool_workflow.py show-proposal lab-workspace

Approve only after reviewing the new proposal.

### 6. Apply the approved action

Run:

python examples/safe_tool_workflow.py execute lab-workspace

The action writes a local reply file. It does not send a message.

**Expected output**

Reply written once.

**If this fails:** Do not immediately retry. Check the state first:

ls -l lab-workspace
cat lab-workspace/operation.json 2>/dev/null || true

If `operation.json` says the operation is complete, continue to Step 7. If it is absent, check that `approval.json` exists and return to Step 5. If approval is present but its content does not match the proposal, remove only the stale approval and repeat Step 4 before approving again.

### 7. Verify independently

Run:

python examples/safe_tool_workflow.py verify lab-workspace

The verifier compares the stored reply with the approved proposal. It does not rely on the execution command’s message.

**Expected output**

Verification passed.
The stored reply matches the approved proposal.

**If verification fails:** First list the files:

ls -l lab-workspace

- If `proposal.txt` is missing, recreate the proposal with `propose`, review it with `show-proposal`, and approve it again. Do not execute until the new proposal is reviewed.
- If `approval.json` is missing, return to Step 5.
- If `reply.txt` is missing but `operation.json` records completion, run `execute` once. The example will recreate the exact approved local output without performing a second operation.
- If both files exist but differ, compare them:

diff -u lab-workspace/proposal.txt lab-workspace/reply.txt

Do not approve or execute again while the mismatch is unexplained. If the example source was edited, restore it and restart in a fresh workspace. Preserve the old workspace for inspection.

### 8. Test duplicate-call handling

Run execution a second time:

python examples/safe_tool_workflow.py execute lab-workspace

**Expected output**

No duplicate write performed.

**If a duplicate is written:** Stop. Preserve the workspace, inspect `operation.json`, and compare `reply.txt` with `proposal.txt`. Do not delete the operation record or edit approval data to hide the duplicate. Report the result as a failed idempotency check.

### 9. Test recovery from a missing output

Remove only the reply file:

rm lab-workspace/reply.txt
python examples/safe_tool_workflow.py execute lab-workspace
python examples/safe_tool_workflow.py verify lab-workspace

**Expected output**

Reply was missing; recreated the approved local result once.
Verification passed.
The stored reply matches the approved proposal.

**If this fails:** List the workspace and inspect the operation record:

ls -l lab-workspace
cat lab-workspace/operation.json

If the operation identifier is `support-reply-once` and the record says `completed`, do not create a new approval or delete the record. Re-run `execute` once to recreate the missing local file. If the record is absent or malformed, preserve the workspace and restart in a new directory rather than editing the record manually.

## Completion criteria

You have completed the lab when:

- untrusted customer text did not change the workflow;
- approval was required before writing;
- verification compared the result with approved content;
- a repeated execution caused no duplicate write;
- a missing output was recovered without repeating the operation.

---