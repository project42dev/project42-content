from copy import deepcopy
import unittest

from adapter_exercise import AdapterA, AdapterB, fixture_cases, rollback_exercise


class RollbackBoundaryTests(unittest.TestCase):
    previous_ref = AdapterA.identity
    candidate_ref = AdapterB.identity
    active_ref = AdapterB.identity

    def call_rollback(self, cases):
        return rollback_exercise(
            self.previous_ref,
            self.candidate_ref,
            cases,
            self.active_ref,
            AdapterA(),
        )

    def assert_malformed_input_is_hold(self, cases):
        before = deepcopy(cases)
        result = self.call_rollback(cases)
        self.assertEqual(result["verdict"], "HOLD")
        self.assertIn("rollback fixture rerun failed:", result["reason"])
        self.assertEqual(result["restored"], self.previous_ref)
        self.assertEqual(result["rerun"], [{"fixtureId": "UNKNOWN", "status": "FAIL"}])
        self.assertEqual(cases, before)

    def test_none_cases_returns_hold_with_failure_evidence(self):
        self.assert_malformed_input_is_hold(None)

    def test_empty_cases_returns_hold_with_failure_evidence(self):
        self.assert_malformed_input_is_hold([])

    def test_scalar_entry_returns_hold_with_failure_evidence(self):
        self.assert_malformed_input_is_hold(["not-a-fixture-object"])

    def test_duplicate_fixture_ids_returns_hold_with_failure_evidence(self):
        cases = fixture_cases()
        cases[1]["fixtureId"] = cases[0]["fixtureId"]
        self.assert_malformed_input_is_hold(cases)

    def test_valid_fixtures_still_rerun_and_do_not_mutate_input(self):
        cases = fixture_cases()
        before = deepcopy(cases)
        result = self.call_rollback(cases)
        self.assertEqual(result, {
            "verdict": "OFFLINE_ELIGIBLE",
            "reason": "prior adapter restored and fixtures rerun; not deployment authorization",
            "restored": self.previous_ref,
            "rerun": [
                {"fixtureId": "billing-normal", "status": "PASS"},
                {"fixtureId": "recovery-normal", "status": "PASS"},
                {"fixtureId": "trim-boundary", "status": "PASS"},
            ],
        })
        self.assertEqual(cases, before)


if __name__ == "__main__":
    unittest.main()
