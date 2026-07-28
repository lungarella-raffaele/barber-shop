# Barber Shop Application

Lightweight, mobile-first booking system for barber shops built with SvelteKit, Drizzle ORM, SQLite, and Resend for email notifications.

## Getting started

The project uses Node.js 22 (see `.nvmrc`) and pnpm 10.

Install dependencies:

```bash
pnpm install
```

Create a `.env` file for local development:

```dotenv
DATABASE_CONNECTION_URL=file:local.db
DATABASE_AUTH_TOKEN=
BASE_URL=http://localhost:5173
MAILER=
```

`DATABASE_AUTH_TOKEN` is optional for a local `file:` database and required for a remote Turso database. `MAILER` is the Resend API token used for email notifications, while `BASE_URL` is used to build links included in those emails.

Prepare the database and start the development server:

```bash
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Database migrations

The database is managed with Drizzle ORM and Drizzle Kit. The schema lives in `src/lib/server/db/schema.ts`; generated SQL migrations and their metadata are committed under `migrations/`.

After changing the schema, generate and review a migration:

```bash
pnpm db:generate
pnpm db:migrate
```

Useful database commands:

| Command            | Purpose                                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `pnpm db:generate` | Generate a SQL migration from schema changes.                                          |
| `pnpm db:migrate`  | Apply pending migrations to the configured database.                                   |
| `pnpm db:push`     | Push the schema directly without generating a migration; useful for local prototyping. |
| `pnpm db:studio`   | Open Drizzle Studio for the configured database.                                       |

The Drizzle configuration reads `.env`. A `DATABASE_CONNECTION_URL` beginning with `file:` uses local SQLite; any other URL is treated as a remote Turso database and also requires `DATABASE_AUTH_TOKEN`.

The `pnpm release` command applies pending migrations before creating a production build.

CI runs formatting, linting, diagnostics, the production build, unit tests, and the dependency audit.

> [!IMPORTANT]
> The application is ACTUALLY being used by Emiliano Lo Russo at **Emi Hair Club**. If you're near Siena, stop by for a cut :).

## License

This project is licensed under the [MIT license](./LICENSE).
