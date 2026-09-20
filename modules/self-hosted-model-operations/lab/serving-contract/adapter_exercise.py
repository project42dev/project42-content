"""Runnable offline contract exercise for two explicitly fictional adapters.

Nothing in this file contacts or qualifies a real model server. Fixed transport
responses and measurements are synthetic fixtures.
"""
from copy import deepcopy
from dataclasses import dataclass
import json
import math

CATEGORIES = frozenset({"billing", "technical", "account_recovery", "access"})
REQUEST_FIELDS = frozenset({"requestId", "category", "explanation", "modelArtifactId"})


class ContractError(Exception):
    """A contract failure with a stable machine-readable category."""

    def __init__(self, code: str, message: str):
        if not isinstance(code, str) or not code:
            raise ValueError("ContractError code must be a nonempty string")
        super().__init__(message)
        self.code = code
        self.message = message


def _error(code, message):
    raise ContractError(code, message)


def _exact_object(value, fields, label):
    if type(value) is not dict:
        _error("MALFORMED_SHAPE", label + " must be a plain object")
    if set(value) != set(fields):
        _error("MALFORMED_SHAPE", label + " fields must be exactly " + repr(sorted(fields)))


def validate_request(value):
    """Validate and copy the four-field application-owned request contract."""
    _exact_object(value, REQUEST_FIELDS, "request")
    if not isinstance(value["requestId"], str) or not value["requestId"]:
        _error("MISSING_ID", "requestId must be a nonempty string")
    category = value["category"]
    if not isinstance(category, str) or category not in CATEGORIES:
        _error("INVALID_CATEGORY", "category must exactly match an allowed value")
    explanation = value["explanation"]
    if not isinstance(explanation, str) or not explanation.strip():
        _error("INVALID_EXPLANATION", "explanation must be nonempty after trimming")
    if not isinstance(value["modelArtifactId"], str) or not value["modelArtifactId"]:
        _error("MISSING_ID", "modelArtifactId must be a nonempty string")
    return deepcopy(value)


def validate_response(value, request):
    """Validate normalized output and exact request and artifact identity echoes."""
    request = validate_request(request)
    _exact_object(value, REQUEST_FIELDS, "normalized response")
    if value["requestId"] != request["requestId"]:
        _error("IDENTITY_MISMATCH", "response requestId does not match the request")
    category = value["category"]
    if not isinstance(category, str) or category not in CATEGORIES:
        _error("INVALID_CATEGORY", "response category is not allowed")
    explanation = value["explanation"]
    if not isinstance(explanation, str) or not explanation.strip():
        _error("INVALID_EXPLANATION", "response explanation must be nonempty")
    if value["modelArtifactId"] != request["modelArtifactId"]:
        _error("IDENTITY_MISMATCH", "response modelArtifactId does not match the request")
    return deepcopy(value)


class AdapterA:
    """Fictional adapter A using ticket_id, kind, reason, and artifact."""

    name = "fictional-adapter-a"
    identity = "fictional-a-bundle-1"
    transport_fields = frozenset({"ticket_id", "kind", "reason", "artifact"})

    def map_request(self, request):
        before = deepcopy(request)
        checked = validate_request(request)
        mapped = {
            "ticket_id": checked["requestId"],
            "kind": checked["category"],
            "reason": checked["explanation"],
            "artifact": checked["modelArtifactId"],
        }
        if request != before:
            _error("MUTATION", "request mapping mutated caller-owned input")
        return mapped

    def normalize_response(self, transport, request):
        before = deepcopy(transport)
        _exact_object(transport, self.transport_fields, "Adapter A response")
        normalized = {
            "requestId": transport["ticket_id"],
            "category": transport["kind"],
            "explanation": transport["reason"],
            "modelArtifactId": transport["artifact"],
        }
        result = validate_response(normalized, request)
        if transport != before:
            _error("MUTATION", "response normalization mutated caller-owned input")
        return result


