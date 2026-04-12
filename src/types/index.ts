export type Joke = {
  id: number;
  question: string;
  answer: string;
  score: number;
  userId: string;
  comments: string[];
};

export type CreateJokeInput = {
  question: string;
  answer: string;
  userId: string;
};

export type VoteJokeInput = {
  id: number;
  delta: 1 | -1;
  userId: string;
};

export type DeleteJokeInput = {
  id: number;
  userId: string;
};

// client-side payloads
export type VoteJokePayload = {
  id: number;
  delta: 1 | -1;
};

export type DeleteJokePayload = {
  id: number;
};

export type CreateJokePayload = {
  question: string;
  answer: string;
};