import { Category } from './category.js';
import { Difficulty } from './difficulty.js';
import { Subcategory } from './subcategory.js';
import { Tournament } from './tournament.js';

export type InstanceOf<T> = T & { instanceID: string };

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

export type QuestionInstance = InstanceOf<Question>;

export type QuestionResultMetadata = {
  instanceID: string;
  question: Question;
};

export type QuestionResultContent = {
  buzzIndex: number;
  isCorrect: boolean;
  userAnswer: string;
};

export type QuestionResult = QuestionResultContent & QuestionResultMetadata;

export type ScoredQuestionResult = QuestionResult & { score: number };

export type FormattedWord = {
  isBold: boolean;
  value: string;
};
