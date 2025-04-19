import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	phoneNumber: text('phone_number'),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: integer({ mode: 'boolean' }),
	pending: integer({ mode: 'boolean' })
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
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	pending: integer({ mode: 'boolean' })
});

export const service = sqliteTable('service', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	duration: integer('duration').notNull(),
	price: integer('price').notNull(),
	description: text('description').notNull(),
	active: integer({ mode: 'boolean' }).notNull()
});

export const banner = sqliteTable('banner', {
	id: integer().primaryKey(),
	message: text('message'),
	visible: integer({ mode: 'boolean' })
});

export const closures = sqliteTable('closure', {
	id: text('id').primaryKey(),
	start: text('start').notNull(),
	end: text('end').notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Reservation = typeof reservation.$inferSelect;
export type Service = typeof service.$inferSelect;
export type Banner = typeof banner.$inferSelect;
export type Closure = typeof closures.$inferSelect;
