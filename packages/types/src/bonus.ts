import { Category } from './category';
import { Difficulty } from './difficulty';
import { Subcategory } from './subcategory';
import { Tournament } from './tournament';

export type BonusPart = {
  number: number;
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
};

export type BonusPartResult = {
  number: number;
  userAnswer: string;
  isCorrect: boolean;
  buzzIndex: number;
};

export enum BonusScore {
  zero = 0,
  ten = 10,
  twenty = 20,
  thirty = 30,
}

export type Bonus = {
  leadin: string;
  formattedLeadin: string;
  category: Category;
  subcategory: Subcategory;
  difficulty: Difficulty;
  tournament: Tournament;
  year: number;
  parts: BonusPart[];
};

export type BonusResult = {
  score: BonusScore;
  parts: BonusPartResult[];
  bonus: Bonus;
};
