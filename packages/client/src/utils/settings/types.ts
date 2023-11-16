import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';

export type ReadingSpeed = number;

export type FromYear = number;

export type Settings = {
  categories: Category[];
  subcategories: Subcategory[];
  difficulties: Difficulty[];
  tournaments: Tournament[];
  readingSpeed: ReadingSpeed | undefined;
  fromYear: FromYear | undefined;
};
