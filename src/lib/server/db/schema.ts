import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	phoneNumber: text('phone_number').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userID: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const reservation = sqliteTable('reservation', {
	id: text('id').primaryKey(),
	date: text('date').notNull(),
	hour: text('hour').notNull(),
	serviceID: text('service_id')
		.notNull()
		.references(() => service.id),
	name: text('name').notNull(),
	email: text('email').notNull()
});

export const service = sqliteTable('service', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	duration: integer('duration').notNull(),
	price: integer('price').notNull(),
	description: text('description').notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Reservation = typeof reservation.$inferSelect;
export type Service = typeof service.$inferSelect;
