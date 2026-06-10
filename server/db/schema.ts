import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').notNull(), 
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})