import { LOCK_DURATION } from "$lib/constants";
import { err, ok, type Result } from "$lib/modules/result";
import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";
import type { DBUser } from "$lib/server/db/schema";
import type { AnonymousData, Reservation, StaffData, UsualData } from "@domain";
import { anonymousUserSchema, staffUserSchema, usualUserSchema } from "@schema";
import { and, asc, count, eq, gt, inArray, isNull, lt, or, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core/alias";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("ReservationService");

type InsertError = "conflict" | "invalid-data" | "server-err";
type InsertReservation = typeof table.reservation.$inferInsert;
type ReservationKind = Reservation["kinds"][number];

type ReservationRow = Omit<Reservation, "kinds"> & {
  kind: ReservationKind;
  position: number;
};

export class ReservationService extends Service {
  constructor(private readonly database: Database = getProductionDatabase()) {
    super();
  }

  private getReservationRows() {
    const staffUser = alias(table.user, "staffUser");
    const customerUser = alias(table.user, "customerUser");

    return this.database
      .select({
        id: table.reservation.id,
        date: table.reservation.date,
        hour: table.reservation.hour,
        name: table.reservation.name,
        email: table.reservation.email,
        phoneNumber: table.reservation.phoneNumber,
        pending: table.reservation.pending,
        expiresAt: table.reservation.expiresAt,
        staff: {
          id: staffUser.id,
          name: staffUser.name,
        },
        kind: {
          id: table.kind.id,
          duration: table.kind.duration,
          name: table.kind.name,
          price: table.kind.price,
        },
        position: table.reservationKind.position,
        user: {
          name: customerUser.name,
          email: customerUser.email,
          id: customerUser.id,
        },
      })
      .from(table.reservation)
      .innerJoin(
        table.reservationKind,
        eq(table.reservation.id, table.reservationKind.reservationID),
      )
      .innerJoin(table.kind, eq(table.reservationKind.kindID, table.kind.id))
      .innerJoin(table.staff, eq(table.reservation.staffID, table.staff.userID))
      .innerJoin(staffUser, eq(table.staff.userID, staffUser.id))
      .leftJoin(customerUser, eq(table.reservation.ownerUserID, customerUser.id))
      .orderBy(asc(table.reservation.id), asc(table.reservationKind.position));
  }

  private aggregateReservations(rows: ReservationRow[]): Reservation[] {
    const reservations = new Map<string, Reservation>();

    for (const { kind, position: _position, ...row } of rows) {
      const existing = reservations.get(row.id);
      if (existing) {
        existing.kinds.push(kind);
      } else {
        reservations.set(row.id, { ...row, kinds: [kind] });
      }
    }

    return [...reservations.values()];
  }

  private async findReservations(where: SQL | undefined) {
    const rows = await this.getReservationRows().where(where);
    return this.aggregateReservations(rows as ReservationRow[]);
  }

  private validateKindIDs(kinds: string[]): boolean {
    return kinds.length > 0 && new Set(kinds).size === kinds.length;
  }

  private endOfReservationDay(date: string): Date {
    const expiresAt = new Date(date);
    expiresAt.setDate(expiresAt.getDate() + 1);
    expiresAt.setHours(23, 59, 59, 999);
    return expiresAt;
  }

  async insertByUser(data: UsualData, user: DBUser): Promise<Result<Reservation, InsertError>> {
    try {
      const schema = usualUserSchema.safeParse({ ...data, date: data.date?.toString() });
      if (!schema.success || !this.validateKindIDs(schema.data.kinds)) {
        logger.error(
          { issues: schema.success ? "duplicate-kinds" : schema.error.issues, userId: user.id },
          "insertByUser validation failed",
        );
        return err("invalid-data");
      }

      const { date, hour, kinds, staff } = schema.data;
      return await this.insertAndFetch(
        {
          date,
          hour,
          id: crypto.randomUUID(),
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          ownerUserID: user.id,
          pending: false,
          expiresAt: this.endOfReservationDay(date),
          staffID: staff,
        },
        kinds,
        { userId: user.id, source: "insertByUser" },
      );
    } catch (e) {
      logger.error({ err: e, userId: user.id }, "insertByUser failed");
      return err("server-err");
    }
  }

  async insertByAnonymous(data: AnonymousData): Promise<Result<Reservation, InsertError>> {
    try {
      const schema = anonymousUserSchema.safeParse({
        ...data,
        email: data.email.toLowerCase().trim(),
        date: data.date?.toString(),
      });
      if (!schema.success || !this.validateKindIDs(schema.data.kinds)) {
        logger.warn(
          { reason: schema.success ? "duplicate-kinds" : schema.error.issues[0]?.path },
          "insertByAnonymous validation failed",
        );
        return err("invalid-data");
      }

      const reservation: InsertReservation = {
        date: schema.data.date,
        hour: schema.data.hour,
        id: crypto.randomUUID(),
        name: schema.data.name,
        phoneNumber: schema.data.phone ?? null,
        email: schema.data.email,
        expiresAt: new Date(Date.now() + LOCK_DURATION),
        pending: true,
        staffID: schema.data.staff,
      };
      return await this.insertAndFetch(reservation, schema.data.kinds, {
        email: schema.data.email,
        source: "insertByAnonymous",
      });
    } catch (e) {
      logger.error({ err: e }, "insertByAnonymous failed");
      return err("server-err");
    }
  }

  async insertByStaff(
    data: StaffData,
    user: DBUser,
    alternativeName?: string,
  ): Promise<Result<Reservation, InsertError>> {
    try {
      const schema = staffUserSchema.safeParse({
        ...data,
        name: alternativeName ?? "Inserito da staff",
        date: data.date?.toString(),
      });
      if (!schema.success || !this.validateKindIDs(schema.data.kinds)) {
        logger.error(
          { issues: schema.success ? "duplicate-kinds" : schema.error.issues, staffId: user.id },
          "insertByStaff validation failed",
        );
        return err("invalid-data");
      }

      const { date, hour, kinds, staff, name, phone } = schema.data;
      return await this.insertAndFetch(
        {
          date,
          hour,
          id: crypto.randomUUID(),
          name,
          email: user.email,
          pending: false,
          expiresAt: this.endOfReservationDay(date),
          staffID: staff,
          phoneNumber: phone ?? null,
        },
        kinds,
        { staffId: user.id, source: "insertByStaff" },
      );
    } catch (e) {
      logger.error({ err: e, staffId: user.id }, "insertByStaff failed");
      return err("server-err");
    }
  }

  private async insertAndFetch(
    reservation: InsertReservation,
    kindIDs: string[],
    logContext: Record<string, unknown>,
  ): Promise<Result<Reservation, InsertError>> {
    const inserted = await this.insertWithAvailabilityCheck(reservation, kindIDs);
    if (inserted.isErr()) {
      logger.error({ ...logContext, reason: inserted.error }, `${logContext.source} failed`);
      return err(inserted.error);
    }

    const fullReservation = await this.getByID(reservation.id);
    if (!fullReservation) {
      logger.error({ ...logContext, reservationId: reservation.id }, "post-insert fetch failed");
      return err("server-err");
    }
    return ok(fullReservation);
  }

  async getAll(): Promise<Reservation[] | null> {
    try {
      return await this.findReservations(gt(table.reservation.expiresAt, new Date()));
    } catch (e) {
      logger.error({ err: e }, "getAll failed");
      return null;
    }
  }

  async getTodayReservations(date: string, staffID: string): Promise<Reservation[] | null> {
    try {
      return await this.findReservations(
        and(
          eq(table.reservation.date, date),
          eq(table.reservation.pending, false),
          eq(table.staff.userID, staffID),
        ),
      );
    } catch (err) {
      logger.error({ err, date, staffId: staffID }, "getTodayReservations failed");
      return null;
    }
  }

  private visibleToCustomerCondition() {
    return or(eq(table.reservation.pending, false), gt(table.reservation.expiresAt, new Date()));
  }

  private async claimLegacyReservations(userID: string, email: string, id?: string) {
    const conditions = [
      isNull(table.reservation.ownerUserID),
      eq(table.reservation.email, email.toLowerCase().trim()),
    ];
    if (id) conditions.push(eq(table.reservation.id, id));

    await this.database
      .update(table.reservation)
      .set({ ownerUserID: userID })
      .where(and(...conditions));
  }

  async getByUser(userID: string, email: string): Promise<Reservation[] | null> {
    try {
      await this.claimLegacyReservations(userID, email);
      return await this.findReservations(
        and(eq(table.reservation.ownerUserID, userID), this.visibleToCustomerCondition()),
      );
    } catch (e) {
      logger.error({ err: e, userId: userID }, "getByUser failed");
      return null;
    }
  }

  async getByIDForUser(id: string, userID: string, email: string): Promise<Reservation | null> {
    try {
      await this.claimLegacyReservations(userID, email, id);
      const reservations = await this.findReservations(
        and(
          eq(table.reservation.id, id),
          eq(table.reservation.ownerUserID, userID),
          this.visibleToCustomerCondition(),
        ),
      );
      return reservations[0] ?? null;
    } catch (e) {
      logger.error({ err: e, reservationId: id, userId: userID }, "getByIDForUser failed");
      return null;
    }
  }

  async getByID(id: string): Promise<Reservation | null> {
    try {
      const reservations = await this.findReservations(eq(table.reservation.id, id));
      return reservations[0] ?? null;
    } catch (e) {
      logger.error({ err: e, reservationId: id }, "getByID failed");
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.database
        .delete(table.reservation)
        .where(eq(table.reservation.id, id))
        .returning();
    } catch (e) {
      logger.error({ err: e, reservationId: id }, "delete failed");
      return null;
    }
  }

  async deleteByUser(id: string, userID: string, email: string) {
    try {
      await this.claimLegacyReservations(userID, email, id);
      return await this.database
        .delete(table.reservation)
        .where(and(eq(table.reservation.id, id), eq(table.reservation.ownerUserID, userID)))
        .returning();
    } catch (e) {
      logger.error({ err: e, reservationId: id, userId: userID }, "deleteByUser failed");
      return null;
    }
  }

  async deleteManyByUser(ids: string[], userID: string, email: string) {
    try {
      if (ids.length === 0) return [];
      await this.claimLegacyReservations(userID, email);
      return await this.database
        .delete(table.reservation)
        .where(and(inArray(table.reservation.id, ids), eq(table.reservation.ownerUserID, userID)))
        .returning();
    } catch (e) {
      logger.error({ err: e, reservationIds: ids, userId: userID }, "deleteManyByUser failed");
      return null;
    }
  }

  async deleteAllByUser(userID: string, email: string) {
    try {
      await this.claimLegacyReservations(userID, email);
      return await this.database
        .delete(table.reservation)
        .where(eq(table.reservation.ownerUserID, userID));
    } catch (e) {
      logger.error({ err: e, userId: userID }, "deleteAllByUser failed");
      return null;
    }
  }

  async deleteAllExpired() {
    try {
      return await this.database
        .delete(table.reservation)
        .where(lt(table.reservation.expiresAt, new Date()));
    } catch (err) {
      logger.error({ err }, "deleteAllExpired failed");
    }
  }

  async updateExpiration(id: string): Promise<Reservation | null> {
    try {
      const updated = await this.database
        .update(table.reservation)
        .set({
          pending: false,
          expiresAt: sql`strftime('%s', datetime(${table.reservation.date}, '+1 day'))`,
        })
        .where(eq(table.reservation.id, id))
        .returning()
        .get();
      const fullReservation = await this.getByID(updated.id);
      if (!fullReservation) {
        logger.error({ reservationId: id }, "updateExpiration post-update fetch failed");
        return null;
      }
      return fullReservation;
    } catch (e) {
      logger.error({ err: e, reservationId: id }, "updateExpiration failed");
      return null;
    }
  }

  private minutesFromMidnight(hour: string): number {
    const [hours, minutes] = hour.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private async insertWithAvailabilityCheck(
    reservation: InsertReservation,
    kindIDs: string[],
  ): Promise<Result<table.DBReservation, InsertError>> {
    try {
      return await this.database.transaction(async (tx) => {
        const requestedKinds = await tx
          .select({
            id: table.kind.id,
            duration: table.kind.duration,
          })
          .from(table.kind)
          .where(
            and(
              inArray(table.kind.id, kindIDs),
              eq(table.kind.staffID, reservation.staffID),
              eq(table.kind.active, true),
            ),
          );

        if (requestedKinds.length !== kindIDs.length) return err("invalid-data");

        const requestedDuration = requestedKinds.reduce((sum, kind) => sum + kind.duration, 0);
        const requestedStart = this.minutesFromMidnight(reservation.hour);
        const requestedEnd = requestedStart + requestedDuration;

        const existingStart = sql<number>`
          cast(substr(${table.reservation.hour}, 1, 2) as integer) * 60
          + cast(substr(${table.reservation.hour}, 4, 2) as integer)
        `;
        const [conflict] = await tx
          .select({ id: table.reservation.id })
          .from(table.reservation)
          .innerJoin(
            table.reservationKind,
            eq(table.reservation.id, table.reservationKind.reservationID),
          )
          .innerJoin(table.kind, eq(table.reservationKind.kindID, table.kind.id))
          .where(
            and(
              eq(table.reservation.date, reservation.date),
              eq(table.reservation.staffID, reservation.staffID),
              gt(table.reservation.expiresAt, new Date()),
            ),
          )
          .groupBy(table.reservation.id, table.reservation.hour)
          .having(
            and(
              sql`${requestedStart} < ${existingStart} + sum(${table.kind.duration})`,
              sql`${existingStart} < ${requestedEnd}`,
            ),
          )
          .limit(1);

        if (conflict) return err("conflict");

        const [inserted] = await tx.insert(table.reservation).values(reservation).returning();
        await tx.insert(table.reservationKind).values(
          kindIDs.map((kindID, position) => ({
            reservationID: reservation.id,
            kindID,
            position,
          })),
        );
        return ok(inserted);
      });
    } catch (e) {
      logger.error({ err: e, reservationId: reservation.id }, "transactional insert failed");
      return err("server-err");
    }
  }

  async countExpired() {
    try {
      const entries = await this.database
        .select({ count: count() })
        .from(table.reservation)
        .where(lt(table.reservation.expiresAt, new Date()))
        .get();
      return entries?.count;
    } catch (e) {
      logger.error({ err: e }, "countExpired failed");
      return null;
    }
  }
}
