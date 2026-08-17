import { BASE_URL } from "$env/static/private";
import { formatMinuteOfDay } from "$lib/domain/minute-of-day";
import { bookSchema } from "$lib/modules/zod-schemas.js";
import { logger } from "$lib/server/logger.js";
import { EmailService } from "$lib/server/mailer.js";
import { formatDate } from "$lib/utils.js";
import { OfferingService } from "@service/offering.service.js";
import { PublicTokenService } from "@service/public-token.service.js";
import { ReservationService } from "@service/reservation.service.js";
import { ScheduleService } from "@service/schedule.service.js";
import { ShutdownService } from "@service/shutdown.service.js";
import { StaffService } from "@service/staff.service.js";
import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 as zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ locals }) => {
  const who = !locals.user ? "anonymous" : locals.user.role === "staff" ? "staff" : "usual";

  const [form, currentReservations, shutdown, schedule] = await Promise.all([
    superValidate(
      {
        who,
        staff: "",
        offerings: [],
        date: "",
        startMinute: 0,
        name: "",
        email: "",
        phone: "",
      },
      zod(bookSchema),
      { errors: false },
    ),
    ReservationService.get().getOccupiedSlots(),
    ShutdownService.get().getAll(),
    ScheduleService.get().getAll(),
  ]);

  if (currentReservations.isErr()) return error(503);
  if (!shutdown) return error(500);

  const [offerings, staff] = await Promise.all([
    OfferingService.get().getAll(),
    StaffService.get().getAll(),
  ]);

  if (!offerings || !staff) {
    return error(500);
  }

  return {
    form,
    currentReservations: currentReservations.value,
    shutdown,
    schedule,
    offerings,
    staff,
    user: locals.user,
    title: "Nuova prenotazione -",
  };
};

export const actions: Actions = {
  default: async (event) => {
    const { locals } = event;
    const user = locals.user;

    const form = await superValidate(event, zod(bookSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { staff, offerings, date, startMinute, name, email, phone } = form.data;
    const reservationService = ReservationService.get();

    let result: Awaited<ReturnType<typeof reservationService.insertByUser>> | undefined = undefined;

    if (!user) {
      if (!name || !email) {
        return fail(400, { form });
      }
      result = await reservationService.insertByAnonymous({
        who: "anonymous",
        staff,
        offerings,
        date,
        startMinute,
        name,
        email,
        phone,
      });
    } else if (user.role === "customer") {
      result = await reservationService.insertByUser(
        { who: "usual", staff, offerings, date, startMinute },
        user.account,
      );
    } else {
      // staff
      result = await reservationService.insertByStaff(
        { who: "staff", staff, offerings, date, startMinute, name, phone },
        user.account,
        name,
      );
    }

    if (!result) {
      return fail(500, { form });
    }

    if (result.isOk()) {
      const confirmationToken = await PublicTokenService.get().issue({
        purpose: "reservation_confirmation",
        reservationID: result.value.id,
        expiresAt: result.value.expiresAt,
      });

      if (confirmationToken.isErr()) {
        await reservationService.delete(result.value.id);
        return fail(500, { form });
      }

      if (!user) {
        if (!name || !email) {
          return fail(400, { form });
        }

        const sent = await new EmailService().newReservation({
          name,
          link: `${BASE_URL.replace(/\/$/, "")}/book/confirm/${confirmationToken.value}`,
          staffName: result.value.staff.name,
          serviceNames: result.value.offerings.map((offering) => offering.name),
          date: formatDate(result.value.date),
          hour: formatMinuteOfDay(result.value.startMinute),
          to: email,
        });

        logger.warn(sent);

        if (sent.isErr()) {
          logger.error("Could not send email");
          await reservationService.delete(result.value.id);
          return fail(500, { form, email: true });
        }
      }

      // Anonymous confirmation credentials are delivered only by email, never serialized publicly.
      return user
        ? {
            id: result.value.id,
            pending: result.value.pending,
            confirmationToken: confirmationToken.value,
          }
        : { id: result.value.id, pending: result.value.pending };
    } else {
      switch (result.error.type) {
        case "conflict":
          return fail(409, { form });
        case "invalid-data":
          return fail(400, { form });
        case "server-error":
          return fail(500, { form });
      }
    }
  },
};
