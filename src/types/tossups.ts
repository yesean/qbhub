import { Category, Subcategory, Difficulty } from './questions';

export type Tossup = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  normalizedAnswer: string;
  category: Category;
  subcategory: Subcategory;
  difficulty: Difficulty;
  tournament: string;
  year: number;
};

export enum TossupScore {
  neg = -5,
  incorrect = 0,
  ten = 10,
  power = 15,
}

export type TossupResult = {
  isCorrect: boolean;
  userAnswer: string;
  score: TossupScore;
  buzzIndex: number;
  powerIndex: number;
  words: string[];
  tossup: Tossup;
};

export enum JudgeResult {
  correct,
  incorrect,
  prompt,
}

export type Answer = {
  answer: string;
  frequency: string;
};

export type Clue = {
  clue: string;
  sentence: string;
  tournament: string;
  score: number;
};

export type PowerWordsMap = {
  [word: string]: number;
};
