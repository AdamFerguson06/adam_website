---
name: audit
description: Use when the user wants a codebase quality assessment, performance review, code clarity check, accessibility audit, or says "audit", "analyze", "how healthy is this codebase"
---

# Codebase Audit

Run a comprehensive codebase audit using 4 parallel Sonnet subagents. Each agent analyzes one domain, then results are synthesized into a prioritized report.

## Self-Learning

Before executing, read `.claude/skills/audit/LEARNED.md` and apply any lessons found.

## Phase 1: Dispatch

Launch all 4 agents in a **single message** (parallel execution). All use `subagent_type: "general-purpose"` and `model: "sonnet"`. All are **read-only** — no edits, no writes.

### Agent 1 — Performance

```
prompt: |
  You are a performance auditor for a React + Vite portfolio website at /Users/personal/Documents/adam_website.

  ## Task
  Analyze the codebase for performance issues. Focus on asset optimization, React rendering efficiency, bundle size, and loading strategy.

  ## Checks
  1. Use Bash `ls -la` on /public/ and /public/map_images/ — flag any image over 200KB
  2. Check if any images use WebP/AVIF formats or responsive srcset
  3. Use Grep to search for React.memo, useMemo, useCallback across src/
  4. Use Grep to find all useMapStore usage — check if granular selectors are used (good: `useMapStore(s => s.x)`) vs full destructure (bad: `useMapStore()` then destructure)
  5. Use Grep to find lazy() and dynamic import() usage for code splitting
  6. Read src/index.css — check if Google Fonts use render-blocking @import vs preload
  7. Read vite.config.js — check for optimization or image processing plugins
  8. Run `cd /Users/personal/Documents/adam_website && npm run build` via Bash — report chunk sizes from output
  9. Use Grep to search for will-change, transform, and animation in CSS files

  ## Output Format
  Return findings as markdown:

  ### Performance Audit

  #### Critical (blocks Core Web Vitals)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  #### Warning (measurable impact)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  #### Info (best practice gap)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  End with: "X critical, Y warnings, Z info items found."
description: "Audit performance"
```

### Agent 2 — Code Clarity

```
prompt: |
  You are a code clarity auditor for a React portfolio website at /Users/personal/Documents/adam_website.

  ## Task
  Analyze the codebase for maintainability: component size, duplication, magic numbers, dead code, memory leaks, and architectural clarity.

  ## Checks
  1. Read every JSX file in src/ and src/components/ — flag any over 200 lines, deep-dive any over 400 lines
  2. Look for duplicated onTouchEnd/onClick handler patterns (especially in App.jsx and LeftPanel.jsx where identical logic appears in both handlers)
  3. Use Grep to find the number 768 across JS/JSX files — this mobile breakpoint is hardcoded in multiple places
  4. Use Grep to find the number 400 across JS/JSX files — this timeout value is hardcoded in multiple setTimeout calls
  5. Use Grep to find all setTimeout calls and check if each has a matching clearTimeout cleanup (RightPanel.jsx does this correctly with a ref — others may not)
  6. Check which components in src/components/ are NOT imported by any active file (look for Map.jsx, Hotspot.jsx, Nav.jsx)
  7. In Modal.jsx, count distinct responsibilities (data definition, state hooks, event handlers, each render section) — flag if >3
  8. Check if sectionContent data object is defined inline in Modal.jsx vs extracted to a data file
  9. Use Grep to find all useMapStore usage — categorize as selector pattern vs full destructure

  ## Output Format
  Return findings as markdown:

  ### Code Clarity Audit

  #### Critical (actively causes bugs or blocks refactoring)
  - [Finding]: [Evidence with file:line] | [Recommendation] | Effort: [Low/Med/High]

  #### Warning (technical debt accruing)
  - [Finding]: [Evidence with file:line] | [Recommendation] | Effort: [Low/Med/High]

  #### Info (style/convention improvement)
  - [Finding]: [Evidence with file:line] | [Recommendation] | Effort: [Low/Med/High]

  End with: "X critical, Y warnings, Z info items found."
description: "Audit code clarity"
```

### Agent 3 — Accessibility & SEO

