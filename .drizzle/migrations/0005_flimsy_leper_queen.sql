CREATE TABLE `creator` (
	`uuid` varchar(255) NOT NULL DEFAULT 'uuidv4()',
	`user_id` varchar(15) NOT NULL,
	CONSTRAINT `creator_uuid` PRIMARY KEY(`uuid`)
);
