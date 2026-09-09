CREATE TABLE `reservation_kind` (
	`reservation_id` text NOT NULL,
	`kind_id` text NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`reservation_id`, `kind_id`),
	FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kind_id`) REFERENCES `kind`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `reservation_kind_reservation_idx` ON `reservation_kind` (`reservation_id`);--> statement-breakpoint
CREATE INDEX `reservation_kind_kind_idx` ON `reservation_kind` (`kind_id`);--> statement-breakpoint
INSERT INTO `reservation_kind` (`reservation_id`, `kind_id`, `position`)
SELECT `id`, `kind_id`, 0 FROM `reservation`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reservation` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`hour` text NOT NULL,
	`phone_number` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`pending` integer DEFAULT false NOT NULL,
	`staff_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`user_id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_reservation`("id", "date", "hour", "phone_number", "name", "email", "expires_at", "pending", "staff_id", "created_at", "updated_at") SELECT "id", "date", "hour", "phone_number", "name", "email", "expires_at", "pending", "staff_id", "created_at", "updated_at" FROM `reservation`;--> statement-breakpoint
DROP TABLE `reservation`;--> statement-breakpoint
ALTER TABLE `__new_reservation` RENAME TO `reservation`;--> statement-breakpoint
PRAGMA foreign_keys=ON;