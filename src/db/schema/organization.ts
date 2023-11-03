import {
  int,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const organizations = mysqlTable(
  "organization",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (organization) => ({
    nameIndex: uniqueIndex("name_index").on(organization.name),
  })
);
