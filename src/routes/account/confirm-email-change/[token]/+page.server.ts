import { PublicTokenService } from "@service/public-token.service";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user || !locals.session) {
    return { status: "unauthorized" as const };
  }

  const token = await PublicTokenService.get().inspect(params.token, "email_change");

  if (token.status !== "valid") {
    return {
      status:
        token.status === "expired" || token.status === "consumed"
          ? ("expired" as const)
          : token.status === "error"
            ? ("error" as const)
            : ("invalid" as const),
    };
  }

  return {
    status:
      token.token.userID === locals.user.account.id ? ("ready" as const) : ("forbidden" as const),
  };
};

export const actions: Actions = {
  default: async ({ locals, params }) => {
    if (!locals.user || !locals.session) {
      return { status: "unauthorized" as const };
    }

    const tokenService = PublicTokenService.get();
    const token = await tokenService.inspect(params.token, "email_change");
    if (token.status !== "valid") {
      return {
        status:
          token.status === "expired" || token.status === "consumed"
            ? ("expired" as const)
            : token.status === "error"
              ? ("error" as const)
              : ("invalid" as const),
      };
    }
    if (token.token.userID !== locals.user.account.id) {
      return { status: "forbidden" as const };
    }

    const updatedUser = await tokenService.confirmEmailChange(
      params.token,
      locals.user.account.id,
      locals.session.id,
    );
    if (!updatedUser) {
      return { status: "error" as const };
    }

    return { status: "confirmed" as const, email: updatedUser.email };
  },
};
