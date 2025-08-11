import { pgTable, uuid, varchar, text, timestamp, numeric, pgEnum } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH']);
export const statusEnum = pgEnum('status', ['TODO', 'IN_PROGRESS', 'DONE']);

export const tasks = pgTable('tasks', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    description: text('description').notNull(),
    priority: priorityEnum('priority').notNull(),
    status: statusEnum('status').notNull(),
    assignedTo: varchar('assignedTo', { length: 256 }).notNull(),
    tags: text('tags').array().notNull().default([]),
    dueDate: timestamp('dueDate', { withTimezone: true }),
    estimatedHours: numeric('estimatedHours').notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull()
});
