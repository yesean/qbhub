import { Question } from './question.js';

export type Bonus = Question & {
  formattedLeadin: string;
  leadin: string;
  parts: BonusPart[];
};

export type BonusPart = {
  answer: string;
  formattedAnswer: string;
  formattedText: string;
  number: number;
  text: string;
};

export type BonusResult = {
  bonus: Bonus;
  parts: BonusPartResult[];
  score: BonusScore;
};

export type BonusPartResult = {
  buzzIndex: number;
  isCorrect: boolean;
  number: number;
  userAnswer: string;
};

export enum BonusScore {
  zero = 0,
  ten = 10,
  twenty = 20,
  thirty = 30,
}
