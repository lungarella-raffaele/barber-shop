import type { DBSession, DBStaff, DBUser } from "$lib/server/db/schema";

export type User =
  | {
      role: "user";
      data: DBUser;
    }
  | {
      role: "staff";
      data: DBUser & DBStaff;
    };

export type UserSession = { user: User; session: DBSession };
