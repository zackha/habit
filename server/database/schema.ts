import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  completeDays: text('complete_days', { mode: 'json' }).$type<string[]>().notNull().default([]),
  public: integer('public', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const user = sqliteTable('user', {
  id: integer('id').primaryKey(),
  public: integer('public', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
