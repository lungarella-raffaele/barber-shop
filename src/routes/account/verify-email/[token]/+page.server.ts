import * as auth from "$lib/server/auth";
import { UserService } from "@service/user.service";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const user = await UserService.get().getByID(event.params.token);

  if (!user) {
    return { status: "invalid" as const };
  }

  if (user.data.verifiedEmail) {
    return { status: "already-verified" as const };
  }

  const verifiedUser = await UserService.get().verifyEmail(user.data.id);
  if (!verifiedUser) {
    return { status: "error" as const };
  }

  const sessionToken = auth.generateSessionToken();
  const session = await auth.createSession(sessionToken, verifiedUser.id);
  auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

  redirect(303, event.url.pathname);
};
