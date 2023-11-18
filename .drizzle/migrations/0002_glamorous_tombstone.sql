ALTER TABLE `creator` ADD `refresh_token` varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX `video_id_index` ON `upload` (`video_id`);