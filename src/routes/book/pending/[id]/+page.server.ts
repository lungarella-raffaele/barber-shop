import { expired } from "$lib/utils";
import { ReservationService } from "@service/reservation.service";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  // TODO: Harden privacy for public reservation links. The reservation id currently works as a bearer token; consider using a separate confirmation token, limiting displayed details, or expiring public access after the appointment date.
  const reservation = await ReservationService.get().getByID(params.id);

  if (!reservation) {
    return {
      success: false,
      reservation: null,
      error: "server_error",
    };
  }

  if (!reservation.pending) {
    throw redirect(302, `/book/confirm/${reservation.id}`);
  }

  if (expired(reservation.expiresAt.getTime())) {
    return {
      success: false,
      reservation: null,
      error: "expired",
    };
  }

  return {
    success: true,
    reservation,
    error: null,
  };
};
