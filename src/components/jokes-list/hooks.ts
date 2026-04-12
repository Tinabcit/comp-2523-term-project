import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteJokeMutation, voteJokeMutation } from "#/queries";
import { deleteJoke, voteJoke } from "#/serverFunctions/jokeFns";
import type { Joke } from "#/types";

type VoteJokeMutationVariables = {
  data: {
    id: number;
    delta: 1 | -1;
  };
};

type DeleteJokeMutationVariables = {
  data: {
    id: number;
  };
};

export function useOpenCommentsJoke() {
  const [openCommentsJokeId, setOpenCommentsJokeId] = useState<number | null>(
    null,
  );

  const toggleCommentsForJoke = (jokeId: number) => {
    setOpenCommentsJokeId((currentId) =>
      currentId === jokeId ? null : jokeId,
    );
  };

  const closeComments = () => {
    setOpenCommentsJokeId(null);
  };

  return { openCommentsJokeId, toggleCommentsForJoke, closeComments };
}

export function useVoteJoke() {
  const queryClient = useQueryClient();
  const voteJokeServerFn = useServerFn(voteJoke);

  const { mutate: mutateVote } = useMutation<
    Joke,
    Error,
    VoteJokeMutationVariables
  >({
    ...voteJokeMutation,
    mutationFn: (variables) => voteJokeServerFn(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jokes"] });
    },
    onError: (error) => {
      console.error("Vote error:", error);
      alert(error.message);
    },
  });

  const vote = (jokeId: number, delta: 1 | -1) => {
    mutateVote({
      data: { id: jokeId, delta },
    });
  };

  return { vote };
}

export function useDeleteJoke() {
  const queryClient = useQueryClient();
  const deleteJokeServerFn = useServerFn(deleteJoke);

  const {
    mutate: mutateDelete,
    isPending,
    variables,
  } = useMutation<void, Error, DeleteJokeMutationVariables>({
    ...deleteJokeMutation,
    mutationFn: (variables) => deleteJokeServerFn(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jokes"] });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert(error.message);
    },
  });

  const deleteById = (jokeId: number) => {
    mutateDelete({
      data: { id: jokeId },
    });
  };

  return {
    deleteById,
    isDeleting: isPending,
    deletingJokeId: variables?.data?.id ?? null,
  };
}

export function useJokesListController() {
  const { vote } = useVoteJoke();
  const { deleteById, deletingJokeId } = useDeleteJoke();
  const { openCommentsJokeId, toggleCommentsForJoke, closeComments } =
    useOpenCommentsJoke();

  return {
    openCommentsJokeId,
    onVote: vote,
    onToggleComments: toggleCommentsForJoke,
    onCloseComments: closeComments,
    onDelete: deleteById,
    deletingJokeId,
  };
}