CREATE TABLE `habits` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`complete_days` blob DEFAULT '[]' NOT NULL,
	`target_days` integer DEFAULT 40 NOT NULL,
	`created_at` integer NOT NULL
);
