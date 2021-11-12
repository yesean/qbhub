import { Category, Subcategory, Difficulty } from './questions';

export type Tossup = {
  text: string;
  answer: string;
  formattedText: string;
  formattedAnswer: string;
  category: Category;
  subcategory: Subcategory;
  difficulty: Difficulty;
  tournament: string;
};

export enum TossupScore {
  neg = -5,
  ten = 10,
  power = 15,
}

export type TossupBuzz = {
  isInPower: boolean;
  readText: string;
  index: number;
  textWithBuzz: JSX.Element[];
};

export type TossupResult = {
  isCorrect: boolean;
  submittedAnswer: string;
  score: TossupScore;
  buzz: TossupBuzz;
};
