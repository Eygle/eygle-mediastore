# Eygle Mediastore

Personal media library manager: organize media into nested groups (categories, movies, profiles, stars, TV, websites), tag them, and track statuses (to see, best, to tag…).

Single repository containing two independent npm projects — each has its own `package.json`, run commands from inside the project directory:

| Project | Stack | Port |
|---|---|---|
| [`eygle-mediastore-back/`](eygle-mediastore-back/) | NestJS 10 + TypeORM + PostgreSQL | 4343 |
| [`eygle-mediastore-front/`](eygle-mediastore-front/) | Vue 3 + Vuetify 3 + Vite | 3001 (dev) |

## Prerequisites

- Node.js 20+
- PostgreSQL running on `localhost:5432` with a database named `eygle` (the backend uses the `mediastore` schema; tables are created automatically via TypeORM `synchronize: true`). Connection settings are hardcoded in `eygle-mediastore-back/src/app.module.ts`.

## Getting started

```bash
# Backend (http://localhost:4343)
cd eygle-mediastore-back
npm install
npm run start:dev

# Frontend (http://localhost:3001)
cd eygle-mediastore-front
npm install
npm run dev
```

## Commands

Backend (`eygle-mediastore-back/`):

```bash
npm run start:dev   # dev server with watch (port 4343)
npm run build       # nest build
npm run lint        # eslint --fix
npm run deploy      # build + scp to 192.168.0.21 + pm2 restart
```

Frontend (`eygle-mediastore-front/`):

```bash
npm run dev         # vite dev server (port 3001)
npm run build       # vite build
npm run lint        # eslint --fix
npm run deploy      # build + scp dist to 192.168.0.21
```

## Configuration

Frontend runtime config (API base URL, `itemsPerPage`) comes from Vite env files: `.env.development` (used by `npm run dev`) and `.env.production` (used by `npm run build`). Variables are prefixed `VITE_` and exposed through `useConfig()` (`src/composables/config.ts`).

## Domain model

Three entities, defined in the backend (`src/*/**.entity.ts`) and mirrored as class-transformer DTOs in the frontend (`src/dto/`):

- **MediaGroup** — the central entity. Its `field` enum (category, movie, profile, star, tv, website) partitions groups into the site's main sections. Groups nest via `parent`/`groups`, own `media`, and have `starring` (group↔group) and `starringMedia` (group↔media) many-to-many relations.
- **Media** — belongs to one MediaGroup (`parent`), has `files` paths, `progress`, and boolean status flags (`toSee`, `isPotentialBest`, `isBest`, `isAbsoluteBest`, `toTag`).
- **Tag** — flat, unique-title tags attached to both media and groups.

The boolean status flags drive matching list endpoints on both entities (e.g. `GET /media/to-see`, `/media/best`) and one frontend navbar route each.

## Architecture notes

**Backend** — standard Nest module-per-entity structure (`media/`, `media-group/`, `tag/`), each with controller + service + entity. `admin/` holds one-off data-repair endpoints (tag synchronization, file-path migration).

**Frontend:**

- No store library — state lives in composables (`src/composables/`): `api.ts` wraps all axios calls and converts payloads to/from DTO classes via class-transformer, `cache.ts` is a keyed in-memory cache, plus `dialogs.ts`, `confirm.ts`, `toast.ts` for UI state.
- Routing is convention-driven: each `field` value gets a list route and a detail route; status-flag routes share a common page. The navbar is generated from route `meta` in `src/router/index.ts`.
- CRUD happens through the dialogs in `src/components/dialogs/`.

## Deployment

Both projects deploy to `192.168.0.21` via their `npm run deploy` scripts: the backend is served by pm2 (`eygle-mediastore-back`), the frontend is copied to `/var/www/eygle-mediastore-front`.

There are no tests in either project.
