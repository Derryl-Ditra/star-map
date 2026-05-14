# Agent Handover Guide: Solar System Explorer

This document serves as a technical reference for any agent maintaining or expanding this project.

## 🚀 Deployment Strategy: GitHub Pages (Automated)
This project is configured for **Static Export** and automated deployment via **GitHub Actions**.

### 1. The Workflow
The deployment logic is located in `.github/workflows/deploy.yml`. 
- **Trigger**: Every push to the `main` branch.
- **Process**: Installs dependencies -> `npm run build` -> Uploads `out` folder as an artifact -> Deploys to GitHub Pages environment.
- **Source Setting**: In GitHub Repo Settings > Pages, the **Source** must be set to **GitHub Actions**.

### 2. Path Handling (`basePath`)
Because GitHub Pages hosts the project at `/[repo-name]/` (e.g., `/star-map/`), the app must handle a dynamic base path.
- **Config**: `next.config.ts` uses `basePath: process.env.NODE_ENV === 'production' ? '/star-map' : ''`.
- **Assets**: All internal asset references (Images, Audio) in `page.tsx` must use the `BASE_PATH` constant.
  - *Example*: `new Audio(`${BASE_PATH}/voices/id/sun.mp3`)`

## 📱 PWA (Progressive Web App)
The app is installable on mobile devices.
- **Manifest**: `public/manifest.json` defines the app name, theme, and standalone display mode.
- **Integration**: Linked in `src/app/layout.tsx` via the `metadata` object.
- **Meta Tags**: Specific Apple and Android meta tags are in `layout.tsx` to ensure a true full-screen "standalone" experience.

## 🧹 Maintenance & Cleanup
- **NO NETLIFY**: The project has moved away from Netlify. **Do NOT add `netlify.toml`** or any Netlify-specific configurations. GitHub Pages is the single source of truth.
- **Voice Assets**: High-quality pre-recorded voices are located in `public/voices`. If adding new celestial bodies, ensure matching `.mp3` files are downloaded to these directories.
- **Hardware Acceleration**: The `page.tsx` uses `will-change: transform, opacity` for smooth 60fps swipes. Keep this for toddler-friendly responsiveness.

## 🛠 Future Tasks
1. **Interactive Stars**: (Planned Part 3) Make the background space-bg stars interactive.
2. **Offline Support**: Expand the PWA with a Service Worker for full offline caching of media assets.
