# EventOn 0.2 Monorepo

EventOn is a modern SaaS platform that helps events teams match the right talent to the right opportunities. This repository is a PNPM + Turborepo workspace that houses the API, web client, database schema, and shared packages that will power the upcoming 0.2 release.

## Project structure

```
.
├── apps
│   ├── api        # NestJS + Fastify application
│   └── web        # Next.js 14 application with Tailwind, shadcn/ui, React Query, NextAuth
├── packages
│   ├── config     # Shared ESLint, Prettier, and TSConfig bases
│   ├── db         # Prisma schema, client, and seed script
│   ├── shared     # Zod schemas, shared types, cross-cutting utilities
│   └── ui         # Reusable React UI components (shadcn/ui foundations)
├── infra          # Local docker-compose and environment templates
└── turbo.json     # Turborepo pipeline configuration
```

## Getting started

1. Install [PNPM](https://pnpm.io/) 8.x and [Turborepo](https://turbo.build/).
2. Copy the environment templates:
   ```bash
   cp infra/api.env.example .env.api
   cp infra/web.env.example .env.web
   ```
3. Start the local infrastructure:
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```
4. Install workspace dependencies and generate the Prisma client:
   ```bash
   pnpm install
   pnpm db:generate
   ```
5. Start all apps in development mode:
   ```bash
   pnpm dev
   ```

## Useful scripts

The root `package.json` exposes the following commands:

- `pnpm dev` – run all `dev` scripts in parallel via Turborepo.
- `pnpm build` – build every package and application.
- `pnpm lint` – lint all workspaces using their configured ESLint rules.
- `pnpm test` – execute test suites (currently placeholders).
- `pnpm db:migrate` – run Prisma migrations against the configured database.
- `pnpm db:seed` – execute the Prisma seed script.
- `pnpm db:generate` – regenerate the Prisma client.
- `pnpm security:sbom` – generate a JSON SBOM using Anchore Syft.

## Infrastructure

The `infra/` directory provides a `docker-compose.yml` file with PostgreSQL 16 (pgvector enabled) and Redis, both configured with sensible defaults and health checks. Environment templates are included for the API and web applications to bootstrap local development quickly.

