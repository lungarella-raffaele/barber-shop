import * as table from "$lib/server/db/schema";
import { consumeRateLimit, type RateLimitPolicy } from "$lib/server/rate-limit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDatabase, type TestDatabase } from "../support/database";

const policy: RateLimitPolicy = { id: "login", limit: 2, windowMs: 60_000 };
const hashSecret = "test-rate-limit-secret-at-least-32-characters";

describe("database rate limiter", () => {
  let testDatabase: TestDatabase;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();
  });

  afterEach(async () => {
    await testDatabase.cleanup();
  });

  it("atomically increments a fixed-window counter and returns retry timing", async () => {
    const now = new Date("2026-01-01T00:00:30.000Z");
    const results = await Promise.all(
      Array.from({ length: 3 }, () =>
        consumeRateLimit("203.0.113.7", policy, {
          hashSecret,
          database: testDatabase.database,
          now,
        }),
      ),
    );

    expect(results.filter((result) => result.allowed)).toHaveLength(2);
    expect(results.filter((result) => !result.allowed)).toEqual([
      { allowed: false, remaining: 0, retryAfterSeconds: 30 },
    ]);

    const rows = await testDatabase.database.select().from(table.rateLimit);
    expect(rows).toHaveLength(1);
    expect(rows[0].requestCount).toBe(3);
    expect(rows[0].keyHash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(rows[0])).not.toContain("203.0.113.7");
  });

  it("starts a fresh counter in the next window and separates policies", async () => {
    const firstWindow = new Date("2026-01-01T00:00:59.999Z");
    const nextWindow = new Date("2026-01-01T00:01:00.000Z");

    await consumeRateLimit("203.0.113.7", policy, {
      hashSecret,
      database: testDatabase.database,
      now: firstWindow,
    });
    const rollover = await consumeRateLimit("203.0.113.7", policy, {
      hashSecret,
      database: testDatabase.database,
      now: nextWindow,
    });
    await consumeRateLimit(
      "203.0.113.7",
      { ...policy, id: "booking" },
      {
        hashSecret,
        database: testDatabase.database,
        now: nextWindow,
      },
    );

    expect(rollover).toEqual({ allowed: true, remaining: 1, retryAfterSeconds: 0 });
    expect(await testDatabase.database.select().from(table.rateLimit)).toHaveLength(3);
  });
});
