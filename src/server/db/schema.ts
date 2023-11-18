import { relations, sql } from "drizzle-orm";
import { bigint, index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable('auth_user', {
  id: varchar("id", {
    length: 15
  }).primaryKey(),

  username: varchar("username", {
    length: 64
  }).notNull(),

  // can't do profile_picture because lucia's planetscale adapter takes key literally
  profilePicture: varchar("profilePicture", {
    length: 255
  }).notNull(),
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

export const key = mysqlTable('user_key', {
  id: varchar("id", {
    length: 255
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15
  })
    .notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255
  })
});

export const session = mysqlTable('user_session', {
  id: varchar("id", {
    length: 128
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15
  })
    .notNull(),
  activeExpires: bigint("active_expires", {
    mode: "number"
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number"
  }).notNull()
});

export const creator = mysqlTable('creator', {
  id: int("id").primaryKey().primaryKey().autoincrement(),
  userId: varchar("user_id", {
    length: 15
  })
    .notNull(),
    
  accessToken: varchar("access_token", {
    length: 255
  }).notNull(),
  refreshToken: varchar("refresh_token", {
    length: 255
  }).notNull(),

  channelTitle: varchar("channel_title", {
    length: 255
  }).notNull(),
  channelId: varchar("channel_id", {
    length: 255
  }).notNull().unique(),
  channelCustomUrl: varchar("channel_custom_url", {
    length: 255
  }),
  channelThumbnail: varchar("channel_thumbnail", {
    length: 512
  }).notNull(),
}, (t) => ({
  userIdIndex: index('user_id_index').on(t.userId)
}))

export const creatorRelations = relations(creator, ({ one }) => ({
  user: one(user, {
    fields: [creator.userId],
    references: [user.id],
  })
}))

export const upload = mysqlTable('upload', {
  id: int("id").primaryKey().primaryKey().autoincrement(),
  userId: varchar("user_id", {
    length: 15
  })
    .notNull(),

  videoId: varchar("video_id", {
    length: 255
  }).notNull(),
  title: varchar("title", {
    length: 255
  }).notNull(),

  /** use sql`UNIX_TIMESTAMP()` */
  createdAt: bigint("created_at", {
    mode: "number"
  }).notNull(),
}, (t) => ({
  userIdIndex: index('user_id_index').on(t.userId),
  videoIdIndex: index('video_id_index').on(t.videoId),
}))

export const uploadRelations = relations(upload, ({ one }) => ({
  user: one(user, {
    fields: [upload.userId],
    references: [user.id],
  }),
  creator: one(creator, {
    fields: [upload.userId],
    references: [creator.userId],
  })
}))