import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { DBSchedule, Schedule } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("ScheduleService");

export class ScheduleService extends Service {
  async getAll(): Promise<DBSchedule[] | null> {
    try {
      return db.select().from(table.schedule);
    } catch (e) {
      logger.error({ err: e }, "getAll failed");
      return null;
    }
  }

  async update(schedules: Schedule[], staffID: string): Promise<boolean> {
    try {
      const result = await db.transaction(async (tx) => {
        await tx.delete(table.schedule).where(eq(table.schedule.staffID, staffID));
        return await tx.insert(table.schedule).values(schedules).returning();
      });
      return !!result.length;
    } catch (e) {
      logger.error({ err: e, staffID }, "update failed");
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await db.delete(table.schedule).where(eq(table.schedule.id, id));
      return true;
    } catch (e) {
      logger.error({ err: e, scheduleId: id }, "delete failed");
      return false;
    }
  }
}
