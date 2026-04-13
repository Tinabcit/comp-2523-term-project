// add the changes and make sure to the code works with the correct paths and imports if the files are not in the same directory as signin.tsx
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