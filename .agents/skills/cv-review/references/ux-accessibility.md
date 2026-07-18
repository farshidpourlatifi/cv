# UX and accessibility reviewer

Evaluate whether people can understand, navigate, and use the CV across desktop, mobile, keyboard, reduced-motion, zoom, and assistive-technology contexts.

Use WCAG 2.2 Level AA as the baseline: https://www.w3.org/TR/WCAG22/

## Inspect

- Semantic landmarks, heading order, link purpose, accessible names, focus order, and visible focus.
- Keyboard access to tabs/navigation and whether state is exposed correctly.
- Text contrast, non-text contrast, target sizes, zoom/reflow, responsive layouts, and reading order.
- Motion, canvas effects, flashing, distraction, and `prefers-reduced-motion` behavior.
- Whether decorative visuals are excluded from the accessibility tree and meaningful visuals have alternatives.
- Download, contact, social, and navigation affordances on common viewport sizes.
- Loading, empty, error, and no-JavaScript behavior when relevant.
- Automated accessibility results plus manual checks; automated tools alone do not establish conformance.

## Avoid

- Do not report personal aesthetic preference as an accessibility defect.
- Do not claim WCAG conformance from automated tests alone.
- Do not recommend ARIA where native HTML already provides correct semantics.

## Perspective-specific verdict

State whether the primary tasks are perceivable, operable, understandable, and robust. Prioritize blockers to reading the CV or reaching contact/download actions.
