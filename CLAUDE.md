# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive portfolio website built as a single-page React application featuring a pannable/zoomable Manhattan map with clickable landmarks. Deployed on Netlify.

**Live at:** https://adamferg.com

## Truth Seeking (CRITICAL)
**Always start from objective truth, not from what the user wants to hear.**

Core behaviors:
- **Don't let user input bias analysis** - If user suggests something, still evaluate it objectively, don't just build a case for it
- **Surface uncertainty** - Call out small sample sizes, missing data, assumptions that could be wrong
- **Be precise** - Say "3 of 5 tasks complete" not "good progress"
- **Challenge assumptions** - Even the user's, especially the user's
- **Admit when you don't know** - Don't fill gaps with confident-sounding guesses
- **Lead with truth, then user decides** - Give the honest assessment first; user will say if context changes the decision

After pushing back with the truth, user may say "okay, move forward anyway" - that's fine. They may have context you don't. But never skip the truth-seeking step.

**Hard rule:** When the user suggests changing analysis, conclusions, or evidence rankings, ALWAYS state your independent assessment BEFORE making any edits. Never edit first, assess second. If you disagree, say so. Only proceed with the edit after the user has heard your pushback and confirmed they want to proceed anyway.

## Sample Size Discipline (CRITICAL)
**This is a small account (~45 clicks/day). Never draw concrete conclusions from insufficient data.**

Core behaviors:
- **State the sample size alongside every metric** - "17.4% CR (4/23 clicks)" not just "17.4% CR"
- **Flag when samples are too small for conclusions** - A single day's data (20-50 clicks) has wide confidence intervals. Don't treat daily swings as trends.
- **Require minimum thresholds before recommending action:**
  - Daily metrics: Directional only. Never recommend changes based on one day.
  - 3-5 day trends (150-250 clicks): Preliminary signal. Worth monitoring, not acting on.
  - 7+ day trends (300+ clicks): Actionable with caveats noted.
  - 14+ day trends (600+ clicks): Reliable for decisions.
- **Weekend data is especially thin** - Saturday/Sunday volume drops 50%+. Always call this out, never treat weekend-only data as representative.
- **Calculate and show confidence intervals** for key comparisons (use Wilson interval for proportions with small n).
- **When the user wants to act on thin data, say so** - Give the honest sample size assessment first. The user may have business context that justifies acting anyway, but never skip the warning.

Failure mode to avoid: Treating a 3-day, 85-click recovery trend the same as a 10-day, 400-click trend. Both show direction, but only the latter supports concrete decisions.

## Fact Verification (CRITICAL)
**Before stating dates, times, or facts in documents, VERIFY them.**

This is non-negotiable:
- **Run `git log`** to verify merge/commit dates before writing them in documents
- **Check file timestamps** with `ls -la` or `stat` when dates matter
- **Never assume conversational timing equals actual timing** - "we just discussed this" does NOT mean "this happened today"
- **If you cannot verify, say so explicitly** - Write "I cannot verify this date - please confirm" rather than guessing

Failure mode to avoid: Treating conversation flow as a source of truth for real-world timelines. Always check the actual data.


## Context Gathering (CRITICAL)
**Proactively ask for context before answering, one question at a time, until you have enough to give the best possible answer.**

Core behaviors:
- **Evaluate every input** - For each message, ask yourself "do I have enough context to answer this well?"
- **Ask like a McKinsey partner** - What would a world-class consultant need to know to solve this problem?
- **One question at a time** - Build context incrementally, not with a barrage of questions
- **Follow-up as needed** - Answers may reveal more uncertainty; keep asking until clarity is reached
- **Always run this process** - Even small things may need context
- **Don't ask unnecessary questions** - If you genuinely have enough context, proceed

The flow:
1. User asks something
2. Evaluate: "Do I have enough context?"
3. If no → Ask one clarifying question
4. User answers → May reveal more gaps
5. Repeat until clarity is reached
6. Then provide answer/recommendation

## Git Workflow

**Never push directly to `main`.** Always follow this workflow:

