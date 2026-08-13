import { ok, err, type Result } from "$lib/modules/result";
import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("OfferingService");

export class OfferingService extends Service {
  constructor(private readonly database: Database = getProductionDatabase()) {
    super();
  }

  async getAll(onlyActive: boolean = true) {
    try {
      const query = this.database.select().from(table.offering);

      if (onlyActive) {
        return await query.where(eq(table.offering.active, true));
      }

      return await query;
    } catch {
      return null;
    }
  }

  async getByStaff(staffID: string) {
    try {
      return await this.database
        .select()
        .from(table.offering)
        .where(eq(table.offering.staffID, staffID));
    } catch {
      return null;
    }
  }

  async insert(offering: table.NewOfferingRow): Promise<Result<table.OfferingRow, string>> {
    try {
      return ok(await this.database.insert(table.offering).values(offering).returning().get());
    } catch (e) {
      logger.error({ err: e, offeringID: offering.id }, "insert failed");
      return err("Could not insert offering");
    }
  }

  async update(offering: table.NewOfferingRow) {
    try {
      // Make sure we have an ID for the update
      if (!offering.id) {
        logger.error({ offering }, "update called without ID");
        return null;
      }

      const { id: _, ...offeringWID } = offering;

      return (
        (await this.database
          .update(table.offering)
          .set(offeringWID)
          .where(
            and(eq(table.offering.id, offering.id), eq(table.offering.staffID, offering.staffID)),
          )
          .returning()
          .get()) ?? null
      );
    } catch (err) {
      logger.error({ err, offeringID: offering.id }, "update failed");
      return null;
    }
  }

  async delete(id: string, staffID: string) {
    try {
      return (
        (await this.database
          .delete(table.offering)
          .where(and(eq(table.offering.id, id), eq(table.offering.staffID, staffID)))
          .returning()
          .get()) ?? null
      );
    } catch (e) {
      logger.error({ err: e, offeringID: id, staffID }, "delete failed");
      return null;
    }
  }
}
