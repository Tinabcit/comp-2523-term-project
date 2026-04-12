import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { dbConnection } from "#/dal/db/client";
import { JokeService } from "#/dal/JokeService";

const db = dbConnection();
const jokeService = new JokeService(db);

export const getJokes = createServerFn().handler(async () => {
  const jokes = await jokeService.getJokes();

  const sortedJokes = [...jokes].sort((a, b) => b.score - a.score);

  return {
    topJokes: sortedJokes.slice(0, 3),
    remainingJokes: sortedJokes.slice(3),
  };
});

export const getJokesQuery = queryOptions({
  queryKey: ["jokes"],
  queryFn: () => getJokes(),
});

export const voteJokeMutation = {
  mutationKey: ["voteJoke"],
};

export const deleteJokeMutation = {
  mutationKey: ["deleteJoke"],
};

export type CreateJokeMutationVariables = {
  data: {
    question: string;
    answer: string;
  };
};

export const createJokeMutation = {
  mutationKey: ["createJoke"],
};