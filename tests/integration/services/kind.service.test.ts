import * as table from "$lib/server/db/schema";
import { KindService } from "$lib/server/services/kind.service";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedKind, seedStaff } from "../../support/fixtures";

describe("KindService", () => {
  let testDatabase: TestDatabase;
  let service: KindService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    await seedStaff(testDatabase.database);
    await seedStaff(testDatabase.database, {
      id: "staff-2",
      name: "Second Barber",
      email: "second-barber@example.com",
    });
    service = new KindService(testDatabase.database);
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("returns only active kinds by default", async () => {
    await seedKind(testDatabase.database, { id: "active", active: true });
    await seedKind(testDatabase.database, { id: "inactive", active: false });

    expect(await service.getAll()).toEqual([
      expect.objectContaining({ id: "active", active: true }),
    ]);
    expect(await service.getAll(false)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "active" }),
        expect.objectContaining({ id: "inactive" }),
      ]),
    );
  });

  it("filters kinds by staff", async () => {
    await seedKind(testDatabase.database, { id: "staff-1-kind" });
    await seedKind(testDatabase.database, {
      id: "staff-2-kind",
      staffID: "staff-2",
      name: "Second Haircut",
    });

    expect(await service.getByStaff("staff-1")).toEqual([
      expect.objectContaining({ id: "staff-1-kind", staffID: "staff-1" }),
    ]);
    expect(await service.getByStaff("staff-2")).toEqual([
      expect.objectContaining({ id: "staff-2-kind", staffID: "staff-2" }),
    ]);
  });

  it("inserts, updates, and deletes a kind", async () => {
    const inserted = await service.insert({
      id: "haircut",
      staffID: "staff-1",
      name: "Haircut",
      description: "Initial description",
      duration: 30,
      price: 2_000,
      active: false,
    });
    expect(inserted.isOk()).toBe(true);
    if (inserted.isErr()) throw new Error(`Kind insertion failed: ${inserted.error}`);

    expect(
      await service.update({
        id: "haircut",
        staffID: "staff-1",
        name: "Premium Haircut",
        description: "Updated description",
        duration: 45,
        price: 3_000,
        active: true,
      }),
    ).toMatchObject({
      id: "haircut",
      name: "Premium Haircut",
      duration: 45,
      price: 3_000,
      active: true,
    });

    expect(await service.delete("haircut")).toMatchObject({ id: "haircut" });
    expect(await service.getAll(false)).toEqual([]);
  });

  it("rejects a kind for missing staff without leaving a row", async () => {
    const result = await service.insert({
      id: "orphan-kind",
      staffID: "missing-staff",
      name: "Orphan Kind",
      duration: 30,
      price: 2_000,
      active: true,
    });

    expect(result.isErr()).toBe(true);
    expect(await testDatabase.database.select().from(table.kind)).toEqual([]);
  });

  it("does not delete a kind referenced by a reservation", async () => {
    await seedKind(testDatabase.database, { id: "reserved-kind" });
    await testDatabase.database.insert(table.reservation).values({
      id: "reservation-1",
      date: "2099-06-15",
      hour: "10:00",
      name: "Customer",
      email: "customer@example.com",
      expiresAt: new Date("2099-06-16T00:00:00.000Z"),
      staffID: "staff-1",
    });
    await testDatabase.database.insert(table.reservationKind).values({
      reservationID: "reservation-1",
      kindID: "reserved-kind",
      position: 0,
    });

    expect(await service.delete("reserved-kind")).toBeNull();
    expect(await service.getAll(false)).toEqual([expect.objectContaining({ id: "reserved-kind" })]);
  });
});
