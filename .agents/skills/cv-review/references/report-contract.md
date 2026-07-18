# Review report contract

Use this contract for every reviewer and for the final synthesis.

## Evidence rules

- Cite the file, page, section, element, command output, or URL that supports each finding.
- Label an observation as an inference when direct evidence is unavailable.
- Do not invent candidate facts, target-role requirements, measurements, browser results, or search-engine behavior.
- Do not report a theoretical concern as a confirmed defect.
- Report missing or conflicting evidence explicitly.

## Severity

- `P0 Blocker`: prevents access, creates material deception, or presents an immediate serious security/privacy risk.
- `P1 High`: likely harms shortlisting, credibility, accessibility, indexing, or core task completion.
- `P2 Medium`: meaningful issue with limited scope or a clear quality improvement.
- `P3 Low`: polish or optional optimization with modest expected impact.

Reserve P0 and P1 for findings with strong evidence. A reviewer may return no findings.

## Reviewer output

Return:

1. `Verdict`: one or two sentences from the assigned perspective.
2. `Findings`: at most seven, ordered by severity and impact.
3. `Strengths`: up to three items that should be preserved.
4. `Unknowns`: only information that could materially change the verdict.

For each finding include:

- Severity and short title.
- Evidence with a precise location.
- Why it matters to this reviewer.
- Smallest defensible recommendation.
- Confidence: high, medium, or low.

Do not edit files. Do not pad the report to reach seven findings.

## Final synthesis

Return:

1. Overall readiness: ready, ready with minor changes, needs revision, or blocked by missing evidence.
2. The five most important actions across all perspectives.
3. Additional findings grouped by perspective.
4. Conflicts or tradeoffs that require a human decision.
5. A verification plan for any approved changes.