class AdapterB:
    """Fictional adapter B using id, label, description, and model_id."""

    name = "fictional-adapter-b"
    identity = "fictional-b-bundle-1"
    transport_fields = frozenset({"id", "label", "description", "model_id"})

    def map_request(self, request):
        before = deepcopy(request)
        checked = validate_request(request)
        mapped = {
            "id": checked["requestId"],
            "label": checked["category"],
            "description": checked["explanation"].strip(),
            "model_id": checked["modelArtifactId"],
        }
        if request != before:
            _error("MUTATION", "request mapping mutated caller-owned input")
        return mapped

    def normalize_response(self, transport, request):
        before = deepcopy(transport)
        _exact_object(transport, self.transport_fields, "Adapter B response")
        normalized = {
            "requestId": transport["id"],
            "category": transport["label"],
            "explanation": transport["description"].strip()
            if isinstance(transport["description"], str)
            else transport["description"],
            "modelArtifactId": transport["model_id"],
        }
        result = validate_response(normalized, request)
        if transport != before:
            _error("MUTATION", "response normalization mutated caller-owned input")
        return result


class BrokenCandidate(AdapterB):
    """Consequentially flawed candidate that erases the required explanation."""

    name = "fictional-broken-candidate"
    identity = "fictional-broken-bundle-1"

    def normalize_response(self, transport, request):
        altered = deepcopy(transport)
        altered["description"] = ""
        return super().normalize_response(altered, request)


def fixture_cases():
    """Return fixed semantic cases with distinct A and B wire representations."""
    return [
        {
            "fixtureId": "billing-normal",
            "request": {"requestId": "r-1", "category": "billing", "explanation": "charged twice", "modelArtifactId": "artifact-synthetic-1"},
            "transportA": {"ticket_id": "r-1", "kind": "billing", "reason": "charged twice", "artifact": "artifact-synthetic-1"},
            "transportB": {"id": "r-1", "label": "billing", "description": "charged twice", "model_id": "artifact-synthetic-1"},
            "expected": {"requestId": "r-1", "category": "billing", "explanation": "charged twice", "modelArtifactId": "artifact-synthetic-1"},
        },
        {
            "fixtureId": "recovery-normal",
            "request": {"requestId": "r-2", "category": "account_recovery", "explanation": "reset link expired", "modelArtifactId": "artifact-synthetic-1"},
            "transportA": {"ticket_id": "r-2", "kind": "account_recovery", "reason": "reset link expired", "artifact": "artifact-synthetic-1"},
            "transportB": {"id": "r-2", "label": "account_recovery", "description": "reset link expired", "model_id": "artifact-synthetic-1"},
            "expected": {"requestId": "r-2", "category": "account_recovery", "explanation": "reset link expired", "modelArtifactId": "artifact-synthetic-1"},
        },
        {
            "fixtureId": "trim-boundary",
            "request": {"requestId": "r-3", "category": "technical", "explanation": "  application freezes  ", "modelArtifactId": "artifact-synthetic-1"},
            "transportA": {"ticket_id": "r-3", "kind": "technical", "reason": "  application freezes  ", "artifact": "artifact-synthetic-1"},
            "transportB": {"id": "r-3", "label": "technical", "description": "application freezes", "model_id": "artifact-synthetic-1"},
            "expectedA": {"requestId": "r-3", "category": "technical", "explanation": "  application freezes  ", "modelArtifactId": "artifact-synthetic-1"},
            "expected": {"requestId": "r-3", "category": "technical", "explanation": "application freezes", "modelArtifactId": "artifact-synthetic-1"},
        },
    ]


def check_fixture_ids(cases):
    if type(cases) is not list or not cases:
        _error("MALFORMED_SHAPE", "fixtures must be a nonempty list")
    ids = []
    for case in cases:
        if type(case) is not dict:
            _error("MALFORMED_SHAPE", "each fixture must be an object")
        fixture_id = case.get("fixtureId")
        if not isinstance(fixture_id, str) or not fixture_id:
            _error("MALFORMED_SHAPE", "fixtureId must be a nonempty string")
        ids.append(fixture_id)
    if len(ids) != len(set(ids)):
        _error("DUPLICATE_FIXTURE_ID", "fixtureId values must be unique")
    return tuple(ids)


