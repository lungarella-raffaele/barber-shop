import { dev } from "$app/environment";
import { PasswordRecoverService } from "@service/password-recover.service";
import { ReservationService } from "@service/reservation.service";
import { UserService } from "@service/user.service";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types.js";

type DebugRoute = {
  label: string;
  href: string | null;
  route: string;
  group: "Public" | "Auth" | "Protected" | "Admin" | "Legacy";
  category:
    | "Core pages"
    | "Authentication"
    | "Reservation lifecycle"
    | "User lifecycle"
    | "Password recovery"
    | "Protected user area"
    | "Admin area"
    | "Legacy redirects";
  ephemeral?: boolean;
  state?: string;
  note?: string;
};

type RouteSection = {
  title: string;
  description: string;
  routes: DebugRoute[];
};

const routeSectionMeta: Array<Omit<RouteSection, "routes"> & { category: DebugRoute["category"] }> =
  [
    {
      category: "Reservation lifecycle",
      title: "Ephemeral reservation states",
      description:
        "Fake-data links for booking states that normally arrive from canonical booking and email routes: pending, expired pending, confirmed, and reservation detail.",
    },
    {
      category: "User lifecycle",
      title: "Ephemeral user states",
      description:
        "Fake-data links for account-confirmation flows. These can mutate the seed user/session, so reseed when you need the original pending state again.",
    },
    {
      category: "Password recovery",
      title: "Ephemeral password recovery states",
      description:
        "Fake-data links for valid and expired password reset tokens without going through the email flow.",
    },
    {
      category: "Core pages",
      title: "Core public pages",
      description: "Stable public pages that do not require fake state.",
    },
    {
      category: "Authentication",
      title: "Authentication",
      description: "Login and signup routes. They redirect when a session already exists.",
    },
    {
      category: "Protected user area",
      title: "Protected user area",
      description: "Routes that require an authenticated user.",
    },
    {
      category: "Admin area",
      title: "Admin area",
      description: "Routes that require a staff/admin session.",
    },
    {
      category: "Legacy redirects",
      title: "Legacy redirects",
      description: "Old URLs kept here so redirect behavior remains easy to verify.",
    },
  ];

function getRouteSections(debugRoutes: DebugRoute[]): RouteSection[] {
  return routeSectionMeta
    .map(({ category, title, description }) => ({
      title,
      description,
      routes: debugRoutes.filter((route) => route.category === category),
    }))
    .filter((section) => section.routes.length > 0);
}

export const csr = dev;

