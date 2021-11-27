import { Category, Subcategory, Difficulty } from './questions';

export type Tossup = {
  text: string;
  formattedText: string;
  answer: string;
  formattedAnswer: string;
  normalizedAnswer: string;
  category: Category;
  subcategory: Subcategory | null;
  difficulty: Difficulty;
  tournament: string;
  year: number;
};

// bonuses are not on the main metadata object and are nested instead similar to
// its database structure
export type Bonus = {
  category: Category;
  subcategory: Subcategory | null;
  difficulty: Difficulty;
  leadin: string;
  parts: [BonusPart, BonusPart, BonusPart];
};
export type BonusPart = {
  text: string;
  formattedText: string;
  answer: string;
  formattedAnswer: string;
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

// sql query specific parameters
export type QueryParameters = {
  offset: number;
  limit: number;
};

export type QuestionFilters = QuestionParameters & QueryParameters;
