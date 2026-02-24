import { avatarOriginalSchema, avatarSchema } from "$lib/modules/zod-schemas";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { Staff } from "@domain";
import { eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("StaffService");

export class StaffService extends Service {
  async getByUserID(userID: string) {
    try {
      return await db.select().from(table.staff).where(eq(table.staff.userID, userID)).get();
    } catch (e) {
      logger.error({ err: e, userId: userID }, "getByUserID failed");
      return null;
    }
  }

  async getAll(): Promise<Staff[] | null> {
    try {
      const result = await db
        .select({
          name: table.user.name,
          id: table.staff.userID,
          avatar: table.staff.avatar,
        })
        .from(table.staff)
        .innerJoin(table.user, eq(table.user.id, table.staff.userID))
        .where(eq(table.staff.isActive, true));

      return result;
    } catch (e) {
      logger.error({ err: e }, "getAll failed");
      return null;
    }
  }

  async toggleActive(isActive: boolean, userID: string): Promise<boolean> {
    try {
      return !!(await db
        .update(table.staff)
        .set({ isActive })
        .where(eq(table.staff.userID, userID)));
    } catch (e) {
      logger.error({ err: e, userId: userID, isActive }, "toggleActive failed");
      return false;
    }
  }

  async deleteAvatar(userID: string) {
    try {
      return await db
        .update(table.staff)
        .set({
          avatar: null,
          avatarOriginal: null,
          avatarOffsetX: null,
          avatarOffsetY: null,
          avatarDisplayScale: null,
        })
        .where(eq(table.staff.userID, userID))
        .returning()
        .get();
    } catch (e) {
      logger.error({ err: e, userId: userID }, "deleteAvatar failed");
      return null;
    }
  }

  async updateAvatar(
    userID: string,
    avatar: string,
    avatarOriginal: string,
    offsetX: number,
    offsetY: number,
    displayScale: number,
  ) {
    const parsedAvatar = avatarSchema.safeParse(avatar);
    if (!parsedAvatar.success) {
      logger.error(
        { err: parsedAvatar.error, userId: userID },
        "updateAvatar failed: invalid avatar",
      );
      return null;
    }

    const parsedOriginal = avatarOriginalSchema.safeParse(avatarOriginal);
    if (!parsedOriginal.success) {
      logger.error(
        { err: parsedOriginal.error, userId: userID },
        "updateAvatar failed: invalid original",
      );
      return null;
    }

    try {
      return await db
        .update(table.staff)
        .set({
          avatar: parsedAvatar.data,
          avatarOriginal: parsedOriginal.data,
          avatarOffsetX: offsetX,
          avatarOffsetY: offsetY,
          avatarDisplayScale: displayScale,
        })
        .where(eq(table.staff.userID, userID))
        .returning()
        .get();
    } catch (e) {
      logger.error({ err: e, userId: userID }, "updateAvatar failed");
      return null;
    }
  }
}