export const load: PageServerLoad = async () => {
  if (!dev) {
    error(404);
  }

  const reservationService = ReservationService.get();
  const passwordRecoverService = PasswordRecoverService.get();
  const userService = UserService.get();

  const reservationsResult = await reservationService.getAll();
  if (reservationsResult.isErr()) error(503, "Unable to load showcase reservations");
  const reservations = reservationsResult.value;
  const pendingReservation = reservations.find((reservation) => reservation.pending);
  const confirmedReservation = reservations.find((reservation) => !reservation.pending);
  const expiredPendingReservationResult = await reservationService.getByID(
    "seed-reservation-expired-pending",
  );
  if (
    expiredPendingReservationResult.isErr() &&
    expiredPendingReservationResult.error.type === "storage-error"
  ) {
    error(503, "Unable to load showcase reservation");
  }
  const expiredPendingReservation = expiredPendingReservationResult.isOk()
    ? expiredPendingReservationResult.value
    : null;
  const pendingUserResult = await userService.getByID("seed-pending-user-sofia");
  if (pendingUserResult.isErr() && pendingUserResult.error.type === "storage-error") {
    error(503, "Unable to load showcase user");
  }
  const pendingUser = pendingUserResult.isOk() ? pendingUserResult.value : null;
  const validRecover = await passwordRecoverService.getByID("seed-password-recover-valid");
  const expiredRecover = await passwordRecoverService.getByID("seed-password-recover-expired");
  const anyReservation = reservations[0];

  const debugRoutes: DebugRoute[] = [
    {
      label: "Home / marketing",
      href: "/",
      route: "/",
      group: "Public",
      category: "Core pages",
      state: "Marketing homepage",
    },
    {
      label: "Verify account email",
      href: pendingUser ? `/account/verify-email/${pendingUser.account.id}` : null,
      route: "/account/verify-email/[token]",
      group: "Public",
      category: "User lifecycle",
      ephemeral: true,
      state: pendingUser
        ? `Using pending user ${pendingUser.account.id}`
        : "Run `pnpm db:seed` to create seed-pending-user-sofia.",
      note: "Side effect: opening this verifies the user and sets a session cookie.",
    },
    {
      label: "Reset password",
      href: validRecover ? `/account/reset-password/${validRecover.id}` : null,
      route: "/account/reset-password/[token]",
      group: "Public",
      category: "Password recovery",
      ephemeral: true,
      state: validRecover
        ? `Using valid recovery token ${validRecover.id}`
        : "Run `pnpm db:seed` to create seed-password-recover-valid.",
    },
    {
      label: "Reset password / expired",
      href: expiredRecover ? `/account/reset-password/${expiredRecover.id}` : null,
      route: "/account/reset-password/[token]",
      group: "Public",
      category: "Password recovery",
      ephemeral: true,
      state: expiredRecover
        ? `Using expired recovery token ${expiredRecover.id}`
        : "Run `pnpm db:seed` to create seed-password-recover-expired.",
    },
    {
      label: "Legacy home / pending reservation",
      href: pendingReservation ? `/?pending=${pendingReservation.id}` : null,
      route: "/?pending=:id",
      group: "Legacy",
      category: "Legacy redirects",
      ephemeral: true,
      state: "Redirects to /book/pending/[token]",
    },
    {
      label: "Legacy home / confirm reservation",
      href: confirmedReservation ? `/?reservation=${confirmedReservation.id}` : null,
      route: "/?reservation=:id",
      group: "Legacy",
      category: "Legacy redirects",
      ephemeral: true,
      state: "Redirects to /book/confirm/[token]",
    },
    {
      label: "Legacy home / verify account",
      href: pendingUser ? `/?user=${pendingUser.account.id}` : null,
      route: "/?user=:id",
      group: "Legacy",
      category: "Legacy redirects",
      ephemeral: true,
      state: "Redirects to /account/verify-email/[token]",
    },
    {
      label: "Legacy home / reset password",
      href: validRecover ? `/?recover=${validRecover.id}` : null,
      route: "/?recover=:id",
      group: "Legacy",
      category: "Legacy redirects",
      ephemeral: true,
      state: "Redirects to /account/reset-password/[token]",
    },
    {
      label: "Book",
      href: "/book",
      route: "/book",
      group: "Public",
      category: "Core pages",
      state: "Empty booking flow",
    },
    {
      label: "Prices",
      href: "/prices",
      route: "/prices",
      group: "Public",
      category: "Core pages",
    },
    {
      label: "Cookies",
      href: "/cookies",
      route: "/cookies",
      group: "Public",
      category: "Core pages",
    },
    {
      label: "Privacy",
      href: "/privacy",
      route: "/privacy",
      group: "Public",
      category: "Core pages",
    },
    {
      label: "Login",
      href: "/login",
      route: "/login",
      group: "Auth",
      category: "Authentication",
      note: "Redirects home when already authenticated.",
    },
    {
      label: "Signup",
      href: "/signup",
      route: "/signup",
      group: "Auth",
      category: "Authentication",
      note: "Redirects home when already authenticated.",
    },
    {
      label: "Profile",
      href: "/profile",
      route: "/profile",
      group: "Protected",
      category: "Protected user area",
      note: "Requires a logged-in user.",
    },
    {
      label: "My reservations",
      href: "/profile/myreservations",
      route: "/profile/myreservations",
      group: "Protected",
      category: "Protected user area",
      note: "Requires a logged-in user.",
    },
    {
      label: "Reservation detail",
      href: anyReservation ? `/reservations/${anyReservation.id}` : null,
      route: "/reservations/[reservation=uuid]",
      group: "Protected",
      category: "Reservation lifecycle",
      ephemeral: true,
      state: anyReservation
        ? `Using reservation ${anyReservation.id.slice(0, 8)}`
        : "No reservation found",
      note: "Requires staff or the account that owns the reservation.",
    },
    {
      label: "Pending booking",
      href: pendingReservation ? `/book/pending/${pendingReservation.id}` : null,
      route: "/book/pending/[id]",
      group: "Public",
      category: "Reservation lifecycle",
      ephemeral: true,
      state: pendingReservation
        ? `Using pending reservation ${pendingReservation.id.slice(0, 8)}`
        : "No pending reservation found",
      note: "Shows expired/error states only when the selected reservation is expired or missing.",
    },
    {
      label: "Pending booking expired",
      href: expiredPendingReservation ? `/book/pending/${expiredPendingReservation.id}` : null,
      route: "/book/pending/[id]",
      group: "Public",
      category: "Reservation lifecycle",
      ephemeral: true,
      state: expiredPendingReservation
        ? `Using expired pending reservation ${expiredPendingReservation.id.slice(0, 8)}`
        : "Run `pnpm db:seed` to create seed-reservation-expired-pending.",
      note: "Useful to inspect the expired pending state without waiting for a real reservation to expire.",
    },
    {
      label: "Confirm booking",
      href: confirmedReservation ? `/book/confirm/${confirmedReservation.id}` : null,
      route: "/book/confirm/[token]",
      group: "Public",
      category: "Reservation lifecycle",
      ephemeral: true,
      state: confirmedReservation
        ? `Using confirmed reservation ${confirmedReservation.id.slice(0, 8)}`
        : "No confirmed reservation found",
      note: "Opening this with a pending reservation confirms it.",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      route: "/dashboard",
      group: "Admin",
      category: "Admin area",
      note: "Requires staff role.",
    },
    {
      label: "Dashboard calendar",
      href: "/dashboard/calendar",
      route: "/dashboard/calendar",
      group: "Admin",
      category: "Admin area",
      note: "Requires staff role.",
    },
    {
      label: "Dashboard settings",
      href: "/dashboard/general",
      route: "/dashboard/general",
      group: "Admin",
      category: "Admin area",
      note: "Requires staff role.",
    },
    {
      label: "Old booking route",
      href: "/newreservation",
      route: "/newreservation",
      group: "Legacy",
      category: "Legacy redirects",
      state: "Redirects to /book",
    },
  ];

  return {
    title: "Showcase -",
    header: "Showcase",
    debugRoutes,
    routeSections: getRouteSections(debugRoutes),
  };
};
