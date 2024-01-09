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

export type QuestionResult = {
  buzzIndex: number;
  isCorrect: boolean;
  question: Question;
  userAnswer: string;
};

export type ScoredQuestionResult = QuestionResult & { score: number };

export type FormattedWord = {
  isBold: boolean;
  value: string;
};
