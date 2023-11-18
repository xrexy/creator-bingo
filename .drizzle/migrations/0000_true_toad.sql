CREATE TABLE `board` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`resource_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`created_at` bigint NOT NULL,
	CONSTRAINT `board_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creator` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`access_token` varchar(255) NOT NULL,
	`refresh_token` varchar(255) NOT NULL,
	`channel_title` varchar(255) NOT NULL,
	`channel_id` varchar(255) NOT NULL,
	`channel_custom_url` varchar(255),
	`channel_thumbnail` varchar(512) NOT NULL,
	CONSTRAINT `creator_id` PRIMARY KEY(`id`),
	CONSTRAINT `creator_channel_id_unique` UNIQUE(`channel_id`)
);
--> statement-breakpoint
CREATE TABLE `user_key` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`hashed_password` varchar(255),
	CONSTRAINT `user_key_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL,
	CONSTRAINT `user_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` varchar(15) NOT NULL,
	`username` varchar(64) NOT NULL,
	`avatar` varchar(255) NOT NULL,
	CONSTRAINT `auth_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_index` ON `board` (`user_id`);--> statement-breakpoint
CREATE INDEX `resource_id_index` ON `board` (`resource_id`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `creator` (`user_id`);