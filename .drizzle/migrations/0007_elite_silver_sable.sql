ALTER TABLE `creator` ADD `access_token` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `creator` ADD `channel_title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `creator` ADD `channel_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `creator` ADD `channel_custom_url` varchar(255);--> statement-breakpoint
ALTER TABLE `creator` ADD `channel_thumbnail` varchar(512) NOT NULL;