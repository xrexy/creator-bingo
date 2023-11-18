CREATE TABLE `creator` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`access_token` varchar(255) NOT NULL,
	`channel_title` varchar(255) NOT NULL,
	`channel_id` varchar(255) NOT NULL,
	`channel_custom_url` varchar(255),
	`channel_thumbnail` varchar(512) NOT NULL,
	CONSTRAINT `creator_id` PRIMARY KEY(`id`)
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
CREATE TABLE `upload` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`video_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`created_at` bigint NOT NULL,
	CONSTRAINT `upload_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` varchar(15) NOT NULL,
	`username` varchar(64) NOT NULL,
	`profilePicture` varchar(255) NOT NULL,
	CONSTRAINT `auth_user_id` PRIMARY KEY(`id`)
);
