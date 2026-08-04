import * as table from "$lib/server/db/schema";
import { ReservationService } from "$lib/server/services/reservation.service";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedKind, seedStaff, seedUser } from "../../support/fixtures";

describe("ReservationService", () => {
  let testDatabase: TestDatabase;
  let service: ReservationService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    await seedStaff(testDatabase.database);
    await seedKind(testDatabase.database, {
      id: "haircut",
      name: "Haircut",
      duration: 30,
      price: 2_000,
    });
    await seedKind(testDatabase.database, {
      id: "beard",
      name: "Beard trim",
      duration: 15,
      price: 1_000,
    });
    service = new ReservationService(testDatabase.database);
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("inserts an anonymous reservation and preserves kind order", async () => {
    const result = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "  CUSTOMER@EXAMPLE.COM ",
      phone: "123456789",
      date: "2099-06-15",
      hour: "10:00",
      kinds: ["beard", "haircut"],
      staff: "staff-1",
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) throw new Error(`Insertion failed: ${result.error}`);

    expect(result.value).toMatchObject({
      name: "Customer",
      email: "customer@example.com",
      pending: true,
      staff: { id: "staff-1", name: "Test Barber" },
      user: null,
    });
    expect(result.value.kinds.map((kind) => kind.id)).toEqual(["beard", "haircut"]);
    expect(result.value.expiresAt.getTime()).toBeGreaterThan(Date.now());

    const junctionRows = await testDatabase.database
      .select()
      .from(table.reservationKind)
      .where(eq(table.reservationKind.reservationID, result.value.id));
    expect(junctionRows).toEqual([
      { reservationID: result.value.id, kindID: "beard", position: 0 },
      { reservationID: result.value.id, kindID: "haircut", position: 1 },
    ]);
  });

  it("rejects invalid kinds without leaving partial rows", async () => {
    const result = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      kinds: ["haircut", "missing-kind"],
      staff: "staff-1",
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) throw new Error("Expected insertion to fail");
    expect(result.error).toBe("invalid-data");
    expect(await testDatabase.database.select().from(table.reservation)).toEqual([]);
    expect(await testDatabase.database.select().from(table.reservationKind)).toEqual([]);
  });

  it("rejects overlaps but allows adjacent reservations", async () => {
    const first = await service.insertByAnonymous({
      who: "anonymous",
      name: "First Customer",
      email: "first@example.com",
      date: "2099-06-15",
      hour: "10:00",
      kinds: ["haircut", "beard"],
      staff: "staff-1",
    });
    expect(first.isOk()).toBe(true);

    const overlapping = await service.insertByAnonymous({
      who: "anonymous",
      name: "Second Customer",
      email: "second@example.com",
      date: "2099-06-15",
      hour: "10:30",
      kinds: ["haircut"],
      staff: "staff-1",
    });
    expect(overlapping.isErr()).toBe(true);
    if (overlapping.isOk()) throw new Error("Expected overlapping insertion to fail");
    expect(overlapping.error).toBe("conflict");

    const adjacent = await service.insertByAnonymous({
      who: "anonymous",
      name: "Third Customer",
      email: "third@example.com",
      date: "2099-06-15",
      hour: "10:45",
      kinds: ["haircut"],
      staff: "staff-1",
    });
    expect(adjacent.isOk()).toBe(true);
    expect(await testDatabase.database.select().from(table.reservation)).toHaveLength(2);
  });

  it("keeps stable ownership across email changes and email reuse", async () => {
    await seedUser(testDatabase.database, {
      id: "customer-user",
      name: "Original Customer",
      email: "customer@example.com",
    });
    const [customer] = await testDatabase.database
      .select()
      .from(table.user)
      .where(eq(table.user.id, "customer-user"));

    const inserted = await service.insertByUser(
      {
        who: "usual",
        date: "2099-06-15",
        hour: "10:00",
        kinds: ["haircut"],
        staff: "staff-1",
      },
      customer,
    );
    if (inserted.isErr()) throw new Error(`Insertion failed: ${inserted.error}`);

    await testDatabase.database
      .update(table.user)
      .set({ email: "new@example.com" })
      .where(eq(table.user.id, customer.id));
    await seedUser(testDatabase.database, {
      id: "replacement-user",
      email: "customer@example.com",
    });

    const originalOwner = await service.getByIDForUser(
      inserted.value.id,
      customer.id,
      "new@example.com",
    );
    const replacementOwner = await service.getByIDForUser(
      inserted.value.id,
      "replacement-user",
      "customer@example.com",
    );

    expect(originalOwner?.id).toBe(inserted.value.id);
    expect(originalOwner?.email).toBe("customer@example.com");
    expect(replacementOwner).toBeNull();
  });

  it("normalizes ownership checks and cascades reservation-kind deletion", async () => {
    await seedUser(testDatabase.database, {
      id: "customer-user",
      email: "customer@example.com",
    });

    const inserted = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      kinds: ["haircut"],
      staff: "staff-1",
    });
    if (inserted.isErr()) throw new Error(`Insertion failed: ${inserted.error}`);

    expect(
      await service.deleteByUser(inserted.value.id, "wrong-user", "wrong@example.com"),
    ).toEqual([]);
    expect(await service.getByID(inserted.value.id)).not.toBeNull();

    const deleted = await service.deleteByUser(
      inserted.value.id,
      "customer-user",
      "  CUSTOMER@EXAMPLE.COM ",
    );
    expect(deleted).toHaveLength(1);
    expect(await service.getByID(inserted.value.id)).toBeNull();
    expect(await testDatabase.database.select().from(table.reservationKind)).toEqual([]);
  });
});
