# TIMGAS Workforce

A Next.js and TypeScript implementation of the TIMGAS employee management requirements, prepared for a PostgreSQL backend with Prisma ORM.

## Included modules

- Manager sign-in preview
- Operations command center
- Employee directory and profiles
- Employee violation records
- Semi-monthly payroll workspace
- Payroll receipt and payslip list
- Sick, vacation, and force leave credits
- Contract expiration monitoring
- TIMGAS station overview
- Reports and configuration screens

The current screens still render typed demonstration records from `src/data/mock-data.ts`. PostgreSQL models, Prisma Client, and seed data are now configured; switch each screen to database queries as its create/update workflow is implemented.

## PostgreSQL setup

PostgreSQL 18 is installed locally on the current development machine. The project uses Prisma ORM 7 and the PostgreSQL driver adapter.

1. Copy `.env.example` to `.env` if `.env` does not already exist.
2. Replace `CHANGE_ME` or `YOUR_PASSWORD` with the password for your local PostgreSQL `postgres` user:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/timgas_workforce?schema=public"
```

If the password contains reserved URL characters such as `@`, `:`, `/`, `?`, or `#`, URL-encode it before putting it in the connection string. Never commit `.env`.

3. Create the empty database from pgAdmin, or run this from a terminal where PostgreSQL tools are available:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost timgas_workforce
```

4. Create the tables and seed reference/demo data:

```bash
npm run db:migrate -- --name init
npm run db:seed
```

5. Inspect the database when needed:

```bash
npm run db:studio
```

For production deployments, set `DATABASE_URL` in the hosting provider's secret environment-variable settings and run `npm run db:deploy`. Do not upload the local `.env` file.

### Database commands

```bash
npm run db:generate   # regenerate the type-safe client
npm run db:migrate    # create/apply a development migration
npm run db:deploy     # apply committed migrations in production
npm run db:seed       # add stations, leave types, payroll item types, and demo employees
npm run db:studio     # open Prisma Studio
```

The schema is in `prisma/schema.prisma`, the seed script is in `prisma/seed.ts`, and the shared server-only client is in `src/lib/prisma.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```
