import { Question } from './question';

export type Tossup = {
  id: number;
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
  isCorrect: boolean;
  userAnswer: string;
  score: TossupScore;
  buzzIndex: number;
  words: TossupWord[];
  tossup: Tossup;
};
