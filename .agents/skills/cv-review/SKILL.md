---
name: cv-review
description: Run an evidence-based, multi-perspective review of a personal CV, resume website, portfolio CV, or downloadable resume. Use for recruiter scans, technical hiring-manager assessments, copy and cross-format consistency checks, UX/accessibility audits, SEO/performance audits, security/privacy reviews, or a complete pre-deployment CV review. Do not use for implementing findings unless the user explicitly requests changes.
---

# CV Review

Review a CV website through independent hiring, content, experience, discoverability, and risk perspectives. Keep reviewers read-only, synthesize their evidence, and separate review from implementation.

## Establish scope

Infer the narrowest useful mode from the request:

- `quick`: recruiter, technical hiring manager, and content consistency.
- `content`: recruiter, technical hiring manager, and content consistency.
- `experience`: UX/accessibility and SEO/performance.
- `technical`: UX/accessibility, SEO/performance, and security/privacy.
- `full`: all six reviewers.

Ask for a target job description only when role-specific matching is central and none is available. Otherwise continue with the candidate's stated positioning. Never invent, strengthen, or quantify a CV claim without user-provided evidence.

## Collect evidence

Inspect only evidence relevant to the selected mode. Prefer source data over rendered copies when they conflict.

- Read repository instructions and the build configuration.
- Locate canonical CV data, rendered pages/components, metadata, deployment configuration, and the downloadable PDF.
- Inspect current git changes when the review targets a patch.
- Run read-only validation or browser checks when useful and available.
- Distinguish source evidence, rendered behavior, automated-test output, and inference.
- Record missing evidence instead of guessing.

## Route reviewers

Give each reviewer the same scope, target role if provided, and evidence boundary. Require it to read [report-contract.md](references/report-contract.md) plus its own rubric.

| Reviewer                       | Rubric                                                                |
| ------------------------------ | --------------------------------------------------------------------- |
| `recruiter-reviewer`           | [recruiter.md](references/recruiter.md)                               |
| `technical-hiring-manager`     | [technical-hiring-manager.md](references/technical-hiring-manager.md) |
| `content-consistency-reviewer` | [content-consistency.md](references/content-consistency.md)           |
| `ux-accessibility-reviewer`    | [ux-accessibility.md](references/ux-accessibility.md)                 |
| `seo-performance-reviewer`     | [seo-performance.md](references/seo-performance.md)                   |
| `security-privacy-reviewer`    | [security-privacy.md](references/security-privacy.md)                 |

Run independent reviewers concurrently when the harness supports it. Use small batches when concurrency is limited. Do not let reviewers edit files, post messages, or silently broaden the review.

## Synthesize

Read [report-contract.md](references/report-contract.md) before combining results.

1. Reject findings without concrete evidence or a reproducible observation.
2. Merge duplicates while preserving the strongest evidence.
3. Identify genuine disagreements between hiring, design, and technical perspectives.
4. Prioritize shortlist risk and factual inconsistency before polish.
5. Separate confirmed defects from recommendations and missing information.
6. Return a concise decision-ready backlog, not six concatenated reports.

Do not convert subjective taste into a defect. Do not optimize keywords at the cost of truth, readability, or accessibility.

## Implement only when requested

End after the review unless the user explicitly authorizes changes. When implementation is requested, hand the approved backlog to the `astro-expert` implementation agent, preserve unrelated work, and run the repository's proportional validation commands. Re-run only the reviewers affected by the changes.
