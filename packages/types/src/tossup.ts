import { Question } from './question.js';

export type Tossup = Question & {
  answer: string;
  formattedAnswer: string;
  formattedText: string;
  normalizedAnswer: string;
  text: string;
};

export enum TossupScore {
  neg = -5,
  incorrect = 0,
  ten = 10,
  power = 15,
}

export type TossupWord = {
  bold: boolean;
  word: string;
};

export type TossupResult = {
  buzzIndex: number;
  isCorrect: boolean;
  score: TossupScore;
  tossup: Tossup;
  userAnswer: string;
  words: TossupWord[];
};
