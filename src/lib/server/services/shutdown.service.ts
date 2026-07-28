import { shutdownSchema } from "$lib/modules/zod-schemas";
import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";
import type { DBShutdown } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("ShutdownService");

export class ShutdownService extends Service {
  constructor(private readonly database: Database = getProductionDatabase()) {
    super();
  }

  async getAll(): Promise<DBShutdown[] | null> {
    try {
      return await this.database.select().from(table.shutdowns);
    } catch (e) {
      logger.error({ err: e }, "getAll failed");
      return null;
    }
  }

  async getStaffShutdown(staffID: string): Promise<DBShutdown[] | null> {
    try {
      return await this.database
        .select()
        .from(table.shutdowns)
        .where(eq(table.shutdowns.staffID, staffID));
    } catch (e) {
      logger.error({ err: e, staffId: staffID }, "getStaffShutdown failed");
      return null;
    }
  }

  async insert(start: string, end: string, staffID: string) {
    const parsed = shutdownSchema.safeParse({ start, end, staffID });
    if (!parsed.success) {
      logger.error({ err: parsed.error }, "insert failed: invalid data");
      return null;
    }

    try {
      return await this.database
        .insert(table.shutdowns)
        .values({
          id: crypto.randomUUID(),
          start: parsed.data.start,
          end: parsed.data.end,
          staffID: parsed.data.staffID,
        })
        .returning({ id: table.shutdowns.id })
        .get();
    } catch (e) {
      logger.error(
        { err: e, staffId: parsed.data.staffID, start: parsed.data.start, end: parsed.data.end },
        "insert failed",
      );
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.database
        .delete(table.shutdowns)
        .where(eq(table.shutdowns.id, id))
        .returning({ id: table.shutdowns.id });
    } catch (e) {
      logger.error({ err: e, shutdownId: id }, "delete failed");
      return null;
    }
  }
}
