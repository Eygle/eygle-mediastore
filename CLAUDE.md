# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Single git repo containing two independent npm projects (each with its own `package.json`, run commands from inside the project directory):

- `eygle-mediastore-back/` — NestJS 10 + TypeORM REST API, listens on port 4343, PostgreSQL database `eygle` (schema `mediastore`, `synchronize: true`, snake_case naming strategy). DB connection is hardcoded in `src/app.module.ts`.
- `eygle-mediastore-front/` — Vue 3 + Vuetify 3 + Vite SPA, dev server on port 3001. `@` aliases to `src/`.

There are no tests in either project.

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
npm run dev         # vite (port 3001)
npm run build       # vite build
npm run lint        # eslint --fix
npm run deploy      # build + scp dist to 192.168.0.21
```

Frontend runtime config (API base URL, `itemsPerPage`) comes from Vite env files: `.env.development` (dev) and `.env.production` (build), exposed via `useConfig()` (`src/composables/config.ts`). Variables are typed in `env.d.ts`.

## Domain model

Three entities, defined in the backend (`src/*/**.entity.ts`) and mirrored as class-transformer DTOs in the frontend (`src/dto/`):

- **MediaGroup** — the central entity. Its `field` enum (`Field`: category, movie, profile, star, tv, website) partitions groups into the site's main sections. Groups nest via `parent`/`groups`, own `media`, and have `starring` (group↔group) and `starringMedia` (group↔media) many-to-many relations.
- **Media** — belongs to one MediaGroup (`parent`), has `files` paths, `progress`, and boolean status flags (`toSee`, `isPotentialBest`, `isBest`, `isAbsoluteBest`, `toTag`).
- **Tag** — flat, unique-title tags attached to both media and groups.

The boolean status flags drive matching list endpoints on both entities (e.g. `GET /media/to-see`, `/media/best`, `/media/commented`) and one frontend navbar route each.

## Architecture notes

**Backend** follows standard Nest module-per-entity structure (`media/`, `media-group/`, `tag/`), each with controller + service + entity. `admin/` holds one-off data-repair endpoints (tag synchronization, file-path migration). `src/utils/group-by-parents.ts` regroups a flat media list under their parent groups — the shape the status-flag endpoints return.

**Frontend:**
- Routing is convention-driven: each `Field` value gets a list route (`MediaGroupsListPage`) and a detail route (`MediaGroupDetailsPage`); status-flag routes share `MediaGroupsByFieldsPage`. Navbar is generated from route `meta` (`navbar`, `icon`, `field`, `groups`, `divider`) in `src/router/index.ts`.
- No store library. State lives in composables (`src/composables/`): `api.ts` wraps all axios calls and converts payloads to/from DTO classes via class-transformer (`plainToInstance`/`instanceToPlain` — keep this pattern when adding endpoints), `cache.ts` is a simple keyed in-memory cache, plus `dialogs.ts`, `confirm.ts`, `toast.ts` for UI state.
- CRUD happens through the dialogs in `src/components/dialogs/` (Upsert*, ConfirmDialog, CreateBatchDialog, MergeTagsDialog).
- DTO classes carry presentation logic as getters (e.g. `MediaGroupDto.nbBest`, `lastEntryRelativeTime`).
