# Barber Shop Application

Lightweight, mobile-first booking system for barber shops built with SvelteKit, Drizzle ORM, SQLite, and Resend for email notifications.

Install dependencies:

```bash
pnpm i
```

Run dev server:

```bash
pnpm dev
```

### Environment Variables

- MAILER: Resend token used by the mailer;
- BASE_URL: Url used to redirect from an email to the site;
- DATABASE_AUTH_TOKEN & DATABASE_CONNECTION_URL: SQLite database auth and url;

> [!IMPORTANT]
> The application is ACTUALLY being used by Emiliano Lo Russo at **Emi Hair Club**. If you're near Siena, stop by for a cut :).

## License

This project is licensed under the [MIT license](./LICENSE).
