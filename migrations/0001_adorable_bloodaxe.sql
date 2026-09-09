PRAGMA foreign_keys=OFF;--> statement-breakpoint

CREATE TABLE `__new_email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer,
	`email` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_email_verification`("id", "user_id", "expires_at", "email", "created_at", "updated_at")
SELECT "id", "user_id", "expires_at", "email", unixepoch(), unixepoch() FROM `email_verification`;
--> statement-breakpoint
DROP TABLE `email_verification`;
--> statement-breakpoint
ALTER TABLE `__new_email_verification` RENAME TO `email_verification`;
--> statement-breakpoint

CREATE TABLE `__new_kind` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`name` text NOT NULL,
	`duration` integer NOT NULL,
	`price` integer NOT NULL,
	`description` text,
	`active` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_kind`("id", "staff_id", "name", "duration", "price", "description", "active", "created_at", "updated_at")
SELECT "id", "staff_id", "name", "duration", "price", "description", "active", unixepoch(), unixepoch() FROM `kind`;
--> statement-breakpoint
DROP TABLE `kind`;
--> statement-breakpoint
ALTER TABLE `__new_kind` RENAME TO `kind`;
--> statement-breakpoint

CREATE TABLE `__new_password_recover` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_password_recover`("id", "user_id", "expires_at", "created_at", "updated_at")
SELECT "id", "user_id", "expires_at", unixepoch(), unixepoch() FROM `password_recover`;
--> statement-breakpoint
DROP TABLE `password_recover`;
--> statement-breakpoint
ALTER TABLE `__new_password_recover` RENAME TO `password_recover`;
--> statement-breakpoint

CREATE TABLE `__new_reservation` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`hour` text NOT NULL,
	`phone_number` text,
	`kind_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`pending` integer DEFAULT false NOT NULL,
	`staff_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kind_id`) REFERENCES `kind`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_reservation`("id", "date", "hour", "phone_number", "kind_id", "name", "email", "expires_at", "pending", "staff_id", "created_at", "updated_at")
SELECT "id", "date", "hour", "phone_number", "kind_id", "name", "email", "expires_at", "pending", "staff_id", unixepoch(), unixepoch() FROM `reservation`;
--> statement-breakpoint
DROP TABLE `reservation`;
--> statement-breakpoint
ALTER TABLE `__new_reservation` RENAME TO `reservation`;
--> statement-breakpoint

CREATE TABLE `__new_schedule` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`staff_id` text NOT NULL,
	`day` integer NOT NULL,
	`start_hour` integer NOT NULL,
	`start_minute` integer DEFAULT 0 NOT NULL,
	`end_hour` integer NOT NULL,
	`end_minute` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_schedule`("id", "staff_id", "day", "start_hour", "start_minute", "end_hour", "end_minute", "created_at", "updated_at")
SELECT "id", "staff_id", "day", "start_hour", "start_minute", "end_hour", "end_minute", unixepoch(), unixepoch() FROM `schedule`;
--> statement-breakpoint
DROP TABLE `schedule`;
--> statement-breakpoint
ALTER TABLE `__new_schedule` RENAME TO `schedule`;
--> statement-breakpoint

CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "user_id", "expires_at", "created_at", "updated_at")
SELECT "id", "user_id", "expires_at", unixepoch(), unixepoch() FROM `session`;
--> statement-breakpoint
DROP TABLE `session`;
--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;
--> statement-breakpoint

CREATE TABLE `__new_shutdown` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_shutdown`("id", "staff_id", "start", "end", "created_at", "updated_at")
SELECT "id", "staff_id", "start", "end", unixepoch(), unixepoch() FROM `shutdown`;
--> statement-breakpoint
DROP TABLE `shutdown`;
--> statement-breakpoint
ALTER TABLE `__new_shutdown` RENAME TO `shutdown`;
--> statement-breakpoint

CREATE TABLE `__new_staff` (
	`user_id` text PRIMARY KEY NOT NULL,
	`avatar` text,
	`avatar_original` text,
	`avatar_offset_x` real,
	`avatar_offset_y` real,
	`avatar_display_scale` real,
	`is_active` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_staff`("user_id", "avatar", "avatar_original", "avatar_offset_x", "avatar_offset_y", "avatar_display_scale", "is_active", "created_at", "updated_at")
SELECT "user_id", "avatar", "avatar_original", "avatar_offset_x", "avatar_offset_y", "avatar_display_scale", "is_active", unixepoch(), unixepoch() FROM `staff`;
--> statement-breakpoint
DROP TABLE `staff`;
--> statement-breakpoint
ALTER TABLE `__new_staff` RENAME TO `staff`;
--> statement-breakpoint

CREATE TABLE `__new_banner` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`message` text,
	`visible` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_banner`("id", "message", "visible", "created_at", "updated_at")
SELECT "id", "message", "visible", unixepoch(), unixepoch() FROM `banner`;
--> statement-breakpoint
DROP TABLE `banner`;
--> statement-breakpoint
ALTER TABLE `__new_banner` RENAME TO `banner`;
--> statement-breakpoint

CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone_number` text,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`verified_email` integer DEFAULT false NOT NULL,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "phone_number", "email", "password_hash", "verified_email", "expires_at", "created_at", "updated_at")
SELECT "id", "name", "phone_number", "email", "password_hash", "verified_email", "expires_at", unixepoch(), unixepoch() FROM `user`;
--> statement-breakpoint
DROP TABLE `user`;
--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;
--> statement-breakpoint

CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
