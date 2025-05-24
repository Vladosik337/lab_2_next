import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
  timestamps
} from './column.helpers'
import { posts } from './post.schema'
import { InferSelectModel, relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  password: text('password_hash').notNull(),
  ...timestamps
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))

export type User = InferSelectModel<typeof users>

export const userSelectSchema = createSelectSchema(users).omit({
  password: true
})
export const userInsertSchema = createInsertSchema(users).omit({
  created_at: true,
  updated_at: true,
  deleted_at: true
})
export const userUpdateSchema = createUpdateSchema(users).omit({
  created_at: true,
  updated_at: true,
  deleted_at: true
})
