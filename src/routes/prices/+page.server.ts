import { KindService } from "@service/kind.service.js";
import { ScheduleService } from "@service/schedule.service.js";
import { StaffService } from "@service/staff.service.js";

import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
  const [kinds, schedule, staff] = await Promise.all([
    KindService.get().getAll(),
    ScheduleService.get().getAll(),
    StaffService.get().getAll(),
  ]);
  return {
    kinds,
    schedule,
    staff,
    title: "Listino Prezzi -",
    header: "Listino Prezzi",
  };
};
