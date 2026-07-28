import { getProductionDatabase } from "./production";

export { createDatabase, type Database } from "./client";

export const db = getProductionDatabase();
