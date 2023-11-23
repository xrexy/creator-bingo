import { relations, sql } from "drizzle-orm";
import { bigint, index, int, mysqlTable, varchar,  } from "drizzle-orm/mysql-core";

// --- User

export const user = mysqlTable('auth_user', {
  id: varchar("id", { length: 15 }).primaryKey(),
  username: varchar("username", { length: 64 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
});

export const userRelations = relations(user, ({ one }) => ({
  key: one(key, {
    fields: [user.id],
    references: [key.userId]
  }),
  session: one(session, {
    fields: [user.id],
    references: [session.userId]
  }),
  creatorAccount: one(creator, {
    fields: [user.id],
    references: [creator.userId]
  })
}))


// --- Lucia Auth (key + session)

export const key = mysqlTable('user_key', {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 15 }).notNull(),

  hashedPassword: varchar("hashed_password", {
    length: 255
  })
});

export const session = mysqlTable('user_session', {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("user_id", { length: 15 }).notNull(),

  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull()
});


// --- Creator

export const creator = mysqlTable('creator', {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 15 }).notNull(),

  accessToken: varchar("access_token", { length: 1024 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 512 }).notNull(),

  channelTitle: varchar("channel_title", { length: 255 }).notNull(),
  channelId: varchar("channel_id", { length: 255 }).notNull().unique(),
  channelCustomUrl: varchar("channel_custom_url", { length: 255 }),
  channelThumbnail: varchar("channel_thumbnail", { length: 512 }).notNull(),
}, (t) => ({
  userIdIndex: index('user_id_index').on(t.userId)
}))

export const creatorRelations = relations(creator, ({ one }) => ({
  user: one(user, {
    fields: [creator.userId],
    references: [user.id],
  })
}))


// --- Board

export const board = mysqlTable('board', {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 15 }).notNull(),

  resourceId: varchar("resource_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),

  /** use sql`UNIX_TIMESTAMP()` */
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
}, (t) => ({
  userIdIndex: index('user_id_index').on(t.userId),
  resourceIdIdx: index('resource_id_index').on(t.resourceId),
}))

export const uploadRelations = relations(board, ({ one }) => ({
  user: one(user, {
    fields: [board.userId],
    references: [user.id],
  }),
  creator: one(creator, {
    fields: [board.userId],
    references: [creator.userId],
  })
}))
