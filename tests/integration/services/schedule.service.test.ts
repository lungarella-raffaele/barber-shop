import { ScheduleService } from "$lib/server/services/schedule.service";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../../support/database";
import { seedStaff } from "../../support/fixtures";

describe("ScheduleService", () => {
  let testDatabase: TestDatabase;
  let service: ScheduleService;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
    await seedStaff(testDatabase.database);
    service = new ScheduleService(testDatabase.database);
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("replaces, reads, and deletes a staff schedule", async () => {
    const created = await service.update(
      [
        {
          staffID: "staff-1",
          day: 1,
          startHour: 9,
          endHour: 12,
        },
        {
          staffID: "staff-1",
          day: 1,
          startHour: 13,
          endHour: 17,
        },
      ],
      "staff-1",
    );

    expect(created).toBe(true);
    expect(await service.getAll()).toHaveLength(2);

    const replaced = await service.update(
      [
        {
          staffID: "staff-1",
          day: 2,
          startHour: 10,
          endHour: 16,
        },
      ],
      "staff-1",
    );

    expect(replaced).toBe(true);

    const schedules = await service.getAll();
    expect(schedules).toHaveLength(1);
    expect(schedules?.[0]).toMatchObject({
      staffID: "staff-1",
      day: 2,
      startHour: 10,
      startMinute: 0,
      endHour: 16,
      endMinute: 0,
    });

    const schedule = schedules?.[0];
    expect(schedule).toBeDefined();
    if (!schedule) throw new Error("Expected the replacement schedule to exist");

    expect(await service.delete(schedule.id)).toBe(true);
    expect(await service.getAll()).toEqual([]);
  });
});
