import { PublicTokenService } from "@service/public-token.service";
import { ReservationService } from "@service/reservation.service";
import { fail } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const token = await PublicTokenService.get().inspect(params.token, "reservation_confirmation");

  if (token.status !== "valid" || !token.token.reservationID) {
    return {
      status: token.status === "expired" ? ("expired" as const) : ("invalid" as const),
      reservation: null,
    };
  }

  const reservation = await ReservationService.get().getByID(token.token.reservationID);
  if (!reservation || !reservation.pending) {
    return { status: "invalid" as const, reservation: null };
  }

  return { status: "ready" as const, reservation };
};

export const actions: Actions = {
  default: async ({ params }) => {
    const reservationID = await PublicTokenService.get().confirmReservation(params.token);
    if (!reservationID) {
      return fail(400, { status: "invalid" as const, reservation: null });
    }

    const reservation = await ReservationService.get().getByID(reservationID);
    if (!reservation) {
      return fail(500, { status: "error" as const, reservation: null });
    }

    return { status: "confirmed" as const, reservation };
  },
};
