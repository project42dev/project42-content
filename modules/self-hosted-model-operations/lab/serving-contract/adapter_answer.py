"""Complete separate answer for confidential account-recovery escalation.

The original four-field contract remains accepted for backward compatibility.
When the optional extension field is present, it must be a real bool. A true
flag is valid only with account_recovery and must be represented by the exact
confidential_account_recovery transport label.
"""
from copy import deepcopy

from adapter_exercise import (
    AdapterB, CATEGORIES, ContractError, REQUEST_FIELDS, _error,
    validate_request, validate_response,
)

CHANGED_REQUEST_FIELDS = frozenset(set(REQUEST_FIELDS) | {"confidential"})
ESCALATED_CATEGORY = "confidential_account_recovery"


class ChangedAdapter(AdapterB):
    """Corrected fictional Adapter B with strict confidential escalation."""

    name = "fictional-b-changed-answer"
    identity = "fictional-b-changed-bundle-1"

    def _validate_changed_request(self, request):
        if type(request) is not dict:
            _error("MALFORMED_SHAPE", "request must be a plain object")
        fields = set(request)
        if fields not in (set(REQUEST_FIELDS), set(CHANGED_REQUEST_FIELDS)):
            _error("MALFORMED_SHAPE", "request has missing or unknown fields")
        base = {field: deepcopy(request[field]) for field in REQUEST_FIELDS}
        validate_request(base)
        supplied = "confidential" in request
        confidential = request.get("confidential", False)
        if supplied and type(confidential) is not bool:
            _error("INVALID_CONFIDENTIAL_FLAG", "confidential must be a boolean")
        if confidential and base["category"] != "account_recovery":
            _error("INVALID_ESCALATION", "only account_recovery may be confidential")
        return base, supplied, confidential

    def map_request(self, request):
        before = deepcopy(request)
        base, supplied, confidential = self._validate_changed_request(request)
        mapped = super().map_request(base)
        if supplied:
            mapped["confidential"] = confidential
        if confidential:
            mapped["label"] = ESCALATED_CATEGORY
        if request != before:
            _error("MUTATION", "changed request mapping mutated caller input")
        return mapped

    def normalize_response(self, transport, request):
        before = deepcopy(transport)
        base, supplied, confidential = self._validate_changed_request(request)
        if type(transport) is not dict:
            _error("MALFORMED_SHAPE", "changed transport response must be an object")
        expected_fields = set(self.transport_fields) | ({"confidential"} if supplied else set())
        if set(transport) != expected_fields:
            _error("MALFORMED_SHAPE", "changed transport response has missing or unknown fields")
        if supplied and type(transport["confidential"]) is not bool:
            _error("INVALID_CONFIDENTIAL_FLAG", "response confidential must be a boolean")
        if supplied and transport["confidential"] != confidential:
            _error("INVALID_CONFIDENTIAL_FLAG", "response confidential does not match request")
        expected_label = ESCALATED_CATEGORY if confidential else base["category"]
        if transport["label"] != expected_label:
            _error("INVALID_ESCALATION", "response label does not implement the required escalation")
        normalized = {
            "requestId": transport["id"],
            "category": transport["label"],
            "explanation": transport["description"].strip()
            if isinstance(transport["description"], str)
            else transport["description"],
            "modelArtifactId": transport["model_id"],
        }
        if normalized["requestId"] != base["requestId"] or normalized["modelArtifactId"] != base["modelArtifactId"]:
            _error("IDENTITY_MISMATCH", "changed response identity does not match request")
        if not isinstance(normalized["explanation"], str) or not normalized["explanation"].strip():
            _error("INVALID_EXPLANATION", "changed response explanation must be nonempty")
        if confidential:
            if normalized["category"] != ESCALATED_CATEGORY:
                _error("INVALID_ESCALATION", "confidential recovery was not escalated")
        else:
            validate_response(normalized, base)
        if transport != before:
            _error("MUTATION", "changed response normalization mutated caller input")
        return deepcopy(normalized)


def changed_fixture():
    return {
        "requestId": "changed-1",
        "category": "account_recovery",
        "explanation": "recover confidential account",
        "modelArtifactId": "artifact-synthetic-1",
        "confidential": True,
    }


def changed_transport_response():
    return {
        "id": "changed-1",
        "label": ESCALATED_CATEGORY,
        "description": "recover confidential account",
        "model_id": "artifact-synthetic-1",
        "confidential": True,
    }


def expected_changed():
    return {
        "requestId": "changed-1",
        "category": ESCALATED_CATEGORY,
        "explanation": "recover confidential account",
        "modelArtifactId": "artifact-synthetic-1",
    }
