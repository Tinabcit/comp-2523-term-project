import type {
  CreateJokeInput,
  DeleteJokeInput,
  Joke,
  VoteJokeInput,
} from "#/types";
import { and, desc, eq, sql } from "drizzle-orm";
import type { DbClient } from "./db/client";
import { commentsTable, jokesTable, votesTable } from "./db/schema";

export class JokeService {
  constructor(private readonly db: DbClient) {}

  async getJokes(): Promise<Joke[]> {
    const rows = await this.db.query.jokesTable.findMany({
      with: {
        comments: {
          columns: {
            body: true,
          },
          orderBy: (comment, { asc }) => [asc(comment.createdAt)],
        },
      },
      orderBy: [desc(jokesTable.score), desc(jokesTable.createdAt)],
    });

    return rows.map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      score: row.score,
      userId: row.userId,
      comments: row.comments.map((comment) => comment.body),
    }));
  }

  async createJoke(input: CreateJokeInput): Promise<Joke> {
    const [insertedJoke] = await this.db
      .insert(jokesTable)
      .values({
        question: input.question.trim(),
        answer: input.answer.trim(),
        score: 0,
        userId: input.userId,
      })
      .returning({
        id: jokesTable.id,
        question: jokesTable.question,
        answer: jokesTable.answer,
        score: jokesTable.score,
        userId: jokesTable.userId,
      });

    if (!insertedJoke) {
      throw new Error("Failed to insert joke.");
    }

    return {
      ...insertedJoke,
      comments: [],
    };
  }

  async voteJoke(input: VoteJokeInput): Promise<Joke> {
    const existingVote = await this.db.query.votesTable.findFirst({
      where: and(
        eq(votesTable.jokeId, input.id),
        eq(votesTable.userId, input.userId),
      ),
    });

    if (!existingVote) {
      await this.db.insert(votesTable).values({
        jokeId: input.id,
        userId: input.userId,
        value: input.delta,
      });
    } else {
      await this.db
        .update(votesTable)
        .set({
          value: input.delta,
        })
        .where(
          and(
            eq(votesTable.jokeId, input.id),
            eq(votesTable.userId, input.userId),
          ),
        );
    }

    const [scoreRow] = await this.db
      .select({
        totalScore: sql<number>`coalesce(sum(${votesTable.value}), 0)`,
      })
      .from(votesTable)
      .where(eq(votesTable.jokeId, input.id));

    const [updatedJokeRow] = await this.db
      .update(jokesTable)
      .set({
        score: scoreRow?.totalScore ?? 0,
      })
      .where(eq(jokesTable.id, input.id))
      .returning({
        id: jokesTable.id,
        question: jokesTable.question,
        answer: jokesTable.answer,
        score: jokesTable.score,
        userId: jokesTable.userId,
      });

    if (!updatedJokeRow) {
      throw new Error("Joke not found.");
    }

    const comments = await this.db.query.commentsTable.findMany({
      columns: {
        body: true,
      },
      where: eq(commentsTable.jokeId, input.id),
      orderBy: (comment, { asc }) => [asc(comment.createdAt)],
    });

    return {
      ...updatedJokeRow,
      comments: comments.map((comment) => comment.body),
    };
  }

  async deleteJoke(input: DeleteJokeInput): Promise<void> {
    const joke = await this.db.query.jokesTable.findFirst({
      where: eq(jokesTable.id, input.id),
    });

    if (!joke) {
      throw new Error("Joke not found.");
    }

    if (joke.userId !== input.userId) {
      throw new Error("You can only delete your own joke.");
    }

    const result = await this.db
      .delete(jokesTable)
      .where(eq(jokesTable.id, input.id));

    const wasDeleted = Number(result.rowCount ?? 0) > 0;

    if (!wasDeleted) {
      throw new Error("Joke not found.");
    }
  }
}