1. Checkout a new branch from up-to-date main:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-branch-name
   ```

2. Make changes and verify build passes:
   ```bash
   npm run build
   ```

3. **Run tests and lint before committing** (CRITICAL - CI will fail otherwise):
   ```bash
   npm test -- --run    # Run tests (non-watch mode)
   npm run lint         # Check for lint errors
   ```
   - Fix any failing tests or lint errors before proceeding
   - Warnings are acceptable, but errors must be resolved
   - If tests fail, investigate and fix the root cause

4. **Before committing: Check documentation** (CRITICAL for Claude Code continuity)
   - Review which docs in `docs/` folder might be affected by your changes
   - Update existing docs if behavior, configuration, or architecture changed
   - Create new docs if adding a major feature or integration
   - Reference the Documentation section below for guidance on when to update

5. **Before committing: Update MEMORY.md** with any new knowledge from this session:
   - Architectural decisions made and why
   - Bugs found and their root causes
   - New patterns or conventions established
   - Gotchas discovered that would save time next session
   - Keep entries concise. For detailed notes, create topic files (e.g., `memory/debugging.md`) and link from MEMORY.md.

6. Commit and push to the branch:
   ```bash
   git add -A
   git commit -m "Your commit message"
   git push -u origin feature/your-branch-name
   ```

7. The repository owner will open a PR and merge manually after reviews pass.

**PR assignments:** Always assign `AdamFerguson06` on every PR created with `gh pr create`.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

## Architecture

### State Management
- **Zustand Store** (`src/store/useMapStore.js`): Central state for map interactions, modal control, and navigation hover states
  - Position/pan state for map dragging
  - Scale/zoom state (range: 0.5x to 3x)
  - Modal state for landmark interactions
  - Hover state for nav-landmark synchronization (desktop only)
  - Highlight all landmarks state (triggered by desktop star click for 2 seconds)

### Component Hierarchy
- **App.jsx**: Main container handling map pan/zoom logic, touch events, and responsive behavior
  - **LeftPanel**: Profile section with Ghibli portrait and bio
  - **RightPanel**: Navigation menu (slides in from right on mobile)
  - **Map Container**: Manhattan background image with positioned landmarks
    - **Landmark**: Individual clickable hotspots with Wikipedia links
  - **Modal**: Section content overlay with expandable descriptions and contact info

### Key Implementation Details

**Map Positioning System**:
- Landmarks use absolute positioning based on Figma design dimensions (1000x1019px), defined as `DESIGN_WIDTH`/`DESIGN_HEIGHT` constants in `App.jsx`
- Dynamic scaling calculates ratio between rendered map size and design size
- Position values in `src/data/projects.js` correspond to exact Figma coordinates

**Mobile vs Desktop Behavior**:
- Mobile (≤768px): Touch-to-pan map, shooting star menu button, swipe gestures
- Desktop: Static map, hover effects on landmarks, nav-landmark synchronization, star click highlights all landmarks for 2 seconds

**Touch Event Handling**:
- Custom touch handlers prevent dragging when interacting with landmarks
- Modal close behavior includes debouncing to prevent accidental reopening
- Scroll hint appears on mobile until first swipe interaction

## Deployment

Deployed on Netlify with SPA redirects configured in `netlify.toml`. Build command: `npm run build`, publish directory: `dist`.

## Asset Structure

- `/public/map_images/`: Map background and landmark images
- `/public/Shooting Start.png`: Mobile menu button
- Fonts: Inter (loaded via index.html)

## Data Configuration

Landmarks are defined in `src/data/projects.js` with:
- Position coordinates (left, top) from Figma design
- Dimensions (width, height) for click areas
- Navigation targets linking to modal sections
- Wikipedia URLs for additional information
- Tooltip labels displayed on hover

Modal section content is defined in `src/components/Modal/Modal.jsx` in the `sectionContent` object:
- Each section (about, projects, contact, misc, xg) has title, description, and link configuration
- About section includes expandable `longDescription` and "See My Work" navigation
- Contact section includes `contactInfo` object with email addresses and calendar link