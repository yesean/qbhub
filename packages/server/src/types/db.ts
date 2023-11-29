import { Tournament } from '@qbhub/types';

export type Parameter = number | string;

export type Column = {
  name: string;
  alias?: string;
};

export type Order = {
  direction: 'asc' | 'desc';
  name: string;
}[];

export type QuestionFilterOptions = {
  ignoreEmptyNormalizedAnswer?: boolean;
  useExactAnswer?: boolean;
  useNormalizedAnswer?: boolean;
};

export type Tossup = {
  answer: string;
  category: number;
  difficulty: number;
  formatted_answer: string;
  formatted_text: string;
  id: number;
  normalized_answer: string;
  subcategory: number | null;
  text: string;
  tournament: number;
  year: number;
};

export type Bonus = {
  category: number;
  difficulty: number;
  formatted_leadin: string;
  id: number;
  leadin: string;
  subcategory: number | null;
  tournament: number;
  year: number;
};

export type BonusPart = {
  answer: string;
  bonus_id: number;
  formatted_answer: string;
  formatted_text: string;
  number: number;
  text: string;
};

// stripped down version of `Tossup` used for clues processing
export type PlainTossup = {
  answer: string;
  text: string; // uses normalized_answer
  tournament: Tournament;
};
