import unittest
from copy import deepcopy

from adapter_exercise import (
    AdapterA, AdapterB, ContractError, cutover_gate, fixture_cases,
    paired_results, rollback_exercise,
)
from adapter_answer import (
    ChangedAdapter, changed_fixture, changed_transport_response,
    expected_changed,
)


class ChangedRequirementTests(unittest.TestCase):
    def assert_contract_code(self, code, function, *args):
        with self.assertRaises(ContractError) as caught:
            function(*args)
        self.assertEqual(caught.exception.code, code)

    def test_original_fails_changed_requirement(self):
        self.assert_contract_code("MALFORMED_SHAPE", AdapterB().map_request, changed_fixture())

    def test_separate_answer_passes_changed_requirement(self):
        adapter = ChangedAdapter()
        request = changed_fixture()
        before = deepcopy(request)
        mapped = adapter.map_request(request)
        self.assertEqual(mapped["label"], "confidential_account_recovery")
        self.assertIs(mapped["confidential"], True)
        self.assertEqual(request, before)
        self.assertEqual(adapter.normalize_response(changed_transport_response(), request), expected_changed())

    def test_changed_answer_preserves_original_cases(self):
        adapter = ChangedAdapter()
        for case in fixture_cases():
            self.assertEqual(adapter.map_request(case["request"]), AdapterB().map_request(case["request"]))
            self.assertEqual(adapter.normalize_response(case["transportB"], case["request"]), case["expected"])

    def test_changed_contract_negative_cases(self):
        adapter = ChangedAdapter()
        request = changed_fixture()
        response = changed_transport_response()
        cases = [
            ("unknown request field", "MALFORMED_SHAPE", adapter.map_request, ({**request, "tools": []},)),
            ("missing request field", "MALFORMED_SHAPE", adapter.map_request, ({k: v for k, v in request.items() if k != "requestId"},)),
            ("malformed request container", "MALFORMED_SHAPE", adapter.map_request, ([request],)),
            ("nonbool confidential integer", "INVALID_CONFIDENTIAL_FLAG", adapter.map_request, ({**request, "confidential": 1},)),
            ("nonbool confidential string", "INVALID_CONFIDENTIAL_FLAG", adapter.map_request, ({**request, "confidential": "true"},)),
            ("unauthorized source category", "INVALID_CATEGORY", adapter.map_request, ({**request, "category": "confidential_account_recovery"},)),
            ("confidential nonrecovery", "INVALID_ESCALATION", adapter.map_request, ({**request, "category": "billing"},)),
            ("wrong response request identity", "IDENTITY_MISMATCH", adapter.normalize_response, ({**response, "id": "wrong"}, request)),
            ("wrong response artifact identity", "IDENTITY_MISMATCH", adapter.normalize_response, ({**response, "model_id": "wrong"}, request)),
            ("missing escalation", "INVALID_ESCALATION", adapter.normalize_response, ({**response, "label": "account_recovery"}, request)),
            ("wrong confidential response flag", "INVALID_CONFIDENTIAL_FLAG", adapter.normalize_response, ({**response, "confidential": False}, request)),
            ("nonbool response flag", "INVALID_CONFIDENTIAL_FLAG", adapter.normalize_response, ({**response, "confidential": 1}, request)),
            ("unknown response field", "MALFORMED_SHAPE", adapter.normalize_response, ({**response, "extra": 1}, request)),
            ("missing response field", "MALFORMED_SHAPE", adapter.normalize_response, ({k: v for k, v in response.items() if k != "model_id"}, request)),
            ("empty response explanation", "INVALID_EXPLANATION", adapter.normalize_response, ({**response, "description": "  "}, request)),
        ]
        for name, code, function, args in cases:
            with self.subTest(name=name):
                self.assert_contract_code(code, function, *args)

    def test_gate_and_rollback_negative_cases(self):
        rows = paired_results()
        evidence = "operator-reviewed:synthetic-fixture:negative-case review"
        gate_cases = [
            ("missing paired case", rows[:-1], {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0}, 0.05, evidence),
            ("duplicate paired case", rows + [deepcopy(rows[0])], {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0}, 0.05, evidence),
            ("missing latency metric", rows, {"baseline": 10}, {"baseline": 0, "candidate": 0}, 0.05, evidence),
            ("bool latency", rows, {"baseline": True, "candidate": 11}, {"baseline": 0, "candidate": 0}, 0.05, evidence),
            ("nonfinite latency", rows, {"baseline": 10, "candidate": float("inf")}, {"baseline": 0, "candidate": 0}, 0.05, evidence),
            ("wrong candidate identity", rows, {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0}, 0.05, evidence),
            ("excess canary", rows, {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0}, 0.11, evidence),
            ("missing operator evidence", rows, {"baseline": 10, "candidate": 11}, {"baseline": 0, "candidate": 0}, 0.05, "operator-reviewed:"),
        ]
        for name, paired, latency, errors, canary, operator in gate_cases:
            with self.subTest(name=name):
                candidate_identity = "wrong" if name == "wrong candidate identity" else AdapterB.identity
                self.assertEqual(
                    cutover_gate(paired, AdapterA.identity, candidate_identity, latency, errors, canary, operator).verdict,
                    "HOLD",
                )

        malformed = fixture_cases()
        del malformed[0]["transportA"]
        failed = rollback_exercise(
            AdapterA.identity, AdapterB.identity, malformed, AdapterB.identity, AdapterA()
        )
        self.assertEqual(failed["verdict"], "HOLD")
        self.assertTrue(any(row["status"] == "FAIL" for row in failed["rerun"]))


if __name__ == "__main__":
    unittest.main()
