export type LegacyRedirect = {
  location: string;
  status: 302 | 308;
};

const staticRouteAliases = [["/newreservation", "/book"]] as const;

const homeQueryAliases = [
  ["reservation", "/book/confirm"],
  ["user", "/account/verify-email"],
  ["pending", "/book/pending"],
  ["recover", "/account/reset-password"],
] as const;

const tokenPathAliases = [
  [/^\/user\/confirmed\/([^/]+)\/?$/, "/account/verify-email"],
  [/^\/book\/confirmed\/([^/]+)\/?$/, "/book/confirm"],
] as const;

export function getLegacyRedirect(url: URL, includeQueryAliases = true): LegacyRedirect | null {
  for (const [oldRoute, newRoute] of staticRouteAliases) {
    const isExactMatch = url.pathname === oldRoute;
    const isNestedMatch = url.pathname.startsWith(`${oldRoute}/`);

    if (isExactMatch || isNestedMatch) {
      const nestedPath = url.pathname.slice(oldRoute.length);
      return {
        location: `${newRoute}${nestedPath}${url.search}`,
        status: 308,
      };
    }
  }

  if (includeQueryAliases && url.pathname === "/") {
    for (const [queryParameter, newRoute] of homeQueryAliases) {
      const token = url.searchParams.get(queryParameter);
      if (token) {
        return {
          location: `${newRoute}/${encodeURIComponent(token)}`,
          status: 302,
        };
      }
    }
  }

  if (includeQueryAliases && url.pathname === "/profile") {
    const token = url.searchParams.get("confirm-email-change");
    if (token) {
      return {
        location: `/account/confirm-email-change/${encodeURIComponent(token)}`,
        status: 302,
      };
    }
  }

  for (const [pattern, newRoute] of tokenPathAliases) {
    const match = pattern.exec(url.pathname);
    if (match) {
      return {
        location: `${newRoute}/${match[1]}`,
        status: 302,
      };
    }
  }

  return null;
}
