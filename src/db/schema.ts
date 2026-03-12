import { boolean, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid().primaryKey(),
  firstName: uuid().notNull(),
  lastName: uuid().notNull(),
  username: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const userCredential = pgTable('user_credential', {
  id: uuid().primaryKey(),
  userId: uuid().references(() => user.id),
  provider: text().notNull(),
  subject: text().notNull(),
});

export const chatRoom = pgTable('chat_room', {
  id: uuid().primaryKey(),
  ownerId: uuid().references(() => user.id),
  title: text().notNull(),
  isVisible: boolean().notNull().default(true),
  password: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const message = pgTable('message', {
  id: uuid().primaryKey(),
  userId: uuid().references(() => user.id),
  content: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const chatRoomUser = pgTable(
  'chat_room_user',
  {
    roomId: uuid().references(() => chatRoom.id),
    userId: uuid().references(() => user.id),
    nickname: text(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.roomId, table.userId] })],
);

export const chatRoomMessage = pgTable(
  'chat_room_message',
  {
    messageId: uuid().references(() => message.id),
    roomId: uuid().references(() => chatRoom.id),
  },
  (table) => [primaryKey({ columns: [table.messageId, table.roomId] })],
);

export const userMessage = pgTable(
  'user_message',
  {
    messageId: uuid().references(() => message.id),
    recipientId: uuid().references(() => user.id),
  },
  (table) => [primaryKey({ columns: [table.messageId, table.recipientId] })],
);
