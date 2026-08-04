import { building } from "$app/environment";
import * as auth from "$lib/server/auth.js";
import { getLegacyRedirect } from "$lib/server/legacy-redirects";
import { logger } from "$lib/server/logger";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const handleLogging: Handle = async ({ event, resolve }) => {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  const response = await resolve(event);

  const routeID = event.route.id;
  const containsPublicToken = routeID?.includes("[token]") || routeID === "/book/pending/[id]";

  logger.info({
    requestId,
    method: event.request.method,
    path:
      containsPublicToken || routeID?.includes("[reservation=uuid]") ? routeID : event.url.pathname,
    status: response.status,
    durationMs: Date.now() - start,
    userId: event.locals.user?.data.id ?? null,
  });

  return response;
};

const handleAuth: Handle = async ({ event, resolve }) => {
  const routeID = event.route.id;
  const isProtected = routeID?.startsWith("/(protected)") ?? false;
  const isAdmin = routeID?.startsWith("/(admin)") || routeID?.startsWith("/(protected)/(admin)");
  const sessionToken = event.cookies.get(auth.sessionCookieName);

  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;

    // Check if route requires authentication
    if (isProtected || isAdmin) {
      redirect(303, "/login");
    }

    return resolve(event);
  }

  // Validate session token
  const { session, user } = await auth.validateSessionToken(sessionToken);

  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  if ((isProtected || isAdmin) && !user) {
    redirect(303, "/login");
  }

  if (isAdmin && user?.role !== "staff") {
    redirect(303, "/");
  }

  return resolve(event);
};

const handleOldRoutes: Handle = async ({ event, resolve }) => {
  const legacyRedirect = getLegacyRedirect(event.url, !building);
  if (legacyRedirect) {
    redirect(legacyRedirect.status, legacyRedirect.location);
  }

  return resolve(event);
};

export const handle: Handle = sequence(handleOldRoutes, handleAuth, handleLogging);
