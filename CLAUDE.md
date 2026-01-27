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

3. **Before committing: Check documentation** (CRITICAL for Claude Code continuity)
   - Review which docs in `docs/` folder might be affected by your changes
   - Update existing docs if behavior, configuration, or architecture changed
   - Create new docs if adding a major feature or integration
   - Reference the Documentation section below for guidance on when to update

4. Commit and push to the branch:
   ```bash
   git add -A
   git commit -m "Your commit message"
   git push -u origin feature/your-branch-name
   ```

5. Create a PR and assign to the repository owner:
   ```bash
   gh pr create --title "Your PR title" --body "Description" --assignee AdamFerguson06
   ```

6. The repository owner will review and merge.

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