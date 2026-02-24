import { describe, expect, it } from "vitest";

import { getLegacyRedirect } from "./legacy-redirects";

function redirectFor(path: string) {
  return getLegacyRedirect(new URL(path, "https://example.com"));
}

describe("getLegacyRedirect", () => {
  it.each([
    ["/?reservation=reservation-id", "/book/confirm/reservation-id"],
    ["/?pending=reservation-id", "/book/pending/reservation-id"],
    ["/?user=user-id", "/account/verify-email/user-id"],
    ["/?recover=recovery-id", "/account/reset-password/recovery-id"],
    [
      "/profile?confirm-email-change=verification-id",
      "/account/confirm-email-change/verification-id",
    ],
    ["/user/confirmed/user-id", "/account/verify-email/user-id"],
    ["/book/confirmed/reservation-id", "/book/confirm/reservation-id"],
  ])("redirects %s to its canonical route", (legacyPath, canonicalPath) => {
    expect(redirectFor(legacyPath)).toEqual({
      location: canonicalPath,
      status: 302,
    });
  });

  it("keeps the established permanent new-reservation alias", () => {
    expect(redirectFor("/newreservation/example?from=old-link")).toEqual({
      location: "/book/example?from=old-link",
      status: 308,
    });
  });

  it("uses the same precedence as the legacy home page", () => {
    expect(redirectFor("/?pending=pending-id&reservation=reservation-id")).toEqual({
      location: "/book/confirm/reservation-id",
      status: 302,
    });
  });

  it("encodes query-string tokens before placing them in a path", () => {
    expect(redirectFor("/?recover=token%2Fwith%20spaces")).toEqual({
      location: "/account/reset-password/token%2Fwith%20spaces",
      status: 302,
    });
  });

  it("ignores unrelated routes and query parameters", () => {
    expect(redirectFor("/?campaign=summer")).toBeNull();
    expect(redirectFor("/profile?tab=account")).toBeNull();
  });
});
