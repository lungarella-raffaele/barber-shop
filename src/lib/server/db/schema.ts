import { index, integer, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
};

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  verifiedEmail: integer("verified_email", { mode: "boolean" }).notNull().default(false),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  ...timestamps,
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userID: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ...timestamps,
});

export const reservation = sqliteTable("reservation", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  hour: text("hour").notNull(),
  phoneNumber: text("phone_number"),

  name: text("name").notNull(),
  email: text("email").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  pending: integer("pending", { mode: "boolean" }).notNull().default(false),
  staffID: text("staff_id")
    .notNull()
    .references(() => staff.userID, { onDelete: "restrict" }),
  ...timestamps,
});

export const kind = sqliteTable("kind", {
  id: text("id").primaryKey(),
  staffID: text("staff_id")
    .notNull()
    .references(() => staff.userID, { onDelete: "cascade" }),
  name: text("name").notNull(),
  duration: integer("duration").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const reservationKind = sqliteTable(
  "reservation_kind",
  {
    reservationID: text("reservation_id")
      .notNull()
      .references(() => reservation.id, { onDelete: "cascade" }),
    kindID: text("kind_id")
      .notNull()
      .references(() => kind.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
  },
  (entry) => [
    primaryKey({ columns: [entry.reservationID, entry.kindID] }),
    index("reservation_kind_reservation_idx").on(entry.reservationID),
    index("reservation_kind_kind_idx").on(entry.kindID),
  ],
);

export const banner = sqliteTable("banner", {
  id: integer().primaryKey().default(1),
  message: text("message"),
  visible: integer("visible", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

// was closures
export const shutdowns = sqliteTable("shutdown", {
  id: text("id").primaryKey(),
  staffID: text("staff_id")
    .notNull()
    .references(() => staff.userID, { onDelete: "cascade" }),
  start: text("start").notNull(),
  end: text("end").notNull(),
  ...timestamps,
});

export const emailVerification = sqliteTable("email_verification", {
  id: text("id").primaryKey(),
  userID: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  email: text("email").notNull(),
  ...timestamps,
});

export const passwordRecover = sqliteTable("password_recover", {
  id: text("id").primaryKey(),
  userID: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  ...timestamps,
});

export const publicToken = sqliteTable(
  "public_token",
  {
    tokenHash: text("token_hash").primaryKey(),
    purpose: text("purpose", {
      enum: [
        "reservation_access",
        "reservation_confirmation",
        "account_verification",
        "password_reset",
        "email_change",
      ],
    }).notNull(),
    userID: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    reservationID: text("reservation_id").references(() => reservation.id, {
      onDelete: "cascade",
    }),
    pendingEmail: text("pending_email"),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    consumedAt: integer("consumed_at", { mode: "timestamp" }),
    ...timestamps,
  },
  (token) => [
    index("public_token_user_purpose_idx").on(token.userID, token.purpose),
    index("public_token_reservation_purpose_idx").on(token.reservationID, token.purpose),
    index("public_token_expires_at_idx").on(token.expiresAt),
  ],
);

export const schedule = sqliteTable("schedule", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  staffID: text("staff_id")
    .notNull()
    .references(() => staff.userID, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  startHour: integer("start_hour").notNull(),
  startMinute: integer("start_minute").notNull().default(0),
  endHour: integer("end_hour").notNull(),
  endMinute: integer("end_minute").notNull().default(0),
  ...timestamps,
});

export const staff = sqliteTable("staff", {
  userID: text("user_id")
    .primaryKey()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  avatar: text("avatar"),
  avatarOriginal: text("avatar_original"),
  avatarOffsetX: real("avatar_offset_x"),
  avatarOffsetY: real("avatar_offset_y"),
  avatarDisplayScale: real("avatar_display_scale"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export type DBSession = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type DBUser = typeof user.$inferSelect;
export type DBStaff = typeof staff.$inferSelect;
export type DBReservation = typeof reservation.$inferSelect;
export type DBReservationKind = typeof reservationKind.$inferSelect;
export type DBKind = typeof kind.$inferSelect;
export type NewKind = typeof kind.$inferInsert;
export type DBBanner = typeof banner.$inferSelect;
export type DBShutdown = typeof shutdowns.$inferSelect;
export type DBEmailVerificationToken = typeof emailVerification.$inferSelect;
export type DBPasswordRecover = typeof passwordRecover.$inferSelect;
export type DBPublicToken = typeof publicToken.$inferSelect;
export type DBSchedule = typeof schedule.$inferSelect;
export type Schedule = Omit<typeof schedule.$inferInsert, "id">;
