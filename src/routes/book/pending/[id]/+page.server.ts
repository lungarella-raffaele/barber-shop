import { expired } from "$lib/utils";
import { PublicTokenService } from "@service/public-token.service";
import { ReservationService } from "@service/reservation.service";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const token = await PublicTokenService.get().inspect(params.id, "reservation_access");

  if (token.status !== "valid" || !token.token.reservationID) {
    return {
      success: false,
      reservation: null,
      error: token.status === "expired" ? ("expired" as const) : ("invalid" as const),
    };
  }

  const reservation = await ReservationService.get().getByID(token.token.reservationID);

  if (!reservation) {
    return { success: false, reservation: null, error: "invalid" as const };
  }

  if (reservation.pending && expired(reservation.expiresAt.getTime())) {
    return { success: false, reservation: null, error: "expired" as const };
  }

  return {
    success: true,
    reservation,
    error: null,
  };
};
