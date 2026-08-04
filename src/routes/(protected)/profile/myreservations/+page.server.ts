import { logger } from "$lib/server/logger";
import { ReservationService } from "@service/reservation.service";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(303, "/login");
  }

  const reservations = await ReservationService.get().getByUser(
    locals.user.data.id,
    locals.user.data.email,
  );

  if (!reservations) {
    return error(500);
  }

  logger.info(`Retrieved ${reservations.length} reservations`);

  return { reservations, title: "Prenotazioni -" };
};

export const actions: Actions = {
  delete: async ({ locals, request }) => {
    if (!locals.user) {
      redirect(303, "/login");
    }

    const data = await request.formData();
    const id = data.get("id")?.toString();

    if (!id) {
      return fail(400, { success: false });
    }

    const res = await ReservationService.get().deleteByUser(
      id,
      locals.user.data.id,
      locals.user.data.email,
    );

    if (res && res.length > 0) {
      return { res };
    }

    return fail(404, { success: false });
  },
  deleteBatch: async ({ locals, request }) => {
    if (!locals.user) {
      redirect(303, "/login");
    }

    const data = await request.formData();
    const ids = data
      .getAll("ids")
      .map((id) => id.toString())
      .filter(Boolean);

    if (ids.length === 0) {
      return fail(400, { success: false });
    }

    const res = await ReservationService.get().deleteManyByUser(
      ids,
      locals.user.data.id,
      locals.user.data.email,
    );

    if (res) {
      return { res, deleted: res.length };
    }

    return fail(500, { success: false });
  },
};
