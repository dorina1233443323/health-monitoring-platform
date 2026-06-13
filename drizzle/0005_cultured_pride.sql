CREATE TABLE `health_goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL,
	`type` text NOT NULL,
	`target_value` real,
	`unit` text,
	`start_date` text,
	`end_date` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patient_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `doctor_patient`;--> statement-breakpoint
DROP TABLE `doctor_profile`;--> statement-breakpoint
ALTER TABLE `patient_profile` ADD `sex` text;--> statement-breakpoint
ALTER TABLE `patient_profile` ADD `height_cm` real;--> statement-breakpoint
ALTER TABLE `patient_profile` ADD `weight_kg` real;