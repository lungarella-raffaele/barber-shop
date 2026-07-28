import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createDatabase } from "$lib/server/db/client";
import { migrate } from "drizzle-orm/libsql/migrator";

export async function createTestDatabase() {
  const directory = await mkdtemp(join(tmpdir(), "barber-shop-test-"));
  const database = createDatabase(`file:${join(directory, "test.sqlite")}`);

  try {
    await migrate(database, { migrationsFolder: join(process.cwd(), "migrations") });
    await database.run("PRAGMA foreign_keys = ON");
  } catch (error) {
    database.$client.close();
    await rm(directory, { recursive: true, force: true });
    throw error;
  }

  return {
    database,
    async cleanup() {
      database.$client.close();
      await rm(directory, { recursive: true, force: true });
    },
  };
}

export type TestDatabase = Awaited<ReturnType<typeof createTestDatabase>>;
