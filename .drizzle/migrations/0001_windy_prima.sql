ALTER TABLE `creator` MODIFY COLUMN `access_token` varchar(1024) NOT NULL;--> statement-breakpoint
ALTER TABLE `creator` MODIFY COLUMN `refresh_token` varchar(512) NOT NULL;