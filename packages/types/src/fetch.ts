import { Category } from './category.js';
import { Difficulty } from './difficulty.js';
import { Subcategory } from './subcategory.js';
import { Tournament } from './tournament.js';

export enum SortOption {
  earliest = 'earliest',
  latest = 'latest',
  random = 'random',
}

export type QuestionFilters = {
  answer: string;
  categories: Category[];
  difficulties: Difficulty[];
  from: number;
  limit: number;
  offset: number;
  sort: SortOption;
  subcategories: Subcategory[];
  text: string;
  tournaments: Tournament[];
  until: number;
};
