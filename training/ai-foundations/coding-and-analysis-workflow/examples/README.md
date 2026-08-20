# Code Examples

These examples demonstrate a bounded data task, staged validation, direct evidence, exact decimal arithmetic for currency, and safe failure handling.

## Setup

Place `order_summary.py` and `orders.csv` in the same directory. Open a terminal in that directory and run:

python order_summary.py --input orders.csv --check-only
python order_summary.py --input orders.csv

No additional packages or configuration files are required.

`--check-only` validates the file structure and every row but does not calculate the average. The full command performs the calculation after validation.

The program uses `Decimal` rather than `float` for amounts. Currency is written in decimal notation, and `Decimal` avoids many small binary floating-point representation surprises. The final result is rounded to two decimal places for display.

## Expected output

Validation-only mode:

Columns: amount, order_id, status
Rows read: 6
Checks: passed

Full mode:

Rows read: 6
Completed order IDs: A001, A003, A004, A006
Completed orders: 4
Excluded rows: 2
Average completed amount: 30.00
Checks: passed

## Common pitfalls

- Running the command from a directory that does not contain the input file.
- Editing the original input while testing an invalid case.
- Treating a successful run as proof that the selected rows are correct.
- Silently accepting missing, blank, or negative amounts.
- Confusing validation-only mode with calculation mode.
- Changing several parts of the program before checking an intermediate result.
- Replacing `Decimal` with `float` without considering currency rounding.