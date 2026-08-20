"""Validate and summarize a bounded order CSV task."""

import argparse
import csv
import sys
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path


REQUIRED_COLUMNS = {"order_id", "status", "amount"}


def read_orders(path):
    """Read rows and validate the complete input contract."""
    file_path = Path(path)

    if not file_path.is_file():
        raise ValueError(f"Input file not found: {path}")

    try:
        with file_path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)

            if reader.fieldnames is None:
                raise ValueError("Input has no header row")

            missing = REQUIRED_COLUMNS - set(reader.fieldnames)
            if missing:
                names = ", ".join(sorted(missing))
                raise ValueError(f"Missing required column(s): {names}")

            rows = list(reader)
    except UnicodeDecodeError as error:
        raise ValueError(
            "Input is not UTF-8 text; use the supplied UTF-8 CSV or convert the file"
        ) from error
    except OSError as error:
        raise ValueError(f"Could not read input file: {error}") from error

    for row_number, row in enumerate(rows, start=2):
        order_id = (row.get("order_id") or "").strip()
        status = (row.get("status") or "").strip().lower()
        amount_text = (row.get("amount") or "").strip()

        if not order_id:
            raise ValueError(f"Row {row_number}: order_id is blank")
        if not status:
            raise ValueError(f"Row {row_number}: status is blank")
        if not amount_text:
            raise ValueError(f"Row {row_number}: amount is blank")

        try:
            amount = Decimal(amount_text)
        except InvalidOperation as error:
            raise ValueError(
                f"Row {row_number}: amount is not a valid decimal: {amount_text!r}"
            ) from error

        if amount < 0:
            raise ValueError(f"Row {row_number}: amount cannot be negative")

        row["_order_id"] = order_id
        row["_status"] = status
        row["_amount"] = amount

    return rows


def summarize(rows):
    """Apply the selection rule and return inspectable results."""
    completed = [
        row for row in rows
        if row["_status"] == "completed"
    ]

    total = sum((row["_amount"] for row in completed), Decimal("0"))
    count = len(completed)

    if count == 0:
        raise ValueError("No completed orders were found")

    average = (total / Decimal(count)).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    return {
        "rows_read": len(rows),
        "completed": completed,
        "excluded": len(rows) - count,
        "average": average,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Validate and summarize completed orders."
    )
    parser.add_argument("--input", required=True, help="CSV file to inspect")
    parser.add_argument(
        "--check-only",
        action="store_true",
        help="Validate structure and rows without calculating an average",
    )
    args = parser.parse_args()

    try:
        rows = read_orders(args.input)
        print("Columns: amount, order_id, status")
        print(f"Rows read: {len(rows)}")
        print("Checks: passed")

        if args.check_only:
            return 0

        result = summarize(rows)
        ids = ", ".join(row["_order_id"] for row in result["completed"])
        print(f"Completed order IDs: {ids}")
        print(f"Completed orders: {len(result['completed'])}")
        print(f"Excluded rows: {result['excluded']}")
        print(f"Average completed amount: {result['average']}")
        return 0

    except (ValueError, OSError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

## Example failure

Copy the input before editing it:

cp orders.csv orders-invalid.csv

Or on Windows:

copy orders.csv orders-invalid.csv

Change one amount in `orders-invalid.csv` to `-10.00`, then run:

python order_summary.py --input orders-invalid.csv

Expected failure:

Error: Row 2: amount cannot be negative

The row number may differ depending on which row you edit. The original `orders.csv` should remain unchanged.