import unittest
from copy import deepcopy

from adapter_exercise import (
    AdapterA, AdapterB, BrokenCandidate, ContractError, MATRIX, _number,
    check_fixture_ids, cutover_gate, fixture_cases, paired_results,
    rollback_exercise,
)


class OriginalContractTests(unittest.TestCase):
    def test_both_fictional_mappings_and_normalized_outputs(self):
        for case in fixture_cases():
            request_before = deepcopy(case["request"])
            a = AdapterA()
            b = AdapterB()
            self.assertEqual(set(a.map_request(case["request"])), {"ticket_id", "kind", "reason", "artifact"})
            self.assertEqual(set(b.map_request(case["request"])), {"id", "label", "description", "model_id"})
            self.assertEqual(case["request"], request_before)
            self.assertEqual(a.normalize_response(case["transportA"], case["request"]), case.get("expectedA", case["expected"]))
            self.assertEqual(b.normalize_response(case["transportB"], case["request"]), case["expected"])

    def test_unsupported_and_malformed_inputs_fail_closed(self):
        request = fixture_cases()[0]["request"]
        bad_inputs = [
            {**request, "tools": []},
            {k: v for k, v in request.items() if k != "requestId"},
            {**request, "requestId": ""},
            {**request, "category": ["billing"]},
            {**request, "category": "Billing"},
            {**request, "explanation": "  "},
        ]
        for bad in bad_inputs:
            with self.subTest(bad=bad):
                with self.assertRaises(ContractError):
                    AdapterA().map_request(bad)
        with self.assertRaises(ContractError) as caught:
            AdapterA().normalize_response(
                {"ticket_id": "r-1", "kind": "billing", "reason": "x", "artifact": "wrong"}, request
            )
        self.assertEqual(caught.exception.code, "IDENTITY_MISMATCH")

    def test_matrix_is_completed(self):
        self.assertEqual(len(MATRIX), 6)
        joined = " ".join(str(cell) for row in MATRIX for cell in row)
        for behavior in ("required", "transformed", "rejected", "unavailable"):
            self.assertIn(behavior, joined)

    def test_fixture_ids_and_metrics_are_strict(self):
        cases = fixture_cases()
        check_fixture_ids(cases)
        with self.assertRaises(ContractError) as caught:
            check_fixture_ids(cases + [deepcopy(cases[0])])
        self.assertEqual(caught.exception.code, "DUPLICATE_FIXTURE_ID")
        for value in (True, float("inf"), float("nan"), 10 ** 400, "10"):
            with self.subTest(value=repr(value)):
                with self.assertRaises(ContractError):
                    _number(value, "latency")

    def test_cutover_corrected_is_offline_only(self):
        result = cutover_gate(
            paired_results(), AdapterA.identity, AdapterB.identity,
            {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0},
            0.05, "operator-reviewed:synthetic-fixture:reviewed in class",
        )
        self.assertEqual(result.verdict, "OFFLINE_ELIGIBLE")
        self.assertIn("not deployment authorization", result.reason)

    def test_cutover_holds_on_consequential_regression(self):
        rows = paired_results()
        rows[0]["candidate"]["normalized"]["modelArtifactId"] = "wrong"
        result = cutover_gate(
            rows, AdapterA.identity, AdapterB.identity,
            {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0},
            0.05, "operator-reviewed:synthetic-fixture:reviewed in class",
        )
        self.assertEqual(result.verdict, "HOLD")
        with self.assertRaises(ContractError):
            BrokenCandidate().normalize_response(fixture_cases()[0]["transportB"], fixture_cases()[0]["request"])

    def test_rollback_really_reruns_restored_adapter(self):
        result = rollback_exercise(
            AdapterA.identity, AdapterB.identity, fixture_cases(), AdapterB.identity, AdapterA()
        )
        self.assertEqual(result["verdict"], "OFFLINE_ELIGIBLE")
        self.assertEqual(result["restored"], AdapterA.identity)
        self.assertEqual([row["status"] for row in result["rerun"]], ["PASS", "PASS", "PASS"])


if __name__ == "__main__":
    unittest.main()
