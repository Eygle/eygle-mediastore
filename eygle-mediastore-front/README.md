# Eygle Mediastore Front

Vue 3 + Vuetify 3 + Vite SPA for [Eygle Mediastore](../README.md). Dev server on port **3001**. `@` aliases to `src/`.

## Installation

```bash
npm install
```

## Commands

```bash
npm run dev         # vite dev server (port 3001)
npm run build       # vite build
npm run lint        # eslint --fix
npm run deploy      # build + scp dist to 192.168.0.21
```

## Configuration

Runtime config (API base URL, `itemsPerPage`) comes from Vite env files: `.env.development` (dev) and `.env.production` (build). Variables are prefixed `VITE_`, typed in `env.d.ts`, and exposed through `useConfig()` (`src/composables/config.ts`).

## Structure

- `src/composables/` — state and services (no store library): `api.ts` wraps all axios calls and converts payloads to/from DTO classes via class-transformer (`plainToInstance` / `instanceToPlain`), `cache.ts` is a keyed in-memory cache, plus `dialogs.ts`, `confirm.ts`, `toast.ts` for UI state.
- `src/dto/` — DTO classes mirroring the backend entities; they carry presentation logic as getters (e.g. `MediaGroupDto.nbBest`).
- `src/router/index.ts` — convention-driven routes: each `field` value gets a list + detail route; the navbar is generated from route `meta`.
- `src/components/dialogs/` — all CRUD dialogs (Upsert*, ConfirmDialog, CreateBatchDialog, MergeTagsDialog).
