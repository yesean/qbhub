import { Category, Subcategory, Difficulty } from './questions';

export type Tossup = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  normalizedAnswer: string;
  category: Category;
  subcategory: Subcategory | null;
  difficulty: Difficulty;
  tournament: string;
  year: number;
};

export type BonusParts = [BonusPart, BonusPart, BonusPart];

// bonuses are not on the main metadata object and are nested instead similar to
// its database structure
export type Bonus = {
  id: number;
  leadin: string;
  formattedLeadin: string;
  category: Category;
  subcategory: Subcategory | null;
  difficulty: Difficulty;
  tournament: string;
  year: number;
  parts: BonusParts;
};
export type BonusPart = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  number: number;
};

export type Freq = {
  answer: string;
  frequency: number;
};

// represents a tossup clue, generally a short clause or phrase
export type Clue = {
  clue: string; // phrase
  sentence: string; // the sentence it came from
  tournament: string;
  score: number;
};

// question specific parameters
export type QuestionParameters = {
  categories: Category[];
  subcategories: Subcategory[];
  difficulties: Difficulty[];
  text: string;
  answer: string;
};

export enum SortOption {
  random = 'random',
  latest = 'latest',
  earliest = 'earliest',
}

// sql query specific parameters
export type QueryParameters = {
  sort: SortOption;
  from: number;
  until: number;
  offset: number;
  limit: number;
};

export type QuestionFilters = QuestionParameters & QueryParameters;
