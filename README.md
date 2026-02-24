# Watcher's Eye Mod Finder

A small Path of Exile helper app for browsing and filtering Watcher's Eye modifiers by aura.

## Live Demo

GitHub Pages: https://simplecookie.github.io/poe-watchers-eye/

## What this app does

- Groups auras into offensive and defensive sections
- Filters mods by selected aura(s)
- Lets you pin selected mods
- Lets you hide/unhide mods while browsing
- Lets you copy selected mod text with one click
- Supports dark/light mode (dark by default)

## Screenshot

![Watcher&apos;s Eye Mod Finder](docs/screenshot.png)

If you want this image to appear on GitHub, add your screenshot at `docs/screenshot.png`.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS v4

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This repo includes a workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) that deploys on each push to `master`.

One-time setup in GitHub:

1. Open your repository settings
2. Go to **Pages**
3. Set **Source** to **GitHub Actions**

After that, every push to `master` will publish the app to GitHub Pages.
