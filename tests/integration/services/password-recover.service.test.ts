import { DAY_IN_MS } from "$lib/constants";
import * as table from "$lib/server/db/schema";
import { PasswordRecoverService } from "$lib/server/services/password-recover.service";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedUser } from "../../support/fixtures";

describe("PasswordRecoverService", () => {
  let testDatabase: TestDatabase;
  let service: PasswordRecoverService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    await seedUser(testDatabase.database, { id: "user-1" });
    await seedUser(testDatabase.database, {
      id: "user-2",
      email: "second@example.com",
    });
    service = new PasswordRecoverService(testDatabase.database);
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("inserts and retrieves a token that expires in one day", async () => {
    const beforeInsert = Date.now();
    const inserted = await service.insert("user-1");
    const afterInsert = Date.now();

    expect(inserted).toMatchObject({
      id: expect.any(String),
      userID: "user-1",
      expiresAt: expect.any(Date),
    });
    if (!inserted?.expiresAt) throw new Error("Expected a token expiration date");

    expect(inserted.expiresAt.getTime()).toBeGreaterThanOrEqual(beforeInsert + DAY_IN_MS - 1_000);
    expect(inserted.expiresAt.getTime()).toBeLessThanOrEqual(afterInsert + DAY_IN_MS + 1_000);
    expect(await service.getByID(inserted.id)).toMatchObject({
      id: inserted.id,
      userID: "user-1",
    });
    expect(await service.getByID("missing-token")).toBeUndefined();
  });

  it("expires a token by clearing its expiration date", async () => {
    const inserted = await service.insert("user-1");
    if (!inserted) throw new Error("Expected token insertion to succeed");

    expect(await service.expire(inserted.id)).toMatchObject({
      id: inserted.id,
      expiresAt: null,
    });
    expect(await service.getByID(inserted.id)).toMatchObject({ expiresAt: null });
  });

  it("deletes only tokens belonging to the selected user", async () => {
    const first = await service.insert("user-1");
    const second = await service.insert("user-1");
    const otherUser = await service.insert("user-2");
    if (!first || !second || !otherUser) throw new Error("Expected token insertion to succeed");

    expect(await service.deleteByUserID("user-1")).not.toBeNull();
    expect(await service.getByID(first.id)).toBeUndefined();
    expect(await service.getByID(second.id)).toBeUndefined();
    expect(await service.getByID(otherUser.id)).toBeDefined();
  });

  it("deletes expired tokens but preserves future and consumed tokens", async () => {
    await testDatabase.database.insert(table.passwordRecover).values([
      {
        id: "expired",
        userID: "user-1",
        expiresAt: new Date("2000-01-01T00:00:00.000Z"),
      },
      {
        id: "future",
        userID: "user-1",
        expiresAt: new Date("2099-01-01T00:00:00.000Z"),
      },
      {
        id: "consumed",
        userID: "user-1",
        expiresAt: null,
      },
    ]);

    await service.deleteAllExpired();

    expect(await service.getByID("expired")).toBeUndefined();
    expect(await service.getByID("future")).toBeDefined();
    expect(await service.getByID("consumed")).toMatchObject({ expiresAt: null });
  });

  it("rejects missing users and cascades tokens when a user is deleted", async () => {
    expect(await service.insert("missing-user")).toBeNull();

    const inserted = await service.insert("user-1");
    if (!inserted) throw new Error("Expected token insertion to succeed");

    await testDatabase.database.delete(table.user).where(eq(table.user.id, "user-1"));

    expect(await service.getByID(inserted.id)).toBeUndefined();
    expect(await testDatabase.database.select().from(table.passwordRecover)).toEqual([]);
  });
});
