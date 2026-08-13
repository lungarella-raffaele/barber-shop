import { getLocalTimeZone, today } from "@internationalized/date";
import { ReservationService } from "@service/reservation.service";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, url, locals }) => {
  depends("app:dashboard-reservations");

  const date = url.searchParams.get("date");

  if (!locals.user) {
    redirect(302, "/login");
  }

  const reservations = await ReservationService.get().getTodayReservations(
    date ?? today(getLocalTimeZone()).toString(),
    locals.user?.account.id,
  );

  return {
    reservations,
    date,
    title: "Admin -",
  };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "staff") {
      return fail(401, { success: false });
    }

    const data = await request.formData();
    const value = data.get("id");
    const id = typeof value === "string" ? value.trim() : "";
    if (!id) return fail(400, { success: false });

    const res = await ReservationService.get().deleteByStaff(id, locals.user.account.id);
    if (!res?.length) return fail(404, { success: false });

    return { res };
  },
};
