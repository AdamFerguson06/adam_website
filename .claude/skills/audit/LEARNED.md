# Audit Skill — Learned Lessons

<!-- This file accumulates insights across audit runs. Cap at 50 lines. -->

- (2026-02-25) All 4 agents completed successfully in parallel (~70-110s each). Sonnet model is well-suited for this task — detailed, structured output with file:line evidence.
- (2026-02-25) Accessibility agent found the most critical issues (7 critical) — focus management and dialog semantics are the biggest gaps in this SPA.
- (2026-02-25) Cross-domain overlap was highest between Performance and Code Clarity on Zustand selector patterns — dedup these first during synthesis.
- (2026-02-25) The `isMobile()` pattern appears in 3 agents' findings (Performance, Code Clarity, Architecture) — consolidate as a single P2 finding tagged with all domains.
