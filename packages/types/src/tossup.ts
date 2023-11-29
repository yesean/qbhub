import { Question } from './question.js';

export type Tossup = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  normalizedAnswer: string;
} & Question;

export enum TossupScore {
  neg = -5,
  incorrect = 0,
  ten = 10,
  power = 15,
}

export type TossupWord = {
  word: string;
  bold: boolean;
};

export type TossupResult = {
  tossup: Tossup;
  userAnswer: string;
  isCorrect: boolean;
  buzzIndex: number;
  words: TossupWord[];
  score: TossupScore;
};
