# Code example: A small source-backed review helper

## Purpose and limits

This example demonstrates a **traceability checklist**, not an automatic meaning checker. It checks whether required source-backed phrases appear, whether disallowed claims appear, whether required distinct points are present, and whether the draft contains repeated sentences.

It cannot determine all meaning changes, tone problems, accessibility problems, or whether a paraphrase is faithful. A person must still compare the draft with the source and apply the brief.

The facts below are deliberately hardcoded for the sample source note. For another source, first make an evidence table and replace the values with the approved points and disallowed claims identified during that review.

## Setup

This example uses Python’s standard library only.

1. Install Python if it is not already available.
2. Save the code below as `transform_check.py`.
3. Run:

python transform_check.py

## Code

"""Run a small traceability review for a source-backed transformation."""

from dataclasses import dataclass
import re


@dataclass
class SourceFacts:
    # These values were taken from the approved sample source note.
    required_phrases: tuple[str, ...]
    # Claims that the source does not establish and the brief disallows.
    forbidden_claims: tuple[str, ...]
    # Distinct points that should appear in the update.
    distinct_points: tuple[str, ...]


def word_count(text: str) -> int:
    """Return a simple word count."""
    return len(re.findall(r"\b[\w'-]+\b", text))


def sentences(text: str) -> list[str]:
    """Split on common sentence-ending punctuation."""
    return [
        part.strip()
        for part in re.split(r"(?<=[.!?])\s+", text.strip())
        if part.strip()
    ]


def review(text: str, facts: SourceFacts) -> list[str]:
    """Return findings; an empty list means this limited check passes."""
    findings: list[str] = []
    lowered = text.lower()

    for phrase in facts.required_phrases:
        if phrase.lower() not in lowered:
            findings.append(f"Missing supported item: {phrase}")

    for claim in facts.forbidden_claims:
        if claim.lower() in lowered:
            findings.append(f"Disallowed claim found: {claim}")

    for point in facts.distinct_points:
        if point.lower() not in lowered:
            findings.append(f"Missing distinct point: {point}")

    seen: set[str] = set()
    for sentence in sentences(text):
        normalized = re.sub(r"\W+", " ", sentence.lower()).strip()
        if normalized in seen:
            findings.append("Repeated sentence detected; check information density.")
        seen.add(normalized)

    return findings


source = SourceFacts(
    required_phrases=(
        "April 3",
        "May 12",
        "2025",
        "three gardens",
        "two gardens",
        "did not establish that drip lines caused the difference",
        "City Horticulture Office",
        "AI assistance was used",
        "a person reviewed",
    ),
    forbidden_claims=(
        "proved that drip lines work",
        "increased crop yields",
        "recommended installing drip lines",
    ),
    distinct_points=(
        "observed watering practices",
        "did not compare crop yields",
    ),
)

transformed_text = """
## Community Garden Water Study

The Community Garden Water Study ran from April 3 through May 12, 2025.
It observed watering practices at three gardens. The study recorded lower
average water use at two gardens after drip lines were installed. It did not
compare crop yields and did not establish that drip lines caused the
difference. Staff from the City Horticulture Office were part of the
observation team. These findings describe this study only; they are not a
recommendation to install drip lines. AI assistance was used to prepare this
update, and a person reviewed the final text.
""".strip()

findings = review(transformed_text, source)

print(f"Word count: {word_count(transformed_text)}")
if findings:
    print("Review findings:")
    for finding in findings:
        print(f"- {finding}")
else:
    print("Review status: PASS")

## Expected output

Word count: 119
Review status: PASS

The example’s text is close to the lab’s 120–160-word range but is intentionally separate from the lab’s exact submission. If you use the helper for the lab, adjust the draft to meet the brief’s word-count requirement and then check it manually.

## Common pitfalls

- **Treating phrase presence as proof of meaning:** A draft can contain every required phrase and still change the claim. Compare each sentence with the evidence table.
- **Assuming the script extracts facts automatically:** The `SourceFacts` values are entered by a person from an approved source. Do not copy facts from memory or an unapproved document.
- **Using a phrase that is too exact:** A faithful paraphrase may not match a required phrase. Treat a missing phrase as a prompt for human review, not automatic proof of failure.
- **Adding forbidden-claim phrases to explain that they are forbidden:** The simple checker may flag them even in a warning. Review the context manually.
- **Ignoring open questions:** If the source does not state a unit, cause, or outcome, do not add one merely to make the text more informative.
- **Relying on the word count:** A target length does not make a draft accurate or useful. Check distinct, supported information and all five review dimensions.
- **Assuming the program checks voice, accessibility, or disclosure quality:** It only checks selected strings and repetition. Apply the brief and ask a human reviewer when a judgment is uncertain.