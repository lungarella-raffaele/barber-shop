CREATE TABLE IF NOT EXISTS `banner` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`message` text,
	`visible` integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer,
	`email` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `kind` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`name` text NOT NULL,
	`duration` integer NOT NULL,
	`price` integer NOT NULL,
	`description` text,
	`active` integer NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `password_recover` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reservation` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`hour` text NOT NULL,
	`phone_number` text,
	`kind_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`pending` integer NOT NULL,
	`staff_id` text NOT NULL,
	FOREIGN KEY (`kind_id`) REFERENCES `kind`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `schedule` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`staff_id` text NOT NULL,
	`day` integer NOT NULL,
	`start_hour` integer NOT NULL,
	`start_minute` integer DEFAULT 0 NOT NULL,
	`end_hour` integer NOT NULL,
	`end_minute` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `shutdown` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `staff` (
	`user_id` text PRIMARY KEY NOT NULL,
	`avatar` text,
	`avatar_original` text,
	`avatar_offset_x` real,
	`avatar_offset_y` real,
	`avatar_display_scale` real,
	`is_active` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone_number` text,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`verified_email` integer,
	`expires_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_email_unique` ON `user` (`email`);
