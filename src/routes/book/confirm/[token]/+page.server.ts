import { expired } from "$lib/utils";
import { ReservationService } from "@service/reservation.service";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  // TODO: Harden privacy for public reservation links. The reservation id currently works as a bearer token; consider using a separate confirmation token, limiting displayed details, or expiring public access after the appointment date.
  const reservationService = ReservationService.get();
  const reservation = await reservationService.getByID(params.token);

  if (!reservation) {
    return {
      success: false,
      reservation: null,
      error: "server_error",
    };
  }

  if (reservation.pending) {
    if (expired(reservation.expiresAt.getTime())) {
      return {
        success: false,
        reservation: null,
        error: "expired",
      };
    }

    const confirmedReservation = await reservationService.updateExpiration(reservation.id);

    if (!confirmedReservation) {
      return {
        success: false,
        reservation: null,
        error: "server_error",
      };
    }

    return {
      success: true,
      reservation: confirmedReservation,
      error: null,
    };
  }

  return {
    success: true,
    reservation,
    error: null,
  };
};
