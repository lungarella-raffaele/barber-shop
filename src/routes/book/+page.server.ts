import { BASE_URL } from "$env/static/private";
import { bookSchema } from "$lib/modules/zod-schemas.js";
import { logger } from "$lib/server/logger.js";
import { EmailService } from "$lib/server/mailer.js";
import { formatDate, formatTime } from "$lib/utils.js";
import { KindService } from "@service/kind.service.js";
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
        kinds: [],
        date: "",
        hour: "",
        name: "",
        email: "",
        phone: "",
      },
      zod(bookSchema),
      { errors: false },
    ),
    ReservationService.get().getAll(),
    ShutdownService.get().getAll(),
    ScheduleService.get().getAll(),
  ]);

  if (!currentReservations || !shutdown) {
    return error(500);
  }

  const [kinds, staff] = await Promise.all([
    KindService.get().getAll(),
    StaffService.get().getAll(),
  ]);

  if (!kinds || !staff) {
    return error(500);
  }

  return {
    form,
    currentReservations,
    shutdown,
    schedule,
    kinds,
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

    const { staff, kinds, date, hour, name, email, phone } = form.data;
    const reservationService = ReservationService.get();

    let result: Awaited<ReturnType<typeof reservationService.insertByUser>> | undefined = undefined;

    if (!user) {
      if (!name || !email) {
        return fail(400, { form });
      }
      result = await reservationService.insertByAnonymous({
        who: "anonymous",
        staff,
        kinds,
        date,
        hour,
        name,
        email,
        phone,
      });
    } else if (user.role === "user") {
      result = await reservationService.insertByUser(
        { who: "usual", staff, kinds, date, hour },
        user.data,
      );
    } else {
      // staff
      result = await reservationService.insertByStaff(
        { who: "staff", staff, kinds, date, hour, name, phone },
        user.data,
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
          serviceNames: result.value.kinds.map((kind) => kind.name),
          date: formatDate(result.value.date),
          hour: formatTime(result.value.hour),
          to: email,
        });

        logger.warn(sent);

        if (sent.isErr()) {
          logger.error("Could not send email");
          await reservationService.delete(result.value.id);
          return fail(500, { form, email: true });
        }
      }

      return { ...result.value, confirmationToken: confirmationToken.value };
    } else {
      logger.error(result.error);
      switch (result.error) {
        case "conflict":
          return fail(409, { form });
        default:
          return fail(404, { form });
      }
    }
  },
};
