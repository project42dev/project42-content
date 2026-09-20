#!/usr/bin/env python3
import argparse
import json
import math
from pathlib import Path

REQUIRED = {
    "beta",
    "policy_chosen",
    "reference_chosen",
    "policy_rejected",
    "reference_rejected",
}


def compute(case):
    missing = REQUIRED - set(case)
    if missing:
        raise ValueError("missing fields: " + ", ".join(sorted(missing)))
    values = {}
    for name in REQUIRED:
        value = case[name]
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{name} must be a number")
        value = float(value)
        if not math.isfinite(value):
            raise ValueError(f"{name} must be finite")
        values[name] = value
    beta = values["beta"]
    if beta <= 0:
        raise ValueError("beta must be finite and greater than zero")
    chosen_ratio = values["policy_chosen"] - values["reference_chosen"]
    rejected_ratio = values["policy_rejected"] - values["reference_rejected"]
    chosen_reward = beta * chosen_ratio
    rejected_reward = beta * rejected_ratio
    margin = chosen_reward - rejected_reward
    loss = math.log1p(math.exp(-abs(margin))) + max(-margin, 0.0)
    return {
        "chosen_ratio": round(chosen_ratio, 6),
        "chosen_reward": round(chosen_reward, 6),
        "loss": round(loss, 6),
        "margin": round(margin, 6),
        "rejected_ratio": round(rejected_ratio, 6),
        "rejected_reward": round(rejected_reward, 6),
        "reward_accuracy": 1.0 if margin > 0 else 0.0,
    }


def main():
    parser = argparse.ArgumentParser(description="Compute one DPO arithmetic case using only the Python standard library.")
    parser.add_argument("case")
    parser.add_argument("--key")
    args = parser.parse_args()
    case = json.loads(Path(args.case).read_text(encoding="utf-8"))
    result = compute(case)
    print(json.dumps(result, sort_keys=True))
    if args.key:
        key = json.loads(Path(args.key).read_text(encoding="utf-8"))
        if result != key:
            raise SystemExit("FAIL: result does not match key")
        print("PASS: result matches key")


if __name__ == "__main__":
    main()
