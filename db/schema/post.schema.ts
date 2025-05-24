import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
  timestamps
} from './column.helpers'
import { users } from './user.schema'
import { InferSelectModel, relations } from 'drizzle-orm'

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  ...timestamps
})

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.author_id],
    references: [users.id]
  })
}))

export type Post = InferSelectModel<typeof posts>

export const postSelectSchema = createSelectSchema(posts)
export const postInsertSchema = createInsertSchema(posts).omit({
  created_at: true,
  updated_at: true,
  deleted_at: true
})
export const postUpdateSchema = createUpdateSchema(posts).omit({
  created_at: true,
  updated_at: true,
  deleted_at: true
})
