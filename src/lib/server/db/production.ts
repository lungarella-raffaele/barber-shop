import { env } from "$env/dynamic/private";

import { createDatabase, type Database } from "./client";

let database: Database | undefined;

export function getProductionDatabase(): Database {
  if (database) return database;

  if (!env.DATABASE_CONNECTION_URL) {
    throw new Error("DATABASE_CONNECTION_URL is not set");
  }

  database = createDatabase(env.DATABASE_CONNECTION_URL, env.DATABASE_AUTH_TOKEN || undefined);
  return database;
}
