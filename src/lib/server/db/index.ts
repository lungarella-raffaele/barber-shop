import { DATABASE_AUTH_TOKEN, DATABASE_CONNECTION_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/libsql";

const url = DATABASE_CONNECTION_URL;
const authToken = DATABASE_AUTH_TOKEN || undefined;

if (!url) {
  throw new Error("DATABASE_CONNECTION_URL is not set");
}

export const db = drizzle({
  connection: { url, authToken },
});
