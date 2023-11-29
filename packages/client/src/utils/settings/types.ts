import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';

export type ReadingSpeed = number;

export type FromYear = number;

export type Settings = {
  categories: Category[];
  difficulties: Difficulty[];
  subcategories: Subcategory[];
  tournaments: Tournament[];
  fromYear?: FromYear;
  readingSpeed?: ReadingSpeed;
};

// do not store readings speed in the URL
export type URLQueryParamSettings = Omit<Settings, 'readingSpeed'>;
