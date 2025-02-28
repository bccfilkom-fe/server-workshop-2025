import {
  index,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `workshop-2025_${name}`);

export const todos = createTable(
  "todo",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    text: varchar("text", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (todo) => ({
    textIndex: index("text_idx").on(todo.text),
  }),
);
