# Backend remediation TODO

This document tracks the backend audit and remediation work.

## P0 — Security and privacy

- [x] Introduce client-safe user DTOs; never serialize database user rows/password hashes.
- [x] Return availability-only data from the public booking page; never expose reservation PII.
- [x] Do not return anonymous reservation confirmation tokens to the submitting browser.
- [x] Replace user-ID account verification links with hashed, purpose-bound public tokens.
- [x] Convert account verification and email-change mutations from GET to explicit POST actions.
- [x] Make password reset token consumption, password update, and session revocation atomic.
- [x] Revoke existing sessions after password reset/change.
- [x] Scope staff mutations to the authenticated staff member; never trust submitted acting staff IDs.
- [x] Escape all dynamic email HTML and provide plain-text email content.
- [x] Add production logging redaction for secrets and customer PII.

## P1 — Booking and domain integrity

- [x] Enforce staff activity, schedule, shutdowns, future time, valid formats, duration, and overlap on the transactional write path.
- [x] Define canonical Europe/Rome date/time and reservation expiration semantics.
- [x] Fix reservation expiration being up to one day late/inconsistent across flows.
- [x] Add stronger cross-instance concurrency protection for simultaneous booking attempts.
- [x] Validate all admin action payloads and return controlled 4xx errors.
- [x] Validate and normalize profile updates at the service boundary.
- [x] Validate avatar metadata and decoded image size.

## P1 — Database

- [x] Add schedule range checks and staff/day lookup indexes.
- [x] Add offering duration/price checks and staff/active index.
- [x] Add reservation availability/cleanup indexes.
- [x] Add shutdown range checks/indexes.
- [x] Enforce purpose-dependent token structure at the typed service boundary with runtime validation.
- [x] Add missing session/token cleanup indexes.
- [ ] Review reservation status model (`pending` vs explicit lifecycle states).
- [ ] Review canonical `startsAt`/`endsAt` storage as a future migration.

## P2 — Services and maintainability

- [ ] Standardize service result/error contracts and affected-row reporting.
  - [x] Standardize authentication/session reads, public-token mutations, and admin CRUD.
  - [x] Standardize reservation reads and deletion methods.
  - [ ] Standardize remaining user/account mutation methods.
- [ ] Stop swallowing infrastructure errors where callers need to detect failure.
  - [x] Distinguish storage failures in authentication, token routes, and admin actions.
  - [x] Distinguish storage failures in reservation reads and deletes.
  - [ ] Distinguish storage failures in remaining account deletion cleanup.
- [x] Make public-token replacement transactional.
- [x] Make cleanup failure-aware, idempotent, and return a structured report.
- [x] Inject database dependencies into cleanup, banner, and legacy token services.
- [x] Replace class-name singleton registry with constructor-keyed lifecycle and test reset support.
- [x] Normalize profile values and consolidate the active profile update path.
- [ ] Drop legacy raw password/email token tables and services after production compatibility window.

## P2 — Operations

- [x] Add database-backed rate limiting for login, recovery, signup, and booking.
- [x] Add authenticated scheduled cleanup suitable for Vercel Cron.
- [x] Separate production migration execution from application build/release.
- [ ] Document production environment, timezone, migration, backup, and recovery procedures.
- [ ] Add health/readiness behavior and actionable failure logging.

## Tests and CI

- [x] Assert client-safe user serialization excludes password hashes and private staff fields.
- [x] Assert anonymous booking availability contains no customer PII.
- [x] Test schedule, shutdown, inactive-staff, past-time, and malformed-time rejection.
- [x] Add focused cross-instance concurrent booking integration coverage.
- [ ] Define and implement a dedicated `test:stress` suite with many independent clients and repeated simultaneous booking rounds.
- [x] Test atomic password reset and session revocation.
- [x] Test staff cross-ownership mutations are rejected.
- [x] Test account verification one-time use and POST-only mutation.
- [x] Test email HTML escaping.
- [x] Test cleanup reporting and idempotency.
- [x] Test reservation expiration at the Europe/Rome boundary.
- [x] Add explicit unit and integration jobs to CI.
- [ ] Add E2E to CI once browser/database/email isolation is reliable.

## Current validation

- `pnpm check`: passed, 0 errors and 0 warnings
- `pnpm lint`: passed
- `pnpm fmt:check`: passed
- `pnpm build`: passed
- `pnpm test:unit`: 110 passed
- `pnpm test:integration`: 71 passed

## Deliberate follow-up design work

The remaining unchecked items are migrations, architectural changes, or dedicated test infrastructure that should not be silently imposed without product/operations decisions: explicit reservation lifecycle statuses, canonical timestamp-column redesign, removal of legacy token tables after a compatibility window, a high-volume cross-instance stress suite, backup/recovery policy, readiness semantics, and isolated E2E infrastructure.
