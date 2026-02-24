import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { and, eq, isNotNull, lt } from "drizzle-orm";

import { createLogger } from "../logger";
import { EmailVerificationService } from "./email-verification.service";
import { PasswordRecoverService } from "./password-recover.service";
import { PublicTokenService } from "./public-token.service";
import { ReservationService } from "./reservation.service";
import { Service } from "./service";
import { SessionService } from "./session.service";
import { UserService } from "./user.service";

const logger = createLogger("CleanupService");

export class CleanupService extends Service {
  async deleteExpiredItems() {
    try {
      const reservationService = ReservationService.get();
      const emailVerificationService = EmailVerificationService.get();
      const passwordRecoverService = PasswordRecoverService.get();
      const publicTokenService = PublicTokenService.get();

      await Promise.all([
        reservationService.deleteAllExpired(),
        emailVerificationService.deleteAllExpired(),
        passwordRecoverService.deleteAllExpired(),
        publicTokenService.deleteAllExpired(),
      ]);

      await this.deleteExpiredUsers();
    } catch (e) {
      logger.error({ err: e }, "deleteExpiredItems failed");
      return null;
    }
  }

  private async deleteExpiredUsers() {
    try {
      const sessionService = SessionService.get();
      const passwordRecoverService = PasswordRecoverService.get();
      const publicTokenService = PublicTokenService.get();
      const reservationService = ReservationService.get();

      const expiredUsers = await db
        .select({ id: table.user.id, email: table.user.email })
        .from(table.user)
        .where(
          and(
            eq(table.user.verifiedEmail, false),
            isNotNull(table.user.expiresAt),
            lt(table.user.expiresAt, new Date()),
          ),
        );

      if (expiredUsers.length === 0) {
        return;
      }

      await Promise.all(
        expiredUsers.map((user) =>
          Promise.all([
            sessionService.deleteAllByUserID(user.id),
            passwordRecoverService.deleteByUserID(user.id),
            publicTokenService.deleteByUserID(user.id),
            reservationService.deleteAll(user.email),
          ]),
        ),
      );

      await UserService.get().deleteAllExpired();
    } catch (err) {
      logger.error({ err }, "deleteExpiredUsers failed");
    }
  }
}
