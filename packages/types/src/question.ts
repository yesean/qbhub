import { Category } from './category.js';
import { Difficulty } from './difficulty.js';
import { Subcategory } from './subcategory.js';
import { Tournament } from './tournament.js';

export type Question = {
  category: Category;
  subcategory?: Subcategory;
  difficulty: Difficulty;
  tournament: Tournament;
  year: number;
};

// question parameters in Select dropdowns in settings
export type SelectableQuestionParameter =
  | Category
  | Subcategory
  | Difficulty
  | Tournament;

export type QuestionContentParameters = {
  categories: Category[];
  subcategories: Subcategory[];
  difficulties: Difficulty[];
  tournaments: Tournament[];
  text: string;
  answer: string;
};

export type QuestionQueryParameters = {
  sort: SortOption;
  from: number;
  until: number;
  offset: number;
  limit: number;
};

export enum SortOption {
  random = 'random',
  latest = 'latest',
  earliest = 'earliest',
}

export type QuestionParameters = QuestionContentParameters &
  QuestionQueryParameters;
