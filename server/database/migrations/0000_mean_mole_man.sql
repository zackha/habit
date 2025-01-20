CREATE TABLE `habits` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`complete_days` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL
);
