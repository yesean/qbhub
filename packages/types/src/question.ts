import { Category } from './category.js';
import { Difficulty } from './difficulty.js';
import { Subcategory } from './subcategory.js';
import { Tournament } from './tournament.js';

export type QuestionMetadata = {
  category: Category;
  difficulty: Difficulty;
  id: number;
  tournament: Tournament;
  year: number;
  subcategory?: Subcategory;
};

export type QuestionContent = {
  answer: string;
  formattedAnswer: string;
  formattedText: string;
  text: string;
};

export type Question = QuestionContent & QuestionMetadata;

export type QuestionResult<T> = {
  buzzIndex: number;
  isCorrect: boolean;
  question: Question;
  score: T;
  userAnswer: string;
};

// question parameters in Select dropdowns in settings
export type SelectableQuestionParameter =
  | Category
  | Difficulty
  | Subcategory
  | Tournament;

export type QuestionContentParameters = {
  answer: string;
  categories: Category[];
  difficulties: Difficulty[];
  subcategories: Subcategory[];
  text: string;
  tournaments: Tournament[];
};

export type QuestionQueryParameters = {
  from: number;
  limit: number;
  offset: number;
  sort: SortOption;
  until: number;
};

export enum SortOption {
  earliest = 'earliest',
  latest = 'latest',
  random = 'random',
}

export type QuestionParameters = QuestionContentParameters &
  QuestionQueryParameters;

export type FormattedWord = {
  isBold: boolean;
  value: string;
};
