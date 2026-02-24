import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("SessionService");

export class SessionService extends Service {
  async insert(session: table.NewSession) {
    try {
      return await db.insert(table.session).values(session);
    } catch (e) {
      logger.error({ err: e, sessionId: session.id }, "insert failed");
      return null;
    }
  }

  async getByID(sessionID: string) {
    try {
      return await db.select().from(table.session).where(eq(table.session.id, sessionID)).get();
    } catch (e) {
      logger.error({ err: e, sessionId: sessionID }, "getByID failed");
      return null;
    }
  }

  async delete(sessionID: string) {
    try {
      return await db.delete(table.session).where(eq(table.session.id, sessionID));
    } catch (e) {
      logger.error({ err: e, sessionId: sessionID }, "delete failed");
      return null;
    }
  }

  async deleteAllByUserID(userID: string) {
    try {
      return await db.delete(table.session).where(eq(table.session.userID, userID));
    } catch (e) {
      logger.error({ err: e, userId: userID }, "deleteAllByUserID failed");
      return null;
    }
  }
}
