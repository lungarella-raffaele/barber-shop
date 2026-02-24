# Ephemeral routes cleanup

## Goal

The home page must render only the marketing home page. Reservation confirmation, account verification, password reset, and email-change confirmation each get one canonical route owned by their domain.

## Target routes

| Flow                                    | Canonical route                         |
| --------------------------------------- | --------------------------------------- |
| Booking form                            | `/book`                                 |
| Reservation awaiting email confirmation | `/book/pending/[token]`                 |
| Confirm a reservation                   | `/book/confirm/[token]`                 |
| Verify a new account email              | `/account/verify-email/[token]`         |
| Reset a forgotten password              | `/account/reset-password/[token]`       |
| Confirm an account email change         | `/account/confirm-email-change/[token]` |

`[token]` describes the intended public contract. Some routes temporarily continue to receive database IDs until purpose-specific, random, expiring tokens are introduced.

## Design rules

- `/` owns only the marketing homepage.
- Organize routes by the resource or domain they affect.
- Use verbs such as `confirm` for routes that perform an action; use adjectives such as `pending` for display-only states.
- Success, expired, invalid, already-used, and server-error outcomes are states of a flow route, not separate routes.
- Mutation links must be idempotent when revisited.
- Public links should ultimately use opaque, expiring, purpose-specific tokens rather than user or reservation IDs.
- Keep legacy URLs working while old links may still exist in customer inboxes.




## Current legacy URLs

| Legacy URL                          | Replacement                            |
| ----------------------------------- | -------------------------------------- |
| `/?reservation=:id`                 | `/book/confirm/:token`                 |
| `/?pending=:id`                     | `/book/pending/:token`                 |
| `/?user=:id`                        | `/account/verify-email/:token`         |
| `/?recover=:id`                     | `/account/reset-password/:token`       |
| `/profile?confirm-email-change=:id` | `/account/confirm-email-change/:token` |
| `/book/confirmed/:id`               | `/book/confirm/:token`                 |

## Migration phases

### Phase 1 — Establish dedicated account routes

- [x] Add `/account/reset-password/[token]`.
- [x] Add `/account/verify-email/[token]`.
- [x] Add `/account/confirm-email-change/[token]`.
- [x] Keep existing URLs operational during the additive transition.
- [x] Remove the corresponding legacy implementations after producers and redirects have migrated.

Temporary duplication during this phase is intentional. The canonical routes are established first so email producers can be switched safely in Phase 2.

### Phase 2 — Update URL producers

- [x] Send password recovery emails to `/account/reset-password/[token]`.
- [x] Send signup verification emails to `/account/verify-email/[token]`.
- [x] Send email-change emails to `/account/confirm-email-change/[token]`.
- [x] Update booking email links and client navigation to canonical booking routes.
- [x] Ensure `BASE_URL` joining is consistent and does not produce double slashes.



### Phase 3 — Add compatibility redirects

- [x] Redirect legacy home query modes to canonical routes.
- [x] Redirect the legacy profile email-change query to its canonical route.
- [x] Redirect `/user/confirmed/[id]` and `/book/confirmed/[id]`.
- [x] Prefer temporary redirects until route and token contracts are stable.

### Phase 4 — Remove home-page modes

- [x] Remove `PageCase` and `getPageCase`.
- [x] Remove ephemeral loaders and actions from `src/routes/+page.server.ts`.
- [x] Remove conditional flow rendering from `src/routes/+page.svelte`.
- [x] Remove obsolete root-level flow components and duplicate legacy route pages.
- [x] Update the showcase route inventory.

### Phase 5 — Harden public tokens

- [x] Add generic hashed public-token storage, purpose isolation, expiry, revocation, and cleanup.
- [x] Migrate newly issued password-reset links to one-time `password_reset` tokens.
- [x] Preserve existing password-reset UUID links through a temporary legacy fallback.
- [x] Remove bearer-token URLs from mail failure logs.
- [ ] Introduce random, purpose-specific reservation access and confirmation tokens.
- [ ] Introduce a dedicated initial-account verification token instead of exposing a user ID.
- [ ] Migrate email-change verification to `email_change` tokens.
- [ ] Convert mutating GET routes to GET preview + explicit POST confirmation.
- [ ] Limit personal data exposed by public reservation links.
- [ ] Retire the legacy `password_recover` table after its compatibility window.

## Validation checklist

Each flow should cover:

- valid token;
- unknown token;
- expired token;
- already-consumed token;
- repeated refresh after success;
- failed mutation;

- legacy redirect preserving the token;
- authorization requirements, especially email changes;
- form validation for password reset.
