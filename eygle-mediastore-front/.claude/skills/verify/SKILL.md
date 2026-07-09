---
name: verify
description: Build/launch/drive recipe to verify eygle-mediastore-front changes in the running app
---

# Verifying eygle-mediastore-front

## Handles

- Backend usually already runs on `http://localhost:4343` (real data — **never press Save/Edit/Delete in dialogs**; drive the UI then Cancel). Check with `curl -s http://localhost:4343/tag | head -c 200`.
- Front dev server: `npm run dev` in `eygle-mediastore-front/`. Port 3001 is often taken by the user's own dev server (which may serve stale deps after a `package.json` change → 500/504 "Outdated Optimize Dep"); Vite then picks 3002 — read the port from its output.
- Browser driving: no repo Playwright. Install it in the session scratchpad (`npm init -y && npm install playwright`) and launch with `chromium.launch({ channel: 'chrome' })` — `/usr/bin/google-chrome` is available, Playwright-managed browsers are not.

## Useful flows

- Group detail page with many tags: `/profiles/1` (profile with 12 tags). Find others via `curl -s http://localhost:4343/media-group/<field>` (fields: category, movie, profile, star, tv, website).
- "Manage tags" dialog: click the `button:has(.mdi-plus)` next to the tag chips on a detail page.
- Tag search hits `GET /tag?...` after a 250ms debounce — wait ~400ms after typing before asserting the dropdown.
- Vuetify overlays render outside the dialog: dropdown items are `.v-overlay .v-list-item`, dialog card is `.v-dialog .v-card`.

## Gotchas

- `npm run lint` crashes (`--ignore-path .gitignore` but no `.gitignore` in the front dir) — lint files directly with `npx eslint <files>`.
- `vue-tsc` is not part of the build (`vite build` only) and reports pre-existing errors; don't treat them as regressions.
- After changing front deps, the user's already-running dev server serves 504 "Outdated Optimize Dep" until restarted.
