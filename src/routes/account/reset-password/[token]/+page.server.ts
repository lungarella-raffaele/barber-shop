import { changePasswordSchema } from "$lib/modules/zod-schemas";
import * as auth from "$lib/server/auth";
import { logger } from "$lib/server/logger";
import { expired } from "$lib/utils";
import { PasswordRecoverService } from "@service/password-recover.service";
import { PublicTokenService } from "@service/public-token.service";
import { UserService } from "@service/user.service";
import { fail, redirect } from "@sveltejs/kit";
import { hash } from "argon2";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 as zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types";

type ResetToken =
  | { status: "valid"; userID: string; source: "public" | "legacy" }
  | { status: "expired" | "consumed" | "invalid" | "error" };

async function inspectResetToken(rawToken: string): Promise<ResetToken> {
  const publicToken = await PublicTokenService.get().inspect(rawToken, "password_reset");

  if (publicToken.status === "valid") {
    if (!publicToken.token.userID) return { status: "invalid" };
    return { status: "valid", userID: publicToken.token.userID, source: "public" };
  }

  if (publicToken.status !== "invalid") return publicToken;

  const legacyToken = await PasswordRecoverService.get().getByID(rawToken);
  if (!legacyToken) return { status: "invalid" };
  if (!legacyToken.expiresAt || expired(legacyToken.expiresAt.getTime())) {
    return { status: "expired" };
  }

  return { status: "valid", userID: legacyToken.userID, source: "legacy" };
}

export const load: PageServerLoad = async ({ params }) => {
  const emptyForm = await superValidate(zod(changePasswordSchema));
  const resetToken = await inspectResetToken(params.token);

  if (resetToken.status !== "valid") {
    return {
      status:
        resetToken.status === "expired" || resetToken.status === "consumed" ? "expired" : "invalid",
      changePasswordForm: emptyForm,
    };
  }

  return {
    status: "ready" as const,
    changePasswordForm: emptyForm,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(changePasswordSchema));
    if (!form.valid) {
      return fail(400, { changePasswordForm: form });
    }

    const resetToken = await inspectResetToken(event.params.token);
    if (resetToken.status !== "valid") {
      const text =
        resetToken.status === "expired" || resetToken.status === "consumed"
          ? "La richiesta è scaduta."
          : "C'è stato un problema con la tua richiesta.";
      return message(form, { success: false, text }, { status: 400 });
    }

    const passwordHash = await hash(form.data.newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    const updatedUser = await UserService.get().updatePassword(passwordHash, resetToken.userID);

    if (!updatedUser) {
      logger.error({ userId: resetToken.userID }, "Could not update recovered password");
      return message(
        form,
        { success: false, text: "Impossibile aggiornare la password." },
        { status: 500 },
      );
    }

    const consumed =
      resetToken.source === "public"
        ? await PublicTokenService.get().consume(event.params.token, "password_reset")
        : Boolean(await PasswordRecoverService.get().expire(event.params.token));

    if (!consumed) {
      logger.error({ userId: resetToken.userID }, "Could not consume password reset token");
      return message(
        form,
        {
          success: false,
          text: "La password è stata aggiornata, ma la sessione non è stata avviata.",
        },
        { status: 500 },
      );
    }

    const user = await UserService.get().getByID(resetToken.userID);
    if (!user || !user.data.verifiedEmail) {
      return redirect(303, "/login");
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, user.data.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    redirect(303, user.role === "staff" ? "/dashboard" : "/");
  },
};
