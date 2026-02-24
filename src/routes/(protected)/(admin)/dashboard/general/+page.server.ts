import type { Schedule } from "$lib/server/db/schema";
import { logger } from "$lib/server/logger";
import { getBoolean, getString } from "$lib/utils";
import { kindSchema, updateKindSchema } from "@schema";
import { BannerService } from "@service/banner.service";
import { CleanupService } from "@service/clean-up.service";
import { KindService } from "@service/kind.service";
import { ScheduleService } from "@service/schedule.service";
import { ShutdownService } from "@service/shutdown.service";
import { StaffService } from "@service/staff.service";
import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 as zod } from "sveltekit-superforms/adapters";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return error(500);
  }

  if (locals.user.role !== "staff") {
    return error(500);
  }

  const kinds = await KindService.get().getByStaff(locals.user.data.id);
  if (!kinds) {
    return error(500);
  }
  return {
    banner: await BannerService.get().get(),
    kinds,
    shutdown: ShutdownService.get().getStaffShutdown(locals.user.data.id),
    schedule: ScheduleService.get().getAll(),
    addKindForm: await superValidate(zod(kindSchema), { id: "addKind" }),
    updateKindForm: await superValidate(zod(updateKindSchema), {
      id: "updateKind",
    }),
  };
};

export const actions: Actions = {
  insertShutdown: async ({ request }) => {
    const data = await request.formData();
    const start = data.get("start") as string;
    const end = data.get("end") as string;
    const id = data.get("id") as string;

    if (!start || !end) return fail(404);
    return await ShutdownService.get().insert(start, end, id);
  },
  deleteShutdown: async ({ request }) => {
    const data = await request.formData();
    return await ShutdownService.get().delete(data.get("id") as string);
  },
  addSchedule: async ({ request, locals }) => {
    const data = await request.formData();
    if (!locals.user) return fail(401, { message: "Unauthorized" });

    const staffID = locals.user.data.id;
    const schedule = (JSON.parse(data.get("data") as string) as Schedule[]).map((item) => ({
      staffID,
      day: item.day,
      startHour: item.startHour,
      startMinute: item.startMinute,
      endHour: item.endHour,
      endMinute: item.endMinute,
    }));

    return { success: await ScheduleService.get().update(schedule, locals.user.data.id) };
  },
  deleteSchedule: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get("id"));
    if (!id) return fail(404);
    return await ScheduleService.get().delete(id);
  },
  updateBanner: async ({ request }) => {
    const data = await request.formData();

    const message = getString(data, "message");
    const visible = getBoolean(data, "visible");

    const result = await BannerService.get().update(message, visible);
    return { updatedBanner: result.kind === "ok" };
  },
  updateKind: async ({ request, locals }) => {
    const form = await superValidate(request, zod(updateKindSchema), {
      id: "updateKind",
    });
    if (!form.valid) return fail(400, { updateKindForm: form });
    if (!locals.user) return fail(401, { updateKindForm: form });

    const response = await KindService.get().update({
      id: form.data.id,
      name: form.data.name,
      description: form.data.description,
      duration: form.data.duration,
      price: form.data.price,
      active: form.data.active,
      staffID: locals.user.data.id,
    });

    if (!response) {
      logger.error("Could not update service");
      return fail(500, { updateKindForm: form });
    }

    return { updateKindForm: form };
  },
  addKind: async ({ request, locals }) => {
    const form = await superValidate(request, zod(kindSchema), {
      id: "addKind",
    });
    if (!form.valid) return fail(400, { addKindForm: form });
    if (!locals.user) return fail(401, { addKindForm: form });

    const response = await KindService.get().insert({
      id: crypto.randomUUID(),
      name: form.data.name,
      description: form.data.description,
      duration: form.data.duration,
      price: form.data.price,
      active: form.data.active,
      staffID: locals.user.data.id,
    });

    if (!response) {
      logger.error("Could not add service");
      return fail(500, { addKindForm: form });
    }

    return { addKindForm: form };
  },
  deleteKind: async ({ request }) => {
    const data = await request.formData();

    const id = getString(data, "id");

    if (!id) {
      logger.error("Id not sent");
      return {
        isDeletingKind: true,
        success: false,
      };
    }

    const response = await KindService.get().delete(id);

    if (response) {
      logger.info("Delete kind" + `${response.name}`);
      return {
        isDeletingKind: true,
        success: true,
      };
    } else {
      logger.error("Could not delete kind");
      return {
        isDeletingKind: true,
        success: false,
      };
    }
  },
  toggleStaff: async ({ request }) => {
    const data = await request.formData();
    const active = getBoolean(data, "active");
    const id = getString(data, "id");

    return await StaffService.get().toggleActive(active, id);
  },
  clean: async () => {
    await CleanupService.get().deleteExpiredItems();
  },
  deleteAvatar: async ({ locals }) => {
    if (!locals.user) return { avatarSuccess: false };
    const result = await StaffService.get().deleteAvatar(locals.user.data.id);
    return { avatarSuccess: !!result };
  },
};
