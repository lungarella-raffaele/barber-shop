import * as auth from "$lib/server/auth";
import { PublicTokenService } from "@service/public-token.service";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const token = await PublicTokenService.get().inspect(params.token, "account_verification");

  if (token.status === "valid" && token.token.userID) {
    return { status: "ready" as const };
  }

  return {
    status:
      token.status === "expired" || token.status === "consumed"
        ? ("already-verified" as const)
        : token.status === "error"
          ? ("error" as const)
          : ("invalid" as const),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const verifiedUser = await PublicTokenService.get().verifyAccount(event.params.token);
    if (!verifiedUser) {
      return { status: "error" as const };
    }

    const sessionToken = auth.generateSessionToken();
    try {
      const session = await auth.createSession(sessionToken, verifiedUser.id);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch {
      return { status: "error" as const };
    }

    return { status: "already-verified" as const };
  },
};
