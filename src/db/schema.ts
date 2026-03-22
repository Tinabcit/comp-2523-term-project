import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Jokes table
export const jokes = pgTable("jokes", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  jokeId: integer("joke_id").notNull().references(() => jokes.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});