def _number(value, label):
    """Return a finite float, rejecting booleans and integer overflow safely."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        _error("INVALID_METRIC", label + " must be a finite non-boolean number")
    try:
        converted = float(value)
    except (OverflowError, ValueError):
        _error("INVALID_METRIC", label + " is outside the supported finite range")
    if not math.isfinite(converted):
        _error("INVALID_METRIC", label + " must be finite")
    return converted


@dataclass(frozen=True)
class GateResult:
    verdict: str
    reason: str


def _hold(reason):
    return GateResult("HOLD", reason)


def cutover_gate(paired, baseline_identity, candidate_identity, latency, errors,
                 canary_fraction, operator_evidence):
    """Evaluate synthetic offline evidence, never authorize a deployment."""
    try:
        if not isinstance(baseline_identity, str) or not baseline_identity:
            return _hold("baseline identity is missing")
        if not isinstance(candidate_identity, str) or not candidate_identity:
            return _hold("candidate identity is missing")
        expected_cases = {case["fixtureId"]: case for case in fixture_cases()}
        if type(paired) is not list or not paired:
            return _hold("paired cases are missing")
        case_ids = []
        for row in paired:
            if type(row) is not dict or set(row) != {"caseId", "baseline", "candidate"}:
                return _hold("paired case shape is malformed")
            case_id = row["caseId"]
            if not isinstance(case_id, str) or not case_id:
                return _hold("paired case ID is missing")
            case_ids.append(case_id)
            for side_name, required_identity in (("baseline", baseline_identity), ("candidate", candidate_identity)):
                side = row[side_name]
                if type(side) is not dict or set(side) != {"identity", "normalized"}:
                    return _hold("nested paired result shape is malformed")
                if side["identity"] != required_identity:
                    return _hold("critical identity mismatch")
                if type(side["normalized"]) is not dict:
                    return _hold("normalized output is missing")
        if len(case_ids) != len(set(case_ids)):
            return _hold("duplicate paired case IDs")
        if set(case_ids) != set(expected_cases):
            return _hold("paired case coverage is incomplete or unexpected")
        for row in paired:
            case = expected_cases[row["caseId"]]
            baseline_expected = case.get("expectedA", case["expected"])
            candidate_expected = case["expected"]
            baseline_output = row["baseline"]["normalized"]
            candidate_output = row["candidate"]["normalized"]
            validate_response(baseline_output, case["request"])
            validate_response(candidate_output, case["request"])
            if baseline_output != baseline_expected or candidate_output != candidate_expected:
                return _hold("critical normalized-output mismatch")
            if baseline_output["modelArtifactId"] != case["request"]["modelArtifactId"]:
                return _hold("baseline artifact evidence mismatch")
            if candidate_output["modelArtifactId"] != case["request"]["modelArtifactId"]:
                return _hold("candidate artifact evidence mismatch")
        if type(latency) is not dict or set(latency) != {"baseline", "candidate"}:
            return _hold("explicit baseline and candidate latency metrics are required")
        if type(errors) is not dict or set(errors) != {"baseline", "candidate"}:
            return _hold("explicit baseline and candidate error metrics are required")
        baseline_latency = _number(latency["baseline"], "baseline latency")
        candidate_latency = _number(latency["candidate"], "candidate latency")
        baseline_errors = _number(errors["baseline"], "baseline errors")
        candidate_errors = _number(errors["candidate"], "candidate errors")
        canary = _number(canary_fraction, "canary fraction")
        if min(baseline_latency, candidate_latency, baseline_errors, candidate_errors, canary) < 0:
            return _hold("metrics cannot be negative")
        if canary > 0.10:
            return _hold("canary exceeds the offline exercise bound")
        prefix = "operator-reviewed:synthetic-fixture:"
        if not isinstance(operator_evidence, str) or not operator_evidence.startswith(prefix) or not operator_evidence[len(prefix):].strip():
            return _hold("explicit synthetic operator-review evidence is required")
        if candidate_errors > baseline_errors:
            return _hold("candidate error regression")
        if candidate_latency > baseline_latency * 1.5:
            return _hold("candidate latency regression")
    except ContractError as exc:
        return _hold(exc.code + ": " + exc.message)
    return GateResult(
        "OFFLINE_ELIGIBLE",
        "synthetic fixtures passed; this verdict is not deployment authorization",
    )


def paired_results(baseline=None, candidate=None):
    baseline = baseline or AdapterA()
    candidate = candidate or AdapterB()
    rows = []
    for case in fixture_cases():
        baseline_output = baseline.normalize_response(case["transportA"], case["request"])
        candidate_output = candidate.normalize_response(case["transportB"], case["request"])
        rows.append({
            "caseId": case["fixtureId"],
            "baseline": {"identity": baseline.identity, "normalized": baseline_output},
            "candidate": {"identity": candidate.identity, "normalized": candidate_output},
        })
    return rows


def rollback_exercise(previous_ref, candidate_ref, cases, active_ref, restored_adapter):
    """Restore a prior adapter reference and actually rerun the same fixtures."""
    refs = (previous_ref, candidate_ref, active_ref)
    if any(not isinstance(ref, str) or not ref or any(ch.isspace() for ch in ref) for ref in refs):
        return {"verdict": "HOLD", "reason": "bundle references must be nonempty immutable-style tokens", "restored": None, "rerun": []}
    if previous_ref == candidate_ref or active_ref != candidate_ref:
        return {"verdict": "HOLD", "reason": "rollback reference state is invalid", "restored": None, "rerun": []}
    if restored_adapter is None or getattr(restored_adapter, "identity", None) != previous_ref:
        return {"verdict": "HOLD", "reason": "restored adapter identity does not match the prior reference", "restored": None, "rerun": []}
    rerun = []
    case = None
    try:
        check_fixture_ids(cases)
        for case in cases:
            required = {"fixtureId", "request", "transportA", "transportB", "expected"}
            if type(case) is not dict or not required.issubset(case):
                _error("MALFORMED_SHAPE", "rollback fixture is incomplete")
            mapped = restored_adapter.map_request(case["request"])
            if not mapped:
                _error("MALFORMED_SHAPE", "restored adapter produced no request")
            transport_key = "transportA" if isinstance(restored_adapter, AdapterA) else "transportB"
            actual = restored_adapter.normalize_response(case[transport_key], case["request"])
            expected = case.get("expectedA", case["expected"]) if transport_key == "transportA" else case["expected"]
            if actual != expected:
                rerun.append({"fixtureId": case["fixtureId"], "status": "FAIL"})
                return {"verdict": "HOLD", "reason": "restored adapter failed a fixture", "restored": previous_ref, "rerun": rerun}
            rerun.append({"fixtureId": case["fixtureId"], "status": "PASS"})
    except (ContractError, KeyError, TypeError) as exc:
        fixture_id = case.get("fixtureId", "UNKNOWN") if type(case) is dict else "UNKNOWN"
        rerun.append({"fixtureId": fixture_id, "status": "FAIL"})
        return {"verdict": "HOLD", "reason": "rollback fixture rerun failed: " + str(exc), "restored": previous_ref, "rerun": rerun}
    return {"verdict": "OFFLINE_ELIGIBLE", "reason": "prior adapter restored and fixtures rerun; not deployment authorization", "restored": previous_ref, "rerun": rerun}


MATRIX = [
    ("requestId", "required", "ticket_id", "required exact", "id", "required exact"),
    ("category", "required exact", "kind", "required exact", "label", "required exact"),
    ("explanation", "required nonempty", "reason", "required nonempty", "description", "transformed:trim"),
    ("modelArtifactId", "required exact", "artifact", "required verified", "model_id", "required verified"),
    ("tools", "rejected:unsupported", "tools", "rejected:unsupported", "tools", "unavailable:error"),
    ("confidential", "unavailable in original contract", "confidential", "rejected:unsupported", "confidential", "unavailable:error"),
]


def main():
    cases = fixture_cases()
    rows = paired_results()
    corrected = cutover_gate(
        rows, AdapterA.identity, AdapterB.identity,
        {"baseline": 10.0, "candidate": 11.0},
        {"baseline": 0.0, "candidate": 0.0},
        0.05, "operator-reviewed:synthetic-fixture:classroom comparison",
    )
    flawed_rows = deepcopy(rows)
    flawed_rows[0]["candidate"]["normalized"]["category"] = "technical"
    flawed = cutover_gate(
        flawed_rows, AdapterA.identity, AdapterB.identity,
        {"baseline": 10.0, "candidate": 11.0},
        {"baseline": 0.0, "candidate": 0.0},
        0.05, "operator-reviewed:synthetic-fixture:classroom comparison",
    )
    rollback = rollback_exercise(
        AdapterA.identity, AdapterB.identity, cases, AdapterB.identity, AdapterA()
    )
    print("MATRIX_ROWS=" + str(len(MATRIX)))
    print("FIXTURES=" + str(len(cases)) + " ADAPTER_RUNS=" + str(len(cases) * 2) + " PASS")
    print("FLAWED_CANDIDATE=" + flawed.verdict)
    print("CORRECTED_CANDIDATE=" + corrected.verdict)
    print("ROLLBACK=" + rollback["verdict"] + " RERUN=" + str(len(rollback["rerun"])))
    print(json.dumps({"scope": "offline synthetic fictional adapters", "deploymentAuthorization": False}, sort_keys=True))


if __name__ == "__main__":
    main()
