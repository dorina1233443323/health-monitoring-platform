PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_doctor_patient` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`doctor_id` integer NOT NULL,
	`patient_id` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`doctor_id`) REFERENCES `doctor_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`patient_id`) REFERENCES `patient_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_doctor_patient`("id", "doctor_id", "patient_id", "created_at") SELECT "id", "doctor_id", "patient_id", "created_at" FROM `doctor_patient`;--> statement-breakpoint
DROP TABLE `doctor_patient`;--> statement-breakpoint
ALTER TABLE `__new_doctor_patient` RENAME TO `doctor_patient`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_doctor_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`specialization` text,
	`phone` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_doctor_profile`("id", "user_id", "specialization", "phone", "created_at") SELECT "id", "user_id", "specialization", "phone", "created_at" FROM `doctor_profile`;--> statement-breakpoint
DROP TABLE `doctor_profile`;--> statement-breakpoint
ALTER TABLE `__new_doctor_profile` RENAME TO `doctor_profile`;--> statement-breakpoint
CREATE TABLE `__new_measurements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL,
	`type` text NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`measured_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patient_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_measurements`("id", "patient_id", "type", "value", "unit", "measured_at", "created_at") SELECT "id", "patient_id", "type", "value", "unit", "measured_at", "created_at" FROM `measurements`;--> statement-breakpoint
DROP TABLE `measurements`;--> statement-breakpoint
ALTER TABLE `__new_measurements` RENAME TO `measurements`;--> statement-breakpoint
CREATE TABLE `__new_patient_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`birth_date` text,
	`phone` text,
	`address` text,
	`emergency_contact_name` text,
	`emergency_contact_phone` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_patient_profile`("id", "user_id", "birth_date", "phone", "address", "emergency_contact_name", "emergency_contact_phone", "created_at") SELECT "id", "user_id", "birth_date", "phone", "address", "emergency_contact_name", "emergency_contact_phone", "created_at" FROM `patient_profile`;--> statement-breakpoint
DROP TABLE `patient_profile`;--> statement-breakpoint
ALTER TABLE `__new_patient_profile` RENAME TO `patient_profile`;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "user_id", "expires_at", "created_at") SELECT "id", "user_id", "expires_at", "created_at" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;