import { err, ok } from "$lib/modules/result";
import { bannerSchema } from "$lib/modules/zod-schemas";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("BannerService");

export class BannerService extends Service {
  async get() {
    try {
      const result = await db.select().from(table.banner).get();
      logger.info("get succeeded");
      return result;
    } catch (e) {
      logger.error({ err: e }, "get failed");
      return null;
    }
  }

  async update(message: string, visible: boolean) {
    const parsed = bannerSchema.safeParse({ message, visible });
    if (!parsed.success) {
      logger.error({ err: parsed.error }, "update failed: invalid data");
      return err("");
    }

    try {
      const result = await db
        .insert(table.banner)
        .values({ message: parsed.data.message, visible: parsed.data.visible })
        .onConflictDoUpdate({
          target: table.banner.id,
          set: { message: parsed.data.message, visible: parsed.data.visible },
        })
        .returning()
        .get();
      logger.info("update succeeded");
      return ok(result);
    } catch (e) {
      logger.error({ err: e }, "update failed");
      return err("");
    }
  }
}
