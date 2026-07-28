import { ok, err, type Result } from "$lib/modules/result";
import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("KindService");

export class KindService extends Service {
  constructor(private readonly database: Database = getProductionDatabase()) {
    super();
  }

  async getAll(onlyActive: boolean = true) {
    try {
      const query = this.database.select().from(table.kind);

      if (onlyActive) {
        return await query.where(eq(table.kind.active, true));
      }

      return await query;
    } catch {
      return null;
    }
  }

  async getByStaff(staffID: string) {
    try {
      return await this.database.select().from(table.kind).where(eq(table.kind.staffID, staffID));
    } catch {
      return null;
    }
  }

  async insert(kind: table.NewKind): Promise<Result<table.DBKind, string>> {
    try {
      return ok(await this.database.insert(table.kind).values(kind).returning().get());
    } catch (e) {
      logger.error({ err: e, kindID: kind.id }, "insert failed");
      return err("Could not insert kind");
    }
  }

  async update(kind: table.NewKind) {
    try {
      // Make sure we have an ID for the update
      if (!kind.id) {
        logger.error({ kind }, "update called without ID");
        return null;
      }

      const { id: _, ...kindWID } = kind;

      return await this.database
        .update(table.kind)
        .set(kindWID)
        .where(eq(table.kind.id, kind.id))
        .returning()
        .get();
    } catch (err) {
      logger.error({ err, kindID: kind.id }, "update failed");
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.database.delete(table.kind).where(eq(table.kind.id, id)).returning().get();
    } catch (e) {
      logger.error({ err: e, kindID: id }, "delete failed");
      return null;
    }
  }
}
