import { toSessionUserDTO } from "$lib/server/mappers/session-user.mapper";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
  if (!locals.user || locals.user.role !== "staff") {
    redirect(301, "/login");
  }

  return {
    user: toSessionUserDTO(locals.user),
  };
};
