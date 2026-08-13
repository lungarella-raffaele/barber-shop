import * as table from "$lib/server/db/schema";
import {
  reservationConfirmationExpiresAt,
  ReservationService,
} from "$lib/server/services/reservation.service";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedOffering, seedStaff, seedUser } from "../../support/fixtures";

describe("ReservationService", () => {
  let testDatabase: TestDatabase;
  let service: ReservationService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    await seedStaff(testDatabase.database);
    await testDatabase.database
      .update(table.staff)
      .set({ isActive: true })
      .where(eq(table.staff.userID, "staff-1"));
    await testDatabase.database.insert(table.schedule).values(
      Array.from({ length: 7 }, (_, day) => ({
        staffID: "staff-1",
        day,
        startHour: 9,
        startMinute: 0,
        endHour: 18,
        endMinute: 0,
      })),
    );
    await seedOffering(testDatabase.database, {
      id: "haircut",
      name: "Haircut",
      duration: 30,
      price: 2_000,
    });
    await seedOffering(testDatabase.database, {
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

  it("inserts an anonymous reservation and preserves offering order", async () => {
    const result = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "  CUSTOMER@EXAMPLE.COM ",
      phone: "123456789",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["beard", "haircut"],
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
    expect(result.value.offerings.map((offering) => offering.id)).toEqual(["beard", "haircut"]);
    expect(result.value.expiresAt.getTime()).toBeGreaterThan(Date.now());

    const junctionRows = await testDatabase.database
      .select()
      .from(table.reservationOffering)
      .where(eq(table.reservationOffering.reservationID, result.value.id));
    expect(junctionRows).toEqual([
      { reservationID: result.value.id, offeringID: "beard", position: 0 },
      { reservationID: result.value.id, offeringID: "haircut", position: 1 },
    ]);
  });

  it("rejects malformed dates and times without leaving partial rows", async () => {
    for (const [date, hour] of [
      ["2099-02-30", "10:00"],
      ["2099-06-15", "9:00"],
      ["2099-06-15", "24:00"],
    ]) {
      const result = await service.insertByAnonymous({
        who: "anonymous",
        name: "Customer",
        email: "customer@example.com",
        date,
        hour,
        offerings: ["haircut"],
        staff: "staff-1",
      });
      expect(result.isErr() && result.error).toBe("invalid-data");
    }

    expect(await testDatabase.database.select().from(table.reservation)).toEqual([]);
    expect(await testDatabase.database.select().from(table.reservationOffering)).toEqual([]);
  });

  it("rejects invalid offerings without leaving partial rows", async () => {
    const result = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut", "missing-offering"],
      staff: "staff-1",
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) throw new Error("Expected insertion to fail");
    expect(result.error).toBe("invalid-data");
    expect(await testDatabase.database.select().from(table.reservation)).toEqual([]);
    expect(await testDatabase.database.select().from(table.reservationOffering)).toEqual([]);
  });

  it("rejects past appointments", async () => {
    const result = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2020-06-15",
      hour: "10:00",
      offerings: ["haircut"],
      staff: "staff-1",
    });

    expect(result.isErr() && result.error).toBe("invalid-data");
  });

  it("rejects inactive staff and inactive services", async () => {
    await testDatabase.database
      .update(table.staff)
      .set({ isActive: false })
      .where(eq(table.staff.userID, "staff-1"));
    const inactiveStaff = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut"],
      staff: "staff-1",
    });
    expect(inactiveStaff.isErr() && inactiveStaff.error).toBe("invalid-data");

    await testDatabase.database
      .update(table.staff)
      .set({ isActive: true })
      .where(eq(table.staff.userID, "staff-1"));
    await testDatabase.database
      .update(table.offering)
      .set({ active: false })
      .where(eq(table.offering.id, "haircut"));
    const inactiveOffering = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut"],
      staff: "staff-1",
    });
    expect(inactiveOffering.isErr() && inactiveOffering.error).toBe("invalid-data");
    expect(await testDatabase.database.select().from(table.reservation)).toEqual([]);
  });

  it("rejects appointments outside schedule containment", async () => {
    for (const hour of ["08:45", "17:45"]) {
      const result = await service.insertByAnonymous({
        who: "anonymous",
        name: "Customer",
        email: "customer@example.com",
        date: "2099-06-15",
        hour,
        offerings: ["haircut"],
        staff: "staff-1",
      });
      expect(result.isErr() && result.error).toBe("invalid-data");
    }
    expect(await testDatabase.database.select().from(table.reservation)).toEqual([]);
  });

  it("rejects appointments during an inclusive shutdown", async () => {
    await testDatabase.database.insert(table.shutdowns).values({
      id: "summer-shutdown",
      staffID: "staff-1",
      start: "2099-06-15",
      end: "2099-06-20",
    });
    const result = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut"],
      staff: "staff-1",
    });

    expect(result.isErr() && result.error).toBe("invalid-data");
    expect(await testDatabase.database.select().from(table.reservation)).toEqual([]);
  });

  it("rejects overlaps but allows adjacent reservations", async () => {
    const first = await service.insertByAnonymous({
      who: "anonymous",
      name: "First Customer",
      email: "first@example.com",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut", "beard"],
      staff: "staff-1",
    });
    expect(first.isOk()).toBe(true);

    const overlapping = await service.insertByAnonymous({
      who: "anonymous",
      name: "Second Customer",
      email: "second@example.com",
      date: "2099-06-15",
      hour: "10:30",
      offerings: ["haircut"],
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
      offerings: ["haircut"],
      staff: "staff-1",
    });
    expect(adjacent.isOk()).toBe(true);
    expect(await testDatabase.database.select().from(table.reservation)).toHaveLength(2);
  });

  it("expires confirmed reservations at the next midnight in Europe/Rome", async () => {
    await seedUser(testDatabase.database, {
      id: "customer-user",
      name: "Customer",
      email: "customer@example.com",
    });
    const [customer] = await testDatabase.database
      .select()
      .from(table.user)
      .where(eq(table.user.id, "customer-user"));
    const result = await service.insertByUser(
      {
        who: "usual",
        date: "2099-06-15",
        hour: "10:00",
        offerings: ["haircut"],
        staff: "staff-1",
      },
      customer,
    );
    if (result.isErr()) throw new Error(`Insertion failed: ${result.error}`);

    expect(result.value.expiresAt.toISOString()).toBe("2099-06-15T22:00:00.000Z");
  });

  it("uses the canonical reservation confirmation expiration", () => {
    expect(reservationConfirmationExpiresAt(1_000).getTime()).toBe(601_000);
  });

  it("returns occupied slots without reservation or customer identifiers", async () => {
    const inserted = await service.insertByAnonymous({
      who: "anonymous",
      name: "Private Customer",
      email: "private@example.com",
      phone: "123456789",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut"],
      staff: "staff-1",
    });
    if (inserted.isErr()) throw new Error(`Insertion failed: ${inserted.error}`);

    expect(await service.getOccupiedSlots()).toEqual([
      {
        date: "2099-06-15",
        hour: "10:00",
        staff: { id: "staff-1" },
        offerings: [{ duration: 30 }],
      },
    ]);
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
        offerings: ["haircut"],
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

  it("atomically scopes deletion to the authenticated staff", async () => {
    const inserted = await service.insertByAnonymous({
      who: "anonymous",
      name: "Customer",
      email: "customer@example.com",
      date: "2099-06-15",
      hour: "10:00",
      offerings: ["haircut"],
      staff: "staff-1",
    });
    if (inserted.isErr()) throw new Error(`Insertion failed: ${inserted.error}`);

    expect(await service.deleteByStaff(inserted.value.id, "other-staff")).toEqual([]);
    expect(await service.getByID(inserted.value.id)).not.toBeNull();

    expect(await service.deleteByStaff(inserted.value.id, "staff-1")).toHaveLength(1);
    expect(await service.getByID(inserted.value.id)).toBeNull();
  });

  it("normalizes ownership checks and cascades reservation-offering deletion", async () => {
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
      offerings: ["haircut"],
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
    expect(await testDatabase.database.select().from(table.reservationOffering)).toEqual([]);
  });
});
