import * as table from "$lib/server/db/schema";
import { UserService } from "$lib/server/services/user.service";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedStaff, seedUser } from "../../support/fixtures";

describe("UserService", () => {
  let testDatabase: TestDatabase;
  let service: UserService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    service = new UserService(testDatabase.database);
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("validates, normalizes, hashes, and inserts a user", async () => {
    const beforeInsert = Date.now();
    const result = await service.insert({
      email: "  CUSTOMER@EXAMPLE.COM ",
      password: "Secure123!",
      name: "Customer",
      phoneNumber: "123456789",
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) throw new Error(`Insertion failed: ${result.error}`);

    expect(result.value).toMatchObject({
      email: "customer@example.com",
      name: "Customer",
      phoneNumber: "123456789",
      verifiedEmail: false,
    });
    expect(await verify(result.value.passwordHash, "Secure123!")).toBe(true);
    expect(result.value.expiresAt?.getTime()).toBeGreaterThan(beforeInsert);

    const duplicate = await service.insert({
      email: "CUSTOMER@example.com",
      password: "Secure123!",
      name: "Duplicate",
      phoneNumber: "",
    });
    expect(duplicate.isErr()).toBe(true);
    if (duplicate.isOk()) throw new Error("Expected duplicate insertion to fail");
    expect(duplicate.error).toBe("already-existing");

    const invalid = await service.insert({
      email: "not-an-email",
      password: "weak",
      name: "Invalid",
      phoneNumber: "",
    });
    expect(invalid.isErr()).toBe(true);
    if (invalid.isOk()) throw new Error("Expected invalid insertion to fail");
    expect(invalid.error).toBe("invalid-email");
  });

  it("hydrates user and staff roles by ID and normalized email", async () => {
    await seedUser(testDatabase.database, {
      id: "customer-1",
      email: "customer@example.com",
    });
    await seedStaff(testDatabase.database);

    expect(await service.getByID("customer-1")).toMatchObject({
      role: "user",
      data: { id: "customer-1" },
    });
    expect(await service.getByEmail(" CUSTOMER@EXAMPLE.COM ")).toMatchObject({
      role: "user",
      data: { id: "customer-1" },
    });
    expect(await service.getByID("staff-1")).toMatchObject({
      role: "staff",
      data: { id: "staff-1", userID: "staff-1" },
    });
    expect(await service.getByEmail("barber@example.com")).toMatchObject({
      role: "staff",
      data: { id: "staff-1", userID: "staff-1" },
    });
  });

  it("verifies and updates a user", async () => {
    await seedUser(testDatabase.database, { id: "user-1" });
    await testDatabase.database
      .update(table.user)
      .set({ expiresAt: new Date("2000-01-01T00:00:00.000Z") })
      .where(eq(table.user.id, "user-1"));

    expect(await service.updateName("user-1", "  Updated Name  ")).toMatchObject({
      name: "Updated Name",
    });
    expect(await service.updatePhoneNumber("user-1", "  555123  ")).toMatchObject({
      phoneNumber: "555123",
    });

    const emailResult = await service.updateEmail("user-1", "  UPDATED@EXAMPLE.COM ");
    expect(emailResult.isOk()).toBe(true);
    if (emailResult.isErr()) throw new Error("Expected email update to succeed");
    expect(emailResult.value.email).toBe("updated@example.com");

    expect(await service.verifyEmail("user-1")).toMatchObject({
      verifiedEmail: true,
      expiresAt: null,
    });
  });

  it("counts and deletes only expired unverified users", async () => {
    await seedUser(testDatabase.database, { id: "expired", email: "expired@example.com" });
    await seedUser(testDatabase.database, { id: "future", email: "future@example.com" });
    await seedUser(testDatabase.database, { id: "verified", email: "verified@example.com" });

    await testDatabase.database
      .update(table.user)
      .set({ expiresAt: new Date("2000-01-01T00:00:00.000Z") })
      .where(eq(table.user.id, "expired"));
    await testDatabase.database
      .update(table.user)
      .set({ expiresAt: new Date("2099-01-01T00:00:00.000Z") })
      .where(eq(table.user.id, "future"));
    await testDatabase.database
      .update(table.user)
      .set({
        expiresAt: new Date("2000-01-01T00:00:00.000Z"),
        verifiedEmail: true,
      })
      .where(eq(table.user.id, "verified"));

    expect(await service.countExpired()).toBe(1);
    await service.deleteAllExpired();

    expect(await service.getByID("expired")).toBeNull();
    expect(await service.getByID("future")).not.toBeNull();
    expect(await service.getByID("verified")).not.toBeNull();
  });
});
