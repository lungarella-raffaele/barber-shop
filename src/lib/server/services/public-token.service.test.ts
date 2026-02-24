import { describe, expect, it } from "vitest";

import { generatePublicToken, hashPublicToken, publicTokenPurposes } from "./public-token.service";

describe("public token primitives", () => {
  it.each(publicTokenPurposes)("generates URL-safe %s tokens with a purpose prefix", (purpose) => {
    const token = generatePublicToken(purpose);

    expect(token).toMatch(/^[a-z]{2}_[A-Za-z0-9_-]{43}$/);
    expect(encodeURIComponent(token)).toBe(token);
  });

  it("generates unique tokens", () => {
    const tokens = new Set(
      Array.from({ length: 100 }, () => generatePublicToken("password_reset")),
    );

    expect(tokens.size).toBe(100);
  });

  it("hashes tokens deterministically without retaining the raw token", () => {
    const token = "pr_example-token";
    const hash = hashPublicToken(token);

    expect(hash).toBe(hashPublicToken(token));
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(token);
    expect(hashPublicToken(`${token}-different`)).not.toBe(hash);
  });
});
