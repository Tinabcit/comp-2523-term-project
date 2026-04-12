import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { dbConnection } from "#/dal/db/client";
import { JokeService } from "#/dal/JokeService";
import { auth } from "#/lib/auth";
import type {
  VoteJokePayload,
  DeleteJokePayload,
  CreateJokePayload,
} from "#/types";

const db = dbConnection();
const jokeService = new JokeService(db);

export const voteJoke = createServerFn({ method: "POST" })
  .inputValidator((data: VoteJokePayload) => data)
  .handler(async ({ data }) => {
    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw new Error("You must be signed in to vote.");
    }

    return await jokeService.voteJoke({
      id: data.id,
      delta: data.delta,
      userId: session.user.id,
    });
  });

export const deleteJoke = createServerFn({ method: "POST" })
  .inputValidator((data: DeleteJokePayload) => data)
  .handler(async ({ data }) => {
    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw new Error("You must be signed in to delete.");
    }

    await jokeService.deleteJoke({
      id: data.id,
      userId: session.user.id,
    });
  });

export const createJoke = createServerFn({ method: "POST" })
  .inputValidator((data: CreateJokePayload) => data)
  .handler(async ({ data }) => {
    const request = getRequest();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw new Error("You must be signed in to add a joke.");
    }

    return await jokeService.createJoke({
      question: data.question,
      answer: data.answer,
      userId: session.user.id,
    });
  });