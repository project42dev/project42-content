#!/usr/bin/env python3
import argparse
import csv
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

METRIC_COLUMNS = {
    "step", "loss", "logps_chosen", "logps_rejected", "rewards_chosen",
    "rewards_rejected", "rewards_margin", "rewards_accuracy", "gradient_norm"
}
GENERATION_FIELDS = {
    "beta", "comparison_id", "distribution", "expected_answer", "judge",
    "judge_policy_first", "judge_reference_first", "policy_length_chars",
    "policy_output", "prompt", "reference_length_chars", "reference_output",
    "seed", "swap_consistent", "temperature", "verdict"
}
HUMAN_COLUMNS = {
    "comparison_id", "beta", "temperature", "seed", "distribution", "prompt",
    "policy_output", "reference_output", "policy_first_human_label",
    "reference_first_human_label", "adjudicated_label", "reviewer_id", "notes"
}
LABELS = {"policy", "reference", "tie"}
REPORT_VERDICTS = {"win", "tie", "loss"}
META_FIELDS = ("beta", "temperature", "seed", "distribution", "prompt", "policy_output", "reference_output")


def finite_float(value, name):
    try:
        number = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{name} must be numeric")
    if not math.isfinite(number):
        raise ValueError(f"{name} must be finite")
    return number


def strict_int(value, name):
    if isinstance(value, bool):
        raise ValueError(f"{name} must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError):
        raise ValueError(f"{name} must be an integer")
    if str(value).strip() not in {str(number), f"{number}.0"}:
        raise ValueError(f"{name} must be an integer")
    return number


def parse_metric_specs(specs):
    parsed = []
    seen = set()
    for spec in specs:
        if "=" not in spec:
            raise ValueError("each --metrics value must have the form BETA=PATH")
        beta_text, path_text = spec.split("=", 1)
        beta = finite_float(beta_text, "metrics beta")
        if beta <= 0:
            raise ValueError("metrics beta must be greater than zero")
        key = format(beta, ".15g")
        if key in seen:
            raise ValueError(f"duplicate metrics beta: {key}")
        seen.add(key)
        parsed.append((beta, Path(path_text)))
    if not parsed:
        raise ValueError("at least one --metrics BETA=PATH value is required")
    return parsed


def read_metrics(specs):
    result = {}
    for beta, path in parse_metric_specs(specs):
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            if reader.fieldnames is None or set(reader.fieldnames) != METRIC_COLUMNS:
                raise ValueError(f"{path}: metrics columns do not match the required schema")
            rows = []
            seen_steps = set()
            for line_number, raw in enumerate(reader, 2):
                step = strict_int(raw["step"], f"{path}:{line_number}:step")
                if step <= 0 or step in seen_steps:
                    raise ValueError(f"{path}:{line_number}: step must be positive and unique")
                seen_steps.add(step)
                row = {"step": step}
                for field in METRIC_COLUMNS - {"step"}:
                    row[field] = finite_float(raw[field], f"{path}:{line_number}:{field}")
                rows.append(row)
        if not rows:
            raise ValueError(f"{path}: metrics file is empty")
        rows.sort(key=lambda item: item["step"])
        result[format(beta, ".15g")] = rows
    return result


def _producer_label(value, path, line_number, field):
    if type(value) is not str or value not in LABELS:
        raise ValueError(f"{path}:{line_number}: invalid {field}: expected policy, reference, or tie")
    return value


def _report_verdict(producer_verdict):
    return {"policy": "win", "reference": "loss", "tie": "tie"}[producer_verdict]


def read_generations(path):
    records = []
    by_id = {}
    with Path(path).open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                raw = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{line_number}: invalid JSON: {exc.msg}")
            if not isinstance(raw, dict):
                raise ValueError(f"{path}:{line_number}: each generation must be an object")
            missing = GENERATION_FIELDS - set(raw)
            if missing:
                raise ValueError(f"{path}:{line_number}: missing fields: {', '.join(sorted(missing))}")
            comparison_id = raw["comparison_id"]
            if not isinstance(comparison_id, str) or not comparison_id:
                raise ValueError(f"{path}:{line_number}: comparison_id must be a nonempty string")
            if comparison_id in by_id:
                raise ValueError(f"duplicate generation comparison_id: {comparison_id}")
            for field in ("distribution", "judge", "policy_output", "prompt", "reference_output"):
                if not isinstance(raw[field], str):
                    raise ValueError(f"{path}:{line_number}:{field} must be a string")
            raw["beta"] = finite_float(raw["beta"], f"{path}:{line_number}:beta")
            raw["temperature"] = finite_float(raw["temperature"], f"{path}:{line_number}:temperature")
            raw["seed"] = strict_int(raw["seed"], f"{path}:{line_number}:seed")
            raw["policy_length_chars"] = strict_int(raw["policy_length_chars"], f"{path}:{line_number}:policy_length_chars")
            raw["reference_length_chars"] = strict_int(raw["reference_length_chars"], f"{path}:{line_number}:reference_length_chars")
            if raw["policy_length_chars"] != len(raw["policy_output"]):
                raise ValueError(f"{path}:{line_number}: policy_length_chars does not match output")
            if raw["reference_length_chars"] != len(raw["reference_output"]):
                raise ValueError(f"{path}:{line_number}: reference_length_chars does not match output")
            if type(raw["swap_consistent"]) is not bool:
                raise ValueError(f"{path}:{line_number}: swap_consistent must be boolean")
            forward = _producer_label(raw["judge_policy_first"], path, line_number, "judge_policy_first")
            reverse = _producer_label(raw["judge_reference_first"], path, line_number, "judge_reference_first")
            verdict = _producer_label(raw["verdict"], path, line_number, "verdict")
            derived_consistent = forward == reverse
            if raw["swap_consistent"] != derived_consistent:
                raise ValueError(f"{path}:{line_number}: swap_consistent does not match judge labels")
            expected_verdict = forward if derived_consistent else "tie"
            if verdict != expected_verdict:
                raise ValueError(f"{path}:{line_number}: verdict does not match producer judge labels")
            raw["effective_verdict"] = _report_verdict(verdict if derived_consistent else "tie")
            records.append(raw)
            by_id[comparison_id] = raw
    if not records:
        raise ValueError(f"{path}: generations file is empty")
    return records, by_id


def metadata_equal(field, human_value, generation_value):
    if field in {"beta", "temperature"}:
        return finite_float(human_value, field) == generation_value
    if field == "seed":
        return strict_int(human_value, field) == generation_value
    return human_value == generation_value


def read_humans(path, generations_by_id):
    rows = []
    seen = set()
    with Path(path).open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None or set(reader.fieldnames) != HUMAN_COLUMNS:
            raise ValueError(f"{path}: human-label columns do not match the required schema")
        for line_number, raw in enumerate(reader, 2):
            comparison_id = raw["comparison_id"]
            if not comparison_id:
                raise ValueError(f"{path}:{line_number}: blank comparison_id")
            if comparison_id in seen:
                raise ValueError(f"duplicate human comparison_id: {comparison_id}")
            seen.add(comparison_id)
            if comparison_id not in generations_by_id:
                raise ValueError(f"unknown human comparison_id: {comparison_id}")
            generation = generations_by_id[comparison_id]
            for field in META_FIELDS:
                try:
                    equal = metadata_equal(field, raw[field], generation[field])
                except ValueError as exc:
                    raise ValueError(f"{path}:{line_number}:{field}: {exc}")
                if not equal:
                    raise ValueError(f"mutated comparison metadata for {comparison_id}: {field}")
            for field in ("policy_first_human_label", "reference_first_human_label", "adjudicated_label"):
                label = raw[field].strip()
                if label and label not in LABELS:
                    raise ValueError(f"{path}:{line_number}: invalid {field}: {label}")
                raw[field] = label
            rows.append(dict(raw))
    return rows


def mean_or_none(values):
    return sum(values) / len(values) if values else None


def summarize(metrics, generations, humans):
    grouped = defaultdict(list)
    for record in generations:
        key = (format(record["beta"], ".15g"), format(record["temperature"], ".15g"), record["distribution"])
        grouped[key].append(record)
    group_summaries = []
    for key in sorted(grouped):
        records = grouped[key]
        counts = {name: 0 for name in REPORT_VERDICTS}
        winner_lengths = []
        loser_lengths = []
        for record in records:
            verdict = record["effective_verdict"]
            counts[verdict] += 1
            if verdict == "win":
                winner_lengths.append(record["policy_length_chars"])
                loser_lengths.append(record["reference_length_chars"])
            elif verdict == "loss":
                winner_lengths.append(record["reference_length_chars"])
                loser_lengths.append(record["policy_length_chars"])
        consistent = sum(1 for record in records if record["swap_consistent"])
        group_summaries.append({
            "beta": float(key[0]), "temperature": float(key[1]), "distribution": key[2],
            "total": len(records), "win": counts["win"], "tie": counts["tie"], "loss": counts["loss"],
            "swap_consistent_count": consistent, "swap_consistency_rate": consistent / len(records),
            "average_policy_length_chars": mean_or_none([r["policy_length_chars"] for r in records]),
            "average_reference_length_chars": mean_or_none([r["reference_length_chars"] for r in records]),
            "average_winning_answer_length_chars": mean_or_none(winner_lengths),
            "average_losing_answer_length_chars": mean_or_none(loser_lengths),
        })
    labelled = [row for row in humans if row["adjudicated_label"]]
    human_to_verdict = {"policy": "win", "reference": "loss", "tie": "tie"}
    generation_by_id = {row["comparison_id"]: row for row in generations}
    matches = 0
    labelled_records = []
    for row in labelled:
        generation = generation_by_id[row["comparison_id"]]
        agrees = human_to_verdict[row["adjudicated_label"]] == generation["effective_verdict"]
        matches += int(agrees)
        labelled_records.append({
            "comparison_id": row["comparison_id"],
            "policy_first_human_label": row["policy_first_human_label"],
            "reference_first_human_label": row["reference_first_human_label"],
            "adjudicated_label": row["adjudicated_label"], "reviewer_id": row["reviewer_id"], "notes": row["notes"],
            "judge_raw_verdict": generation["verdict"], "judge_swap_consistent": generation["swap_consistent"],
            "judge_effective_verdict": generation["effective_verdict"], "agreement": agrees,
        })
    denominator = len(labelled)
    total = len(generations)
    return {
        "schema": "project42.dpo_report.v1",
        "training": {beta: {"rows": len(rows), "first_step": rows[0]["step"], "last_step": rows[-1]["step"], "rendered_fields": ["logps_chosen", "logps_rejected", "rewards_margin"]} for beta, rows in sorted(metrics.items(), key=lambda item: float(item[0]))},
        "evaluation": {"total": total, "groups": group_summaries, "swap_inconsistency_policy": "preserve the raw verdict and count the effective verdict as tie"},
        "human_agreement": {
            "scope": "sample agreement on nonblank adjudicated labels only; not a population claim",
            "labelled_count": denominator, "total": total, "coverage": denominator / total if total else None,
            "agreement_count": matches, "agreement_denominator": denominator,
            "agreement": matches / denominator if denominator else None,
            "status": "OBSERVED_SAMPLE" if denominator else "UNKNOWN", "raw_labelled_records": labelled_records,
        },
    }


def write_summary(metrics_specs, generations_path, human_path, out_path):
    metrics = read_metrics(metrics_specs)
    generations, by_id = read_generations(generations_path)
    humans = read_humans(human_path, by_id)
    summary = summarize(metrics, generations, humans)
    out = Path(out_path)
    out.mkdir(parents=True, exist_ok=True)
    destination = out / "report_summary.json"
    destination.write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return summary, destination


def safe_beta(beta):
    return re.sub(r"[^0-9A-Za-z]+", "p", beta).strip("p")


def render_plots(metrics_specs, out_path):
    metrics = read_metrics(metrics_specs)
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError as exc:
        raise RuntimeError("Matplotlib is required only for plotting. Install it with: python -m pip install -r requirements-reporting.txt") from exc
    out = Path(out_path)
    out.mkdir(parents=True, exist_ok=True)
    written = []
    for beta, rows in sorted(metrics.items(), key=lambda item: float(item[0])):
        figure, axes = plt.subplots(3, 1, figsize=(8, 9), sharex=True, constrained_layout=True)
        steps = [row["step"] for row in rows]
        axes[0].plot(steps, [row["logps_chosen"] for row in rows], color="tab:blue", label="chosen")
        axes[0].set_ylabel("chosen log-probability")
        axes[1].plot(steps, [row["logps_rejected"] for row in rows], color="tab:orange", label="rejected")
        axes[1].set_ylabel("rejected log-probability")
        axes[2].plot(steps, [row["rewards_margin"] for row in rows], color="tab:green", label="reward margin")
        axes[2].axhline(0.0, color="black", linewidth=0.8)
        axes[2].set_ylabel("reward margin")
        axes[2].set_xlabel("training step")
        for axis in axes:
            axis.grid(True, alpha=0.3)
            axis.legend(loc="best")
        figure.suptitle(f"DPO training curves, beta={beta}")
        stem = out / f"training_curves_beta_{safe_beta(beta)}"
        for extension in ("png", "svg"):
            path = stem.with_suffix("." + extension)
            figure.savefig(path, dpi=160 if extension == "png" else None)
            written.append(path)
        plt.close(figure)
    return written


def build_parser():
    parser = argparse.ArgumentParser(description="Validate and report DPO run outputs.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    summary_parser = subparsers.add_parser("summary", help="write a standard-library JSON summary")
    summary_parser.add_argument("--metrics", action="append", required=True, metavar="BETA=PATH")
    summary_parser.add_argument("--generations", required=True)
    summary_parser.add_argument("--human", required=True)
    summary_parser.add_argument("--out", required=True)
    plot_parser = subparsers.add_parser("plot", help="write standalone PNG and SVG training curves")
    plot_parser.add_argument("--metrics", action="append", required=True, metavar="BETA=PATH")
    plot_parser.add_argument("--out", required=True)
    return parser


def main():
    args = build_parser().parse_args()
    try:
        if args.command == "summary":
            summary, path = write_summary(args.metrics, args.generations, args.human, args.out)
            print(json.dumps({"report": str(path), "labelled_count": summary["human_agreement"]["labelled_count"], "total": summary["human_agreement"]["total"], "agreement": summary["human_agreement"]["agreement"], "status": summary["human_agreement"]["status"]}, sort_keys=True))
        else:
            paths = render_plots(args.metrics, args.out)
            print(json.dumps({"plots": [str(path) for path in paths]}, sort_keys=True))
    except (OSError, ValueError, RuntimeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)


if __name__ == "__main__":
    main()
