import { err, ok } from "$lib/modules/result";
import { bannerSchema } from "$lib/modules/zod-schemas";
import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("BannerService");

export class BannerService extends Service {
  constructor(private readonly database: Database = getProductionDatabase()) {
    super();
  }

  async get() {
    try {
      return await this.database.select().from(table.banner).get();
    } catch (e) {
      logger.error({ err: e }, "get failed");
      return null;
    }
  }

  async update(message: string, visible: boolean) {
    const parsed = bannerSchema.safeParse({ message, visible });
    if (!parsed.success) {
      logger.error({ err: parsed.error }, "update failed: invalid data");
      return err("Invalid banner data");
    }

    try {
      const result = await this.database
        .insert(table.banner)
        .values({ message: parsed.data.message, visible: parsed.data.visible })
        .onConflictDoUpdate({
          target: table.banner.id,
          set: { message: parsed.data.message, visible: parsed.data.visible },
        })
        .returning()
        .get();
      return ok(result);
    } catch (e) {
      logger.error({ err: e }, "update failed");
      return err("Could not update banner");
    }
  }
}
