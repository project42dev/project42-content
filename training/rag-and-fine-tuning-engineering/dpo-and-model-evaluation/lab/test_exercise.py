import json
import unittest
from pathlib import Path

from exercise import compute


class ExerciseTests(unittest.TestCase):
    def test_worked_and_changed_keys(self):
        for stem in ("worked_case", "changed_input"):
            case = json.loads(Path(f"fixtures/{stem}.json").read_text(encoding="utf-8"))
            key = json.loads(Path(f"fixtures/{stem}.key.json").read_text(encoding="utf-8"))
            self.assertEqual(compute(case), key)

    def test_nonpositive_and_nonfinite_beta_rejected(self):
        base = {
            "beta": 0.1,
            "policy_chosen": -1.0,
            "reference_chosen": -1.0,
            "policy_rejected": -2.0,
            "reference_rejected": -2.0,
        }
        for beta in (0, -0.1, float("inf")):
            case = dict(base, beta=beta)
            with self.assertRaises(ValueError):
                compute(case)


if __name__ == "__main__":
    unittest.main()
