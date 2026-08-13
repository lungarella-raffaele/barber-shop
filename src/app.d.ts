// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SessionRow } from "$lib/server/db/schema";
import type { User } from "$lib/server/domain";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: SessionRow | null;
    }
  }
}

export {};
