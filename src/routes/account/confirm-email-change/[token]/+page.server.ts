import { expired } from "$lib/utils";
import { EmailVerificationService } from "@service/email-verification.service";
import { UserService } from "@service/user.service";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    return { status: "unauthorized" as const };
  }

  const verificationService = EmailVerificationService.get();
  const verification = await verificationService.getByID(params.token);

  if (!verification) {
    return { status: "invalid" as const };
  }

  if (verification.userID !== locals.user.data.id) {
    return { status: "forbidden" as const };
  }

  if (!verification.expiresAt || expired(verification.expiresAt.getTime())) {
    return { status: "expired" as const };
  }

  const updatedEmail = await UserService.get().updateEmail(verification.userID, verification.email);
  if (!updatedEmail.isOk()) {
    return { status: "error" as const };
  }

  await verificationService.delete(verification.id);

  return {
    status: "confirmed" as const,
    email: updatedEmail.value.email,
  };
};
