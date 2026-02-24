// See https://svelte.dev/docs/kit/types#app.d.ts

import type { DBSession } from "$lib/server/db/schema";
import type { User } from "@domain";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: DBSession | null;
    }
  }
}

export {};