```
prompt: |
  You are an accessibility and SEO auditor for a React portfolio website at /Users/personal/Documents/adam_website.

  ## Task
  Analyze for WCAG 2.1 AA compliance and SEO best practices.

  ## Checks
  1. Use Grep to find all aria- attributes across JSX files — assess completeness
  2. Use Grep to find all role= attributes — verify each has matching keyboard event handlers
  3. Use Grep to find onKeyPress (deprecated) — should be onKeyDown instead
  4. Read index.html — check for meta description, OG tags, Twitter cards, viewport, lang attribute
  5. Read src/index.css — extract color values and assess contrast (--text-dark on --bg-color)
  6. Use Grep to find :focus-visible or :focus styles in CSS files
  7. Read Modal.jsx — check if focus is trapped when modal opens and returned when it closes
  8. Use Grep to find all <img tags — check alt text quality (descriptive vs empty vs missing)
  9. Use Grep to find semantic HTML elements (<main, <header, <nav, <section) vs reliance on <div
  10. Check font loading in index.css — @import is render-blocking, preload is preferred

  ## Output Format
  Return findings as markdown:

  ### Accessibility & SEO Audit

  #### Critical (WCAG 2.1 AA violation)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  #### Warning (usability impact)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  #### Info (enhancement opportunity)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  End with: "X critical, Y warnings, Z info items found."
description: "Audit accessibility & SEO"
```

### Agent 4 — Architecture & Resilience

```
prompt: |
  You are an architecture and resilience auditor for a React portfolio website at /Users/personal/Documents/adam_website.

  ## Task
  Analyze for error handling, state management patterns, testing readiness, type safety, and deployment configuration.

  ## Checks
  1. Use Grep to find ErrorBoundary or componentDidCatch — check if any error boundaries exist
  2. Read src/store/useMapStore.js — map the full state shape
  3. Read App.jsx — count useState calls and check which state is passed as props vs could live in Zustand
  4. Check package.json for test framework config and test script
  5. Use Glob to find any test files (*.test.*, *.spec.*, __tests__/)
  6. Check for TypeScript config (tsconfig.json) or PropTypes usage across components
  7. Read netlify.toml — check caching headers cover images in /public/ (not just /assets/*)
  8. Check if _redirects file in public/ conflicts with netlify.toml redirects
  9. Read vite.config.js — check for missing optimization plugins (compression, image processing)
  10. Use Grep to find try/catch or .catch( in any component — assess error handling coverage
  11. Check for .env.example or documented environment variables

  ## Output Format
  Return findings as markdown:

  ### Architecture & Resilience Audit

  #### Critical (app can crash with no recovery)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  #### Warning (fragile pattern)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  #### Info (improvement opportunity)
  - [Finding]: [Evidence with file path] | [Recommendation] | Effort: [Low/Med/High]

  End with: "X critical, Y warnings, Z info items found."
description: "Audit architecture & resilience"
```

## Phase 2: Synthesize

After all 4 agents return, the main agent:

1. **Deduplicates** cross-domain findings (e.g., Zustand selectors flagged by both Performance and Code Clarity become one item tagged with both domains)
2. **Prioritizes** into tiers:
   - **P0 (fix this week)**: Critical items from any agent
   - **P1 (fix this month)**: Warnings that compound or cross domains
   - **P2 (backlog)**: Info items and single-domain warnings
3. **Outputs** the final report:

```markdown
## Codebase Audit — {date}

### Summary
- {N} total findings across 4 domains
- {X} critical, {Y} warnings, {Z} info

### P0 — Fix This Week
| # | Finding | Domain(s) | Effort | Impact |
|---|---------|-----------|--------|--------|

### P1 — Fix This Month
| # | Finding | Domain(s) | Effort | Impact |
|---|---------|-----------|--------|--------|

### P2 — Backlog
| # | Finding | Domain(s) | Effort | Impact |
|---|---------|-----------|--------|--------|

### Domain Scores (1-10)
| Domain | Score | Key Issue |
|--------|-------|-----------|

### Top 3 Recommended Actions
1. [Highest ROI change — what, why, effort]
2. [Second]
3. [Third]
```

## Phase 3: Learn

After outputting the report, check if any new reusable insight was discovered. If so, append ONE line to `.claude/skills/audit/LEARNED.md`:
- Format: `- (YYYY-MM-DD) Specific, actionable lesson.`
- Cap at 50 lines. Merge duplicates, drop entries older than 3 months that never recurred.
