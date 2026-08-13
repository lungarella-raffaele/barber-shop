import { LOCK_DURATION } from "$lib/constants";
import type { ReservationDTO } from "$lib/dto";
import { err, ok, type Result } from "$lib/modules/result";
import type { Database } from "$lib/server/db/client";
import { getProductionDatabase } from "$lib/server/db/production";
import * as table from "$lib/server/db/schema";
import type { UserRow } from "$lib/server/db/schema";
import type { AnonymousData, StaffData, UsualData } from "$lib/shared";
import { parseDate, parseDateTime } from "@internationalized/date";
import { anonymousUserSchema, staffUserSchema, usualUserSchema } from "@schema";
import { and, asc, count, eq, gt, inArray, isNull, lt, or, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core/alias";

import { createLogger } from "../logger";
import { Service } from "./service";

const logger = createLogger("ReservationService");

type InsertError = "conflict" | "invalid-data" | "server-err";
type InsertReservation = typeof table.reservation.$inferInsert;
type ReservationOffering = ReservationDTO["offerings"][number];

type ReservationRow = Omit<ReservationDTO, "offerings"> & {
  offering: ReservationOffering;
  position: number;
};

export type OccupiedReservationSlot = {
  date: string;
  hour: string;
  staff: { id: string };
  offerings: { duration: number }[];
};

const BUSINESS_TIME_ZONE = "Europe/Rome";

/** Canonical deadline shared by a pending reservation and its confirmation credential. */
export function reservationConfirmationExpiresAt(now = Date.now()): Date {
  return new Date(now + LOCK_DURATION);
}

/** Canonical retention boundary for confirmed reservations: next midnight in Europe/Rome. */
export function reservationExpiresAt(date: string): Date {
  return parseDate(date).add({ days: 1 }).toDate(BUSINESS_TIME_ZONE);
}

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
        offering: {
          id: table.offering.id,
          duration: table.offering.duration,
          name: table.offering.name,
          price: table.offering.price,
        },
        position: table.reservationOffering.position,
        user: {
          name: customerUser.name,
          email: customerUser.email,
          id: customerUser.id,
        },
      })
      .from(table.reservation)
      .innerJoin(
        table.reservationOffering,
        eq(table.reservation.id, table.reservationOffering.reservationID),
      )
      .innerJoin(table.offering, eq(table.reservationOffering.offeringID, table.offering.id))
      .innerJoin(table.staff, eq(table.reservation.staffID, table.staff.userID))
      .innerJoin(staffUser, eq(table.staff.userID, staffUser.id))
      .leftJoin(customerUser, eq(table.reservation.ownerUserID, customerUser.id))
      .orderBy(asc(table.reservation.id), asc(table.reservationOffering.position));
  }

  private aggregateReservations(rows: ReservationRow[]): ReservationDTO[] {
    const reservations = new Map<string, ReservationDTO>();

    for (const { offering, position: _position, ...row } of rows) {
      const existing = reservations.get(row.id);
      if (existing) {
        existing.offerings.push(offering);
      } else {
        reservations.set(row.id, { ...row, offerings: [offering] });
      }
    }

    return [...reservations.values()];
  }

  private async findReservations(where: SQL | undefined) {
    const rows = await this.getReservationRows().where(where);
    return this.aggregateReservations(rows as ReservationRow[]);
  }

  private validateOfferingIDs(offerings: string[]): boolean {
    return offerings.length > 0 && new Set(offerings).size === offerings.length;
  }

  /** The reservation remains retained until the next Europe/Rome midnight (exclusive). */
  private nextRomeMidnight(date: string): Date {
    return reservationExpiresAt(date);
  }

  async insertByUser(data: UsualData, user: UserRow): Promise<Result<ReservationDTO, InsertError>> {
    try {
      const schema = usualUserSchema.safeParse({ ...data, date: data.date?.toString() });
      if (!schema.success || !this.validateOfferingIDs(schema.data.offerings)) {
        logger.error(
          { issues: schema.success ? "duplicate-offerings" : schema.error.issues, userId: user.id },
          "insertByUser validation failed",
        );
        return err("invalid-data");
      }

      const { date, hour, offerings, staff } = schema.data;
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
          expiresAt: this.nextRomeMidnight(date),
          staffID: staff,
        },
        offerings,
        { userId: user.id, source: "insertByUser" },
      );
    } catch (e) {
      logger.error({ err: e, userId: user.id }, "insertByUser failed");
      return err("server-err");
    }
  }

  async insertByAnonymous(data: AnonymousData): Promise<Result<ReservationDTO, InsertError>> {
    try {
      const schema = anonymousUserSchema.safeParse({
        ...data,
        email: data.email.toLowerCase().trim(),
        date: data.date?.toString(),
      });
      if (!schema.success || !this.validateOfferingIDs(schema.data.offerings)) {
        logger.warn(
          { reason: schema.success ? "duplicate-offerings" : schema.error.issues[0]?.path },
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
        expiresAt: reservationConfirmationExpiresAt(),
        pending: true,
        staffID: schema.data.staff,
      };
      return await this.insertAndFetch(reservation, schema.data.offerings, {
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
    user: UserRow,
    alternativeName?: string,
  ): Promise<Result<ReservationDTO, InsertError>> {
    try {
      const schema = staffUserSchema.safeParse({
        ...data,
        name: alternativeName ?? "Inserito da staff",
        date: data.date?.toString(),
      });
      if (!schema.success || !this.validateOfferingIDs(schema.data.offerings)) {
        logger.error(
          {
            issues: schema.success ? "duplicate-offerings" : schema.error.issues,
            staffId: user.id,
          },
          "insertByStaff validation failed",
        );
        return err("invalid-data");
      }

      const { date, hour, offerings, staff, name, phone } = schema.data;
      return await this.insertAndFetch(
        {
          date,
          hour,
          id: crypto.randomUUID(),
          name,
          email: user.email,
          pending: false,
          expiresAt: this.nextRomeMidnight(date),
          staffID: staff,
          phoneNumber: phone ?? null,
        },
        offerings,
        { staffId: user.id, source: "insertByStaff" },
      );
    } catch (e) {
      logger.error({ err: e, staffId: user.id }, "insertByStaff failed");
      return err("server-err");
    }
  }

  private async insertAndFetch(
    reservation: InsertReservation,
    offeringIDs: string[],
    logContext: Record<string, unknown>,
  ): Promise<Result<ReservationDTO, InsertError>> {
    const inserted = await this.insertWithAvailabilityCheck(reservation, offeringIDs);
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

  async getAll(): Promise<ReservationDTO[] | null> {
    try {
      return await this.findReservations(gt(table.reservation.expiresAt, new Date()));
    } catch (e) {
      logger.error({ err: e }, "getAll failed");
      return null;
    }
  }

  async getOccupiedSlots(): Promise<OccupiedReservationSlot[] | null> {
    try {
      const reservations = await this.findReservations(gt(table.reservation.expiresAt, new Date()));
      return reservations.map((reservation) => ({
        date: reservation.date,
        hour: reservation.hour,
        staff: { id: reservation.staff.id },
        offerings: reservation.offerings.map(({ duration }) => ({ duration })),
      }));
    } catch (e) {
      logger.error({ err: e }, "getOccupiedSlots failed");
      return null;
    }
  }

  async getTodayReservations(date: string, staffID: string): Promise<ReservationDTO[] | null> {
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

  async getByUser(userID: string, email: string): Promise<ReservationDTO[] | null> {
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

  async getByIDForUser(id: string, userID: string, email: string): Promise<ReservationDTO | null> {
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

  async getByID(id: string): Promise<ReservationDTO | null> {
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

  async deleteByStaff(id: string, staffID: string) {
    try {
      return await this.database
        .delete(table.reservation)
        .where(and(eq(table.reservation.id, id), eq(table.reservation.staffID, staffID)))
        .returning();
    } catch (e) {
      logger.error({ err: e, reservationId: id, staffId: staffID }, "deleteByStaff failed");
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

  async updateExpiration(id: string): Promise<ReservationDTO | null> {
    try {
      const existing = await this.database
        .select({ date: table.reservation.date })
        .from(table.reservation)
        .where(eq(table.reservation.id, id))
        .get();
      if (!existing) return null;

      const updated = await this.database
        .update(table.reservation)
        .set({
          pending: false,
          // SQLite's date modifier is UTC-based; compute the DST-aware Rome boundary in JS.
          expiresAt: this.nextRomeMidnight(existing.date),
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

  private parseAppointment(date: string, hour: string): { startsAt: Date; day: number } | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hour)) {
      return null;
    }

    try {
      const calendarDate = parseDate(date);
      const startsAt = parseDateTime(`${date}T${hour}`).toDate(BUSINESS_TIME_ZONE);
      // Database weekdays are Monday=0 through Sunday=6.
      const day =
        (new Date(
          Date.UTC(calendarDate.year, calendarDate.month - 1, calendarDate.day),
        ).getUTCDay() +
          6) %
        7;
      return { startsAt, day };
    } catch {
      return null;
    }
  }

  private async insertWithAvailabilityCheck(
    reservation: InsertReservation,
    offeringIDs: string[],
  ): Promise<Result<table.ReservationRow, InsertError>> {
    try {
      return await this.database.transaction(async (tx) => {
        const appointment = this.parseAppointment(reservation.date, reservation.hour);
        if (!appointment || appointment.startsAt.getTime() <= Date.now())
          return err("invalid-data");

        const [activeStaff] = await tx
          .select({ id: table.staff.userID })
          .from(table.staff)
          .where(and(eq(table.staff.userID, reservation.staffID), eq(table.staff.isActive, true)))
          .limit(1);
        if (!activeStaff) return err("invalid-data");

        const requestedOfferings = await tx
          .select({
            id: table.offering.id,
            duration: table.offering.duration,
          })
          .from(table.offering)
          .where(
            and(
              inArray(table.offering.id, offeringIDs),
              eq(table.offering.staffID, reservation.staffID),
              eq(table.offering.active, true),
            ),
          );

        if (requestedOfferings.length !== offeringIDs.length) return err("invalid-data");

        const requestedDuration = requestedOfferings.reduce(
          (sum, offering) => sum + offering.duration,
          0,
        );
        const requestedStart = this.minutesFromMidnight(reservation.hour);
        const requestedEnd = requestedStart + requestedDuration;
        if (
          requestedOfferings.some(
            (offering) => !Number.isInteger(offering.duration) || offering.duration <= 0,
          )
        ) {
          return err("invalid-data");
        }

        const scheduleRanges = await tx
          .select({
            startHour: table.schedule.startHour,
            startMinute: table.schedule.startMinute,
            endHour: table.schedule.endHour,
            endMinute: table.schedule.endMinute,
          })
          .from(table.schedule)
          .where(
            and(
              eq(table.schedule.staffID, reservation.staffID),
              eq(table.schedule.day, appointment.day),
            ),
          );
        const containedBySchedule = scheduleRanges.some((range) => {
          const rangeStart = range.startHour * 60 + range.startMinute;
          const rangeEnd = range.endHour * 60 + range.endMinute;
          return requestedStart >= rangeStart && requestedEnd <= rangeEnd;
        });
        if (!containedBySchedule) return err("invalid-data");

        const [shutdown] = await tx
          .select({ id: table.shutdowns.id })
          .from(table.shutdowns)
          .where(
            and(
              eq(table.shutdowns.staffID, reservation.staffID),
              sql`${table.shutdowns.start} <= ${reservation.date}`,
              sql`${table.shutdowns.end} >= ${reservation.date}`,
            ),
          )
          .limit(1);
        if (shutdown) return err("invalid-data");

        const existingStart = sql<number>`
          cast(substr(${table.reservation.hour}, 1, 2) as integer) * 60
          + cast(substr(${table.reservation.hour}, 4, 2) as integer)
        `;
        const [conflict] = await tx
          .select({ id: table.reservation.id })
          .from(table.reservation)
          .innerJoin(
            table.reservationOffering,
            eq(table.reservation.id, table.reservationOffering.reservationID),
          )
          .innerJoin(table.offering, eq(table.reservationOffering.offeringID, table.offering.id))
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
              sql`${requestedStart} < ${existingStart} + sum(${table.offering.duration})`,
              sql`${existingStart} < ${requestedEnd}`,
            ),
          )
          .limit(1);

        if (conflict) return err("conflict");

        const [inserted] = await tx.insert(table.reservation).values(reservation).returning();
        await tx.insert(table.reservationOffering).values(
          offeringIDs.map((offeringID, position) => ({
            reservationID: reservation.id,
            offeringID,
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
