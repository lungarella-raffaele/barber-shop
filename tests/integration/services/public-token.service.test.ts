import * as table from "$lib/server/db/schema";
import { hashPublicToken, PublicTokenService } from "$lib/server/services/public-token.service";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedStaff, seedUser } from "../../support/fixtures";

describe("PublicTokenService", () => {
  let testDatabase: TestDatabase;
  let service: PublicTokenService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    await seedUser(testDatabase.database, { id: "user-1" });
    service = new PublicTokenService(testDatabase.database);
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("issues and inspects a token without storing the raw secret", async () => {
    const issued = await service.issue({
      purpose: "password_reset",
      userID: "user-1",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });
    expect(issued.isOk()).toBe(true);
    if (issued.isErr()) throw new Error(`Token issuance failed: ${issued.error}`);

    const rows = await testDatabase.database.select().from(table.publicToken);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      tokenHash: hashPublicToken(issued.value),
      purpose: "password_reset",
      userID: "user-1",
      consumedAt: null,
    });
    expect(JSON.stringify(rows[0])).not.toContain(issued.value);

    expect(await service.inspect(issued.value, "password_reset")).toMatchObject({
      status: "valid",
      token: { tokenHash: hashPublicToken(issued.value) },
    });
    expect(await service.inspect(issued.value, "email_change")).toEqual({
      status: "invalid",
    });
  });

  it("consumes a valid token only once", async () => {
    const issued = await service.issue({
      purpose: "account_verification",
      userID: "user-1",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });
    if (issued.isErr()) throw new Error(`Token issuance failed: ${issued.error}`);

    expect(await service.consume(issued.value, "account_verification")).toBe(true);
    expect(await service.consume(issued.value, "account_verification")).toBe(false);
    expect(await service.inspect(issued.value, "account_verification")).toEqual({
      status: "consumed",
    });
  });

  it("atomically confirms a reservation and consumes its token only once", async () => {
    await seedStaff(testDatabase.database);
    await testDatabase.database.insert(table.reservation).values({
      id: "reservation-1",
      date: "2099-06-15",
      hour: "10:00",
      name: "Guest",
      email: "guest@example.com",
      expiresAt: new Date("2099-06-15T09:00:00.000Z"),
      pending: true,
      staffID: "staff-1",
    });
    const issued = await service.issue({
      purpose: "reservation_confirmation",
      reservationID: "reservation-1",
      expiresAt: new Date("2099-06-15T09:00:00.000Z"),
    });
    if (issued.isErr()) throw new Error(`Token issuance failed: ${issued.error}`);

    expect(await service.confirmReservation(issued.value)).toBe("reservation-1");
    expect(await service.confirmReservation(issued.value)).toBeNull();
    expect(await service.inspect(issued.value, "reservation_confirmation")).toEqual({
      status: "consumed",
    });

    const reservation = await testDatabase.database
      .select()
      .from(table.reservation)
      .where(eq(table.reservation.id, "reservation-1"))
      .get();
    expect(reservation).toMatchObject({ pending: false });
  });

  it("replaces an unconsumed token for the same user and purpose", async () => {
    const first = await service.issue({
      purpose: "email_change",
      userID: "user-1",
      pendingEmail: "first@example.com",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });
    const second = await service.issue({
      purpose: "email_change",
      userID: "user-1",
      pendingEmail: "second@example.com",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });
    if (first.isErr() || second.isErr()) throw new Error("Expected both issuances to succeed");

    expect(await service.inspect(first.value, "email_change")).toEqual({
      status: "invalid",
    });
    expect(await service.inspect(second.value, "email_change")).toMatchObject({
      status: "valid",
      token: { pendingEmail: "second@example.com" },
    });
    expect(await testDatabase.database.select().from(table.publicToken)).toHaveLength(1);
  });

  it("revokes tokens and deletes all tokens for a user", async () => {
    const passwordReset = await service.issue({
      purpose: "password_reset",
      userID: "user-1",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });
    const emailChange = await service.issue({
      purpose: "email_change",
      userID: "user-1",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });
    if (passwordReset.isErr() || emailChange.isErr()) throw new Error("Token issuance failed");

    expect(await service.revoke(passwordReset.value, "password_reset")).toBe(true);
    expect(await service.inspect(passwordReset.value, "password_reset")).toEqual({
      status: "invalid",
    });

    await service.deleteByUserID("user-1");
    expect(await testDatabase.database.select().from(table.publicToken)).toEqual([]);
  });

  it("identifies and removes expired tokens", async () => {
    const expired = await service.issue({
      purpose: "password_reset",
      userID: "user-1",
      expiresAt: new Date("2000-01-01T00:00:00.000Z"),
    });
    if (expired.isErr()) throw new Error(`Token issuance failed: ${expired.error}`);

    expect(await service.inspect(expired.value, "password_reset")).toEqual({
      status: "expired",
    });
    expect(await service.consume(expired.value, "password_reset")).toBe(false);

    await service.deleteAllExpired();
    expect(
      await testDatabase.database
        .select()
        .from(table.publicToken)
        .where(eq(table.publicToken.tokenHash, hashPublicToken(expired.value))),
    ).toEqual([]);
  });

  it("returns a storage error for a token referencing a missing user", async () => {
    const result = await service.issue({
      purpose: "password_reset",
      userID: "missing-user",
      expiresAt: new Date("2099-06-15T12:00:00.000Z"),
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) throw new Error("Expected token issuance to fail");
    expect(result.error).toBe("storage-error");
    expect(await testDatabase.database.select().from(table.publicToken)).toEqual([]);
  });
});
