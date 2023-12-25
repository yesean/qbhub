import {
  QuestionContent,
  QuestionMetadata,
  QuestionResult,
} from './question.js';

export type Bonus = QuestionMetadata & {
  formattedLeadin: string;
  leadin: string;
  parts: BonusPart[];
};

export type BonusPart = QuestionContent & { number: number };

export type BonusResult = {
  bonus: Bonus;
  parts: BonusPartResult[];
  score: BonusScore;
};

export type BonusPartResult = Omit<
  QuestionResult<BonusPartScore>,
  'question'
> & {
  number: number;
};

export enum BonusScore {
  zero = 0,
  ten = 10,
  twenty = 20,
  thirty = 30,
}

export enum BonusPartScore {
  zero = 0,
  ten = 10,
}
