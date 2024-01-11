import {
  InstanceOf,
  QuestionContent,
  QuestionMetadata,
  QuestionResultContent,
  QuestionResultMetadata,
} from './question.js';

export type Bonus = QuestionMetadata & {
  formattedLeadin: string;
  leadin: string;
  parts: BonusPart[];
};

export type BonusInstance = InstanceOf<Bonus>;

export type BonusPart = QuestionContent & { number: number };

export type BonusResult = Omit<QuestionResultMetadata, 'question'> & {
  parts: BonusPartResult[];
  question: Bonus;
  score: BonusScore;
};

export type BonusPartResult = QuestionResultContent & {
  bonusPart: BonusPart;
  number: number;
  score: BonusPartScore;
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
