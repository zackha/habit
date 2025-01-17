import { sqliteTable, integer, text, blob } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  completeDays: blob('complete_days').$type<string[]>().notNull().default([]),
  targetDays: integer('target_days').notNull().default(40),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
