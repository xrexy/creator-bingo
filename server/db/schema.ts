import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const test = mysqlTable('test', {
  id: int('id').primaryKey().autoincrement(),
})
