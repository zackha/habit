CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `habits` ADD `public` integer DEFAULT false NOT NULL;
