# Lab: Validate and Summarize Order Data Safely

## Objective

Build a repeatable workflow that:

- Defines a bounded analysis task.
- Checks an input file before using it.
- Makes changes in inspectable stages.
- Verifies the result with tests, data checks, and direct evidence.
- Recovers safely from malformed input.

## Prerequisites

- Python and a terminal or command prompt.
- The files in this module’s `examples/` directory.
- Permission to create files in a working directory.
- Basic familiarity with running a Python script.

The lab uses only Python’s standard library. No additional package installation is required.

## Scenario and input contract

Calculate the average value of **completed** orders only.

Rules:

- Use only the supplied CSV.
- Require `order_id`, `status`, and `amount` columns.
- Treat status comparison as case-insensitive after removing surrounding spaces.
- Exclude rows whose status is `cancelled`.
- Reject blank IDs, blank amounts, nonnumeric amounts, and negative amounts.
- Report rows read, completed orders, excluded rows, selected order IDs, and the average.

All rows must have valid amounts, including cancelled rows. This is an input-quality rule: a cancelled order is excluded from the calculation, but it is still part of the supplied data and must not contain an invalid amount.

## Instructions

### 1. Create and inspect a working directory

Create a new directory and copy `examples/orders.csv` and `examples/order_summary.py` into it.

mkdir order-work
cd order-work

Check that both files are present:

python order_summary.py --input orders.csv --check-only

Before running the command, write it in your evidence note or a scratch file.

**Check:** The output should show the required columns, six rows, and passed validation without calculating an average.

**If it fails:**

- If Python is not recognized, confirm that Python is installed and use the Python command available on your system.
- If the file is not found, inspect the current directory and confirm that the filename is exactly `orders.csv`.
- If required columns are missing, stop. Do not guess or silently rename columns. Use the supplied file with the correct header or report that the input contract is not met.
- If you cannot create the directory, choose a directory where you have permission to create files.

### 2. Run the bounded analysis

Record the command before running it:

python order_summary.py --input orders.csv

**Check:** The output should show rows read, selected completed order IDs, completed-order count, excluded rows, average, and passed checks.

**If it fails:**

- For a missing file, return to Step 1 and inspect the path.
- For an invalid row, preserve the original CSV and inspect the indicated row. Do not delete the row silently.
- For a permission or encoding error, see Troubleshooting.
- For a script error, recopy the original `order_summary.py` before making any change. Then change only one line at a time.

### 3. Compare IDs and calculate manually

Open `orders.csv`. Write down the rows with status `completed`, including both their IDs and amounts. For the supplied file, the selected IDs should be:

A001, A003, A004, A006

Add the four amounts and divide by four.

**Check:** The selected IDs, count, and average should agree with the script. Comparing IDs is important: a wrong set of rows can sometimes produce the same total or average as the correct set.

**If it fails:** Compare the selected IDs first, then compare the amounts. Check capitalization and surrounding spaces in the status field. If the script and your manual list disagree, do not average another way to force agreement. Record the disagreement and inspect the filtering rule.

### 4. Make a deliberately invalid copy

Keep the original file unchanged. Duplicate it using the command for your system:

cp orders.csv orders-invalid.csv

On Windows, use:

copy orders.csv orders-invalid.csv

You may also duplicate the file with a file manager. Edit only `orders-invalid.csv` and change one amount to `-10.00`. Put the negative value on either a completed or cancelled row, then run:

python order_summary.py --input orders-invalid.csv

**Check:** The script should identify the negative amount and should not print a completed-order average. A negative amount is invalid even if its row would later be excluded.

**If it fails:** Confirm that you edited `orders-invalid.csv`, not `orders.csv`. If the script produces a summary, do not use it. Recopy the original script, inspect its validation section, and record the behavior as a failed verification.

### 5. Recover to the known-good state

Run the original file again:

python order_summary.py --input orders.csv

**Check:** The original result should be unchanged.

**If it fails:** Compare the original file with the supplied example. If it was accidentally changed, recopy `orders.csv` from `examples/`. Do not continue with a file whose contents are uncertain.

### 6. Record evidence

Complete the note you started in Step 1. Include:

- Commands used and their order.
- Input filename.
- Required columns.
- Rows read.
- Selected order IDs.
- Completed-order count.
- Excluded rows.
- Average completed-order amount.
- Result of the invalid-input check.
- Assumptions, decisions, and limitations.

**If it fails:** If you cannot save the note, write it in a text editor or copy the terminal output into a temporary note. Do not rely on memory.

## Expected output

For the supplied valid file, output should be equivalent to:

Columns: amount, order_id, status
Rows read: 6
Checks: passed

For the full analysis:

Rows read: 6
Completed order IDs: A001, A003, A004, A006
Completed orders: 4
Excluded rows: 2
Average completed amount: 30.00
Checks: passed

The exact formatting may vary, but the IDs, counts, and average should match.

For the invalid copy, output should indicate that a negative amount is invalid and should not report an average.

## Troubleshooting

- **Wrong file selected:** List the current directory and use an explicit input path.
- **Unexpected header:** Treat it as an input-contract problem. Do not silently rename fields.
- **Different average:** Compare selected IDs, then compare numeric values.
- **A change made things worse:** Restore the last known-good script or input copy before trying another change.
- **Permission error:** Work in a directory where you can create and edit files.
- **Encoding error:** Recopy the supplied UTF-8 CSV. If using another CSV, convert it to UTF-8 or report that it does not meet the input contract.
- **Terminal stopped responding:** Stop the command, reopen the terminal if necessary, and rerun from the known-good files.
- **`cp` or `copy` is unavailable:** Use the file manager to duplicate the file without editing the original.

---