import copy
import json
import tempfile
import unittest
from pathlib import Path

from report_results import read_generations, read_humans, read_metrics, summarize


class ReportingTests(unittest.TestCase):
    def setUp(self):
        self.fixture = json.loads(Path("fixtures/reporting_test.json").read_text(encoding="utf-8"))
        self.key = json.loads(Path("fixtures/reporting_test.key.json").read_text(encoding="utf-8"))
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.metrics_path = self.root / "metrics.csv"
        self.generations_path = self.root / "generations.jsonl"
        self.human_path = self.root / "human.csv"
        self.metrics_path.write_text(self.fixture["metrics"]["0.1"], encoding="utf-8")
        self.generations_path.write_text(self.fixture["generations_jsonl"], encoding="utf-8")
        self.human_path.write_text(self.fixture["human_csv"], encoding="utf-8")

    def tearDown(self):
        self.temp.cleanup()

    def load_generation_index(self):
        return read_generations(self.generations_path)

    def test_positive_agreement_math_uses_canonical_producer_labels(self):
        metrics = read_metrics([f"0.1={self.metrics_path}"])
        generations, by_id = self.load_generation_index()
        humans = read_humans(self.human_path, by_id)
        result = summarize(metrics, generations, humans)
        agreement = result["human_agreement"]
        for field in ("labelled_count", "total", "coverage", "agreement_count", "agreement_denominator", "agreement", "status"):
            self.assertEqual(agreement[field], self.key[field])
        totals = {"win": 0, "tie": 0, "loss": 0}
        for group in result["evaluation"]["groups"]:
            for verdict in totals:
                totals[verdict] += group[verdict]
        self.assertEqual(totals, self.key["effective_totals"])
        c3 = next(row for row in agreement["raw_labelled_records"] if row["comparison_id"] == "c3")
        self.assertEqual(c3["judge_raw_verdict"], "tie")
        self.assertFalse(c3["judge_swap_consistent"])
        self.assertEqual(c3["judge_effective_verdict"], "tie")

    def test_blank_labels_are_not_negative_observations(self):
        metrics = read_metrics([f"0.1={self.metrics_path}"])
        generations, by_id = self.load_generation_index()
        self.human_path.write_text(self.fixture["human_csv"].splitlines()[0] + "\n", encoding="utf-8")
        result = summarize(metrics, generations, read_humans(self.human_path, by_id))
        agreement = result["human_agreement"]
        self.assertEqual(agreement["labelled_count"], 0)
        self.assertEqual(agreement["agreement_denominator"], 0)
        self.assertIsNone(agreement["agreement"])
        self.assertEqual(agreement["status"], "UNKNOWN")

    def test_negative_human_files(self):
        for name, content in self.fixture["negative_human_csv"].items():
            with self.subTest(name=name):
                path = self.root / f"{name}.csv"
                path.write_text(content, encoding="utf-8")
                _, by_id = self.load_generation_index()
                with self.assertRaises(ValueError):
                    read_humans(path, by_id)

    def test_duplicate_generation_id_rejected(self):
        first = self.fixture["generations_jsonl"].splitlines()[0]
        path = self.root / "duplicate_generations.jsonl"
        path.write_text(self.fixture["generations_jsonl"] + first + "\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            read_generations(path)

    def test_invalid_judge_label_rejected(self):
        rows = [json.loads(line) for line in self.fixture["generations_jsonl"].splitlines()]
        rows[0]["judge_policy_first"] = "A"
        path = self.root / "invalid_label.jsonl"
        path.write_text("\n".join(json.dumps(row) for row in rows) + "\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            read_generations(path)

    def test_false_declared_consistency_rejected(self):
        rows = [json.loads(line) for line in self.fixture["generations_jsonl"].splitlines()]
        rows[0]["swap_consistent"] = False
        path = self.root / "false_consistency.jsonl"
        path.write_text("\n".join(json.dumps(row) for row in rows) + "\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            read_generations(path)

    def test_wrong_persisted_verdict_rejected(self):
        rows = [json.loads(line) for line in self.fixture["generations_jsonl"].splitlines()]
        rows[0]["verdict"] = "tie"
        path = self.root / "wrong_verdict.jsonl"
        path.write_text("\n".join(json.dumps(row) for row in rows) + "\n", encoding="utf-8")
        with self.assertRaises(ValueError):
            read_generations(path)


if __name__ == "__main__":
    unittest.main()
