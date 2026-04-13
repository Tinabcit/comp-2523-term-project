// add the changes and make sure to work the changes and the code works with the correct paths.
import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "../../../auth-schema";

/**
 * Jokes
 * - created by a signed-in user
 * - score is cached here for easy sorting
 */
export const jokesTable = pgTable("jokes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  question: text("question").notNull(),
  answer: text("answer").notNull(),

  score: integer("score").notNull().default(0),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Comments
 * - attached to a joke
 */
export const commentsTable = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  jokeId: integer("joke_id")
    .notNull()
    .references(() => jokesTable.id, { onDelete: "cascade" }),

  body: text("body").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Votes
 * - one row per user per joke
 * - value: 1 for upvote, -1 for downvote
 */
export const votesTable = pgTable(
  "votes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    jokeId: integer("joke_id")
      .notNull()
      .references(() => jokesTable.id, { onDelete: "cascade" }),

    value: integer("value").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.jokeId] }),
  }),
);

/**
 * Relations
 */
export const jokesRelations = relations(jokesTable, ({ many, one }) => ({
  comments: many(commentsTable),
  votes: many(votesTable),
  creator: one(user, {
    fields: [jokesTable.userId],
    references: [user.id],
  }),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  joke: one(jokesTable, {
    fields: [commentsTable.jokeId],
    references: [jokesTable.id],
  }),
}));

export const votesRelations = relations(votesTable, ({ one }) => ({
  joke: one(jokesTable, {
    fields: [votesTable.jokeId],
    references: [jokesTable.id],
  }),
  voter: one(user, {
    fields: [votesTable.userId],
    references: [user.id],
  }),
}));

/**
 * Types
 */
export type JokeRow = typeof jokesTable.$inferSelect;
export type NewJokeRow = typeof jokesTable.$inferInsert;

export type CommentRow = typeof commentsTable.$inferSelect;
export type NewCommentRow = typeof commentsTable.$inferInsert;

export type VoteRow = typeof votesTable.$inferSelect;
export type NewVoteRow = typeof votesTable.$inferInsert;