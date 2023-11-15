ALTER TABLE `creator` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `creator` DROP COLUMN `uuid`;--> statement-breakpoint
ALTER TABLE `creator` ADD PRIMARY KEY(`user_id`);