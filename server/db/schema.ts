import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["patient", "admin"] }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const patientProfileTable = sqliteTable("patient_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  birthDate: text("birth_date"),
  sex: text("sex", { enum: ["male", "female", "other"] }),
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  phone: text("phone"),
  address: text("address"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  createdAt: text("created_at").notNull(),
});

export const measurementsTable = sqliteTable("measurements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patientProfileTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  measuredAt: text("measured_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const healthGoalsTable = sqliteTable("health_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patientProfileTable.id, { onDelete: "cascade" }),

  type: text("type").notNull(),
  targetValue: real("target_value"),
  startValue: real("start_value"),
  unit: text("unit"),
  direction: text("direction", {
    enum: ["increase", "decrease", "maintain"],
  }).notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status", {
    enum: ["active", "completed", "cancelled"],
  }).notNull(),
  createdAt: text("created_at").notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});
