import { err, ok, type Result } from "$lib/modules/result";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { createLogger } from "$lib/server/logger";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { and, eq, gt, isNull, lt } from "drizzle-orm";

import { Service } from "./service";

const logger = createLogger("PublicTokenService");

export const publicTokenPurposes = [
  "reservation_access",
  "reservation_confirmation",
  "account_verification",
  "password_reset",
  "email_change",
] as const;

export type PublicTokenPurpose = (typeof publicTokenPurposes)[number];

type IssueToken = {
  purpose: PublicTokenPurpose;
  userID?: string;
  reservationID?: string;
  pendingEmail?: string;
  expiresAt: Date;
};

type TokenStatus =
  | { status: "valid"; token: table.DBPublicToken }
  | { status: "expired" }
  | { status: "consumed" }
  | { status: "invalid" }
  | { status: "error" };

const tokenPrefixes: Record<PublicTokenPurpose, string> = {
  reservation_access: "ra",
  reservation_confirmation: "rc",
  account_verification: "ev",
  password_reset: "pr",
  email_change: "ec",
};

export function hashPublicToken(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export function generatePublicToken(purpose: PublicTokenPurpose) {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `${tokenPrefixes[purpose]}_${encodeBase64url(bytes).replace(/=+$/, "")}`;
}

export class PublicTokenService extends Service {
  async issue(input: IssueToken): Promise<Result<string, "storage-error">> {
    const rawToken = generatePublicToken(input.purpose);
    const tokenHash = hashPublicToken(rawToken);

    try {
      if (input.userID) {
        await db
          .delete(table.publicToken)
          .where(
            and(
              eq(table.publicToken.userID, input.userID),
              eq(table.publicToken.purpose, input.purpose),
              isNull(table.publicToken.consumedAt),
            ),
          );
      }

      await db.insert(table.publicToken).values({
        tokenHash,
        purpose: input.purpose,
        userID: input.userID,
        reservationID: input.reservationID,
        pendingEmail: input.pendingEmail,
        expiresAt: input.expiresAt,
      });

      return ok(rawToken);
    } catch (error) {
      logger.error({ err: error, purpose: input.purpose }, "issue failed");
      return err("storage-error");
    }
  }

  async inspect(rawToken: string, purpose: PublicTokenPurpose): Promise<TokenStatus> {
    const tokenHash = hashPublicToken(rawToken);

    try {
      const token = await db
        .select()
        .from(table.publicToken)
        .where(
          and(eq(table.publicToken.tokenHash, tokenHash), eq(table.publicToken.purpose, purpose)),
        )
        .get();

      if (!token) return { status: "invalid" };
      if (token.consumedAt) return { status: "consumed" };
      if (Date.now() >= token.expiresAt.getTime()) return { status: "expired" };

      return { status: "valid", token };
    } catch (error) {
      logger.error({ err: error, tokenHash, purpose }, "inspect failed");
      return { status: "error" };
    }
  }

  async consume(rawToken: string, purpose: PublicTokenPurpose) {
    const tokenHash = hashPublicToken(rawToken);

    try {
      const consumed = await db
        .update(table.publicToken)
        .set({ consumedAt: new Date() })
        .where(
          and(
            eq(table.publicToken.tokenHash, tokenHash),
            eq(table.publicToken.purpose, purpose),
            isNull(table.publicToken.consumedAt),
            gt(table.publicToken.expiresAt, new Date()),
          ),
        )
        .returning({ tokenHash: table.publicToken.tokenHash })
        .get();

      return Boolean(consumed);
    } catch (error) {
      logger.error({ err: error, tokenHash, purpose }, "consume failed");
      return false;
    }
  }

  async revoke(rawToken: string, purpose: PublicTokenPurpose) {
    const tokenHash = hashPublicToken(rawToken);
    try {
      await db
        .delete(table.publicToken)
        .where(
          and(eq(table.publicToken.tokenHash, tokenHash), eq(table.publicToken.purpose, purpose)),
        );
      return true;
    } catch (error) {
      logger.error({ err: error, tokenHash, purpose }, "revoke failed");
      return false;
    }
  }

  async deleteByUserID(userID: string) {
    try {
      await db.delete(table.publicToken).where(eq(table.publicToken.userID, userID));
    } catch (error) {
      logger.error({ err: error, userId: userID }, "deleteByUserID failed");
    }
  }

  async deleteAllExpired() {
    try {
      await db.delete(table.publicToken).where(lt(table.publicToken.expiresAt, new Date()));
    } catch (error) {
      logger.error({ err: error }, "deleteAllExpired failed");
    }
  }
}
