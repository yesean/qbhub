import { Tournament } from '@qbhub/types';

export type Parameter = string | number;

export type Column = {
  name: string;
  alias?: string;
};

export type Order = {
  name: string;
  direction: 'asc' | 'desc';
}[];

export type QuestionFilterOptions = {
  ignoreEmptyNormalizedAnswer?: boolean;
  useNormalizedAnswer?: boolean;
  useExactAnswer?: boolean;
};

export type Tossup = {
  id: number;
  text: string;
  answer: string;
  formatted_text: string;
  formatted_answer: string;
  normalized_answer: string;
  category: number;
  subcategory: number | null;
  difficulty: number;
  tournament: number;
  year: number;
};

export type Bonus = {
  id: number;
  leadin: string;
  formatted_leadin: string;
  category: number;
  subcategory: number | null;
  difficulty: number;
  tournament: number;
  year: number;
};

export type BonusPart = {
  bonus_id: number;
  text: string;
  answer: string;
  formatted_text: string;
  formatted_answer: string;
  number: number;
};

// stripped down version of `Tossup` used for clues processing
export type PlainTossup = {
  text: string;
  answer: string; // uses normalized_answer
  tournament: Tournament;
};
