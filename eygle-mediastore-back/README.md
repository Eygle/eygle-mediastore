# Eygle Mediastore Back

NestJS 10 + TypeORM REST API for [Eygle Mediastore](../README.md). Listens on port **4343**.

## Requirements

PostgreSQL on `localhost:5432` with a database named `eygle` (schema `mediastore`, created automatically — TypeORM `synchronize: true`). Connection settings are hardcoded in `src/app.module.ts`.

## Installation

```bash
npm install
```

## Commands

```bash
npm run start:dev   # dev server with watch (port 4343)
npm run start:prod  # run built app (node dist/main)
npm run build       # nest build
npm run lint        # eslint --fix
npm run deploy      # build + scp to 192.168.0.21 + pm2 restart
```

## Structure

Module-per-entity (`media/`, `media-group/`, `tag/`), each with controller + service + entity. `admin/` holds one-off data-repair endpoints. `src/utils/group-by-parents.ts` regroups a flat media list under their parent groups — the shape returned by the status-flag endpoints (`/media/to-see`, `/media/best`, …).
