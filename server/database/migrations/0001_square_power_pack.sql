CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`is_public` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_public_id_unique` ON `users` (`public_id`);--> statement-breakpoint
ALTER TABLE `habits` ADD `is_public` integer DEFAULT false NOT NULL;