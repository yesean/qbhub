import { Category } from './category';
import { Difficulty } from './difficulty';
import { Subcategory } from './subcategory';
import { Tournament } from './tournament';

export type Tossup = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  normalizedAnswer: string;
  category: Category;
  subcategory: Subcategory;
  difficulty: Difficulty;
  tournament: Tournament;
  year: number;
};

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
