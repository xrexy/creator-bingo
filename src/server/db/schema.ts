import { mysqlTable, bigint, varchar } from "drizzle-orm/mysql-core";
import { TABLE_NAMES } from "../lucia";

export const user = mysqlTable(TABLE_NAMES.user, {
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

export const key = mysqlTable(TABLE_NAMES.key, {
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

export const session = mysqlTable(TABLE_NAMES.session, {
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
  uuid: varchar("uuid", {
    length: 255
  }).primaryKey().default("uuid()"),

  userId: varchar("user_id", {
    length: 15
  })
    .notNull(),

})

// <iframe width="944" height="531" src="https://www.youtube.com/embed/HamlJatS3XE" title="It&#39;s been a year..." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>