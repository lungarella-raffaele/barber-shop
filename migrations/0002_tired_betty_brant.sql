CREATE TABLE `public_token` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`purpose` text NOT NULL,
	`user_id` text,
	`reservation_id` text,
	`pending_email` text,
	`expires_at` integer NOT NULL,
	`consumed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `public_token_user_purpose_idx` ON `public_token` (`user_id`,`purpose`);--> statement-breakpoint
CREATE INDEX `public_token_reservation_purpose_idx` ON `public_token` (`reservation_id`,`purpose`);--> statement-breakpoint
CREATE INDEX `public_token_expires_at_idx` ON `public_token` (`expires_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_password_recover` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_password_recover`("id", "user_id", "expires_at", "created_at", "updated_at") SELECT "id", "user_id", "expires_at", "created_at", "updated_at" FROM `password_recover`;--> statement-breakpoint
DROP TABLE `password_recover`;--> statement-breakpoint
ALTER TABLE `__new_password_recover` RENAME TO `password_recover`;--> statement-breakpoint
PRAGMA foreign_keys=ON;