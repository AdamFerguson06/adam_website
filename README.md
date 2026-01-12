# Adam Ferguson - Portfolio Website

Interactive portfolio website featuring a pannable Manhattan map with clickable landmarks. Built as a single-page React application and deployed on Netlify.

## Live Site

[adamferg.com](https://adamferg.com)

## Features

### Interactive Map
- Pannable/zoomable Manhattan background with touch support on mobile
- Clickable landmark hotspots linking to portfolio sections
- Hover effects synchronize between navigation and map landmarks (desktop)
- Star icon highlights all landmarks on click (desktop)

### Portfolio Sections
- **About Me** - Bio with expandable "Read More" section and career summary
- **Projects** - Work history organized by company with expandable accordions
  - Skill-based filtering with multi-select dropdown and search
  - Expand All / Collapse All toggle
  - Mobile-optimized layout
- **Contact** - Email links and Calendly scheduling integration

### Companies Featured
- Falcon Media (Co-Founder, 2025 - Present)
- EverQuote (Consultant, 2024 - 2025)
- O Positiv (Senior Manager, Data & Analytics, 2023 - 2024)
- Koalafi (Manager of Sales Analytics, 2021 - 2022)
- EverQuote (Sr. Quantitative Analyst, 2018 - 2020)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - Lightweight state management
- **Framer Motion** - Animations and transitions
- **CSS Variables** - Theming and responsive design

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── LeftPanel/      # Profile sidebar with portrait
│   ├── RightPanel/     # Navigation menu
│   ├── Map/            # Landmark components
│   └── Modal/          # Content modals (About, Projects, Contact)
├── data/
│   └── projects.js     # Landmark positions and metadata
├── store/
│   └── useMapStore.js  # Zustand state management
└── App.jsx             # Main app with map container
```

## Deployment

Deployed on Netlify with SPA redirects configured in `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`

## Design Notes

- Map landmark positions are based on Figma design dimensions (1000x1019px)
- Dynamic scaling calculates ratio between rendered map size and design size
- Mobile breakpoint at 768px for navigation, 540px for modal content
- Inter font family loaded via index.html
