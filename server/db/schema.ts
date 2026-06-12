import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum:['patient', 'doctor', 'admin']} ).notNull(), 
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const patientProfileTable = sqliteTable('patient_profile', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => userTable.id),
  birthDate: text('birth_date'),
  phone: text('phone'),
  address: text('address'),
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  createdAt: text('created_at').notNull(),
})

export const doctorProfileTable = sqliteTable('doctor_profile', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => userTable.id),
  specialization: text('specialization'),
  phone: text('phone'),
  createdAt: text('created_at').notNull(),
})

export const doctorPatientTable = sqliteTable('doctor_patient', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  doctorId: integer('doctor_id').notNull().references(() => doctorProfileTable.id),
  patientId: integer('patient_id').notNull().references(() => patientProfileTable.id),
  createdAt: text('created_at').notNull(),
})

export const measurementsTable = sqliteTable('measurements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patientProfileTable.id),
  type: text('type').notNull(),
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  measuredAt: text('measured_at').notNull(),
  createdAt: text('created_at').notNull(),
}) 

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey().notNull(),
  userId: integer('user_id').notNull().references(() => userTable.id),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
})