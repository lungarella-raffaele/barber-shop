import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";
import type { ScheduleRow, NewScheduleRow } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("ScheduleService");

export class ScheduleService extends Service {
  constructor(private readonly database: Database = getProductionDatabase()) {
    super();
  }

  async getAll(): Promise<ScheduleRow[] | null> {
    try {
      return this.database.select().from(table.schedule);
    } catch (e) {
      logger.error({ err: e }, "getAll failed");
      return null;
    }
  }

  async getByStaff(staffID: string): Promise<ScheduleRow[] | null> {
    try {
      return this.database.select().from(table.schedule).where(eq(table.schedule.staffID, staffID));
    } catch (e) {
      logger.error({ err: e, staffID }, "getByStaff failed");
      return null;
    }
  }

  async update(schedules: NewScheduleRow[], staffID: string): Promise<boolean> {
    try {
      return await this.database.transaction(async (tx) => {
        await tx.delete(table.schedule).where(eq(table.schedule.staffID, staffID));
        if (schedules.length === 0) return true;

        const result = await tx.insert(table.schedule).values(schedules).returning();
        return result.length === schedules.length;
      });
    } catch (e) {
      logger.error({ err: e, staffID }, "update failed");
      return false;
    }
  }

  async delete(id: number, staffID: string): Promise<boolean> {
    try {
      const deleted = await this.database
        .delete(table.schedule)
        .where(and(eq(table.schedule.id, id), eq(table.schedule.staffID, staffID)))
        .returning({ id: table.schedule.id });
      return deleted.length === 1;
    } catch (e) {
      logger.error({ err: e, scheduleId: id, staffID }, "delete failed");
      return false;
    }
  }
}
