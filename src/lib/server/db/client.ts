import { drizzle } from "drizzle-orm/libsql";

export function createDatabase(url: string, authToken?: string) {
  return drizzle({
    connection: { url, authToken },
  });
}

export type Database = ReturnType<typeof createDatabase>;
