import { FormattedWord, Question } from './question.js';

export type Tossup = Question & {
  answer: string;
  formattedAnswer: string;
  formattedText: string;
  normalizedAnswer: string;
  text: string;
};

export type TossupResult = {
  buzzIndex: number;
  formattedWords: FormattedWord[];
  isCorrect: boolean;
  score: TossupScore;
  tossup: Tossup;
  userAnswer: string;
};

export enum TossupScore {
  neg = -5,
  incorrect = 0,
  ten = 10,
  power = 15,
}
