# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive portfolio website built as a single-page React application featuring a pannable/zoomable Manhattan map with clickable landmarks. Deployed on Netlify.

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

### Component Hierarchy
- **App.jsx**: Main container handling map pan/zoom logic, touch events, and responsive behavior
  - **LeftPanel**: Profile section with Ghibli portrait and bio
  - **RightPanel**: Navigation menu (slides in from right on mobile)
  - **Map Container**: Manhattan background image with positioned landmarks
    - **Landmark**: Individual clickable hotspots with Wikipedia links
  - **Modal**: Project/location details overlay

### Key Implementation Details

**Map Positioning System**:
- Landmarks use absolute positioning based on Figma design dimensions (1000x1019px), defined as `DESIGN_WIDTH`/`DESIGN_HEIGHT` constants in `App.jsx`
- Dynamic scaling calculates ratio between rendered map size and design size
- Position values in `src/data/projects.js` correspond to exact Figma coordinates

**Mobile vs Desktop Behavior**:
- Mobile (≤768px): Touch-to-pan map, shooting star menu button, swipe gestures
- Desktop: Static map, hover effects on landmarks, nav-landmark synchronization

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
- Navigation targets linking to LeftPanel sections
- Wikipedia URLs for additional information
- Tooltip labels displayed on hover