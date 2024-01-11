import {
  FormattedWord,
  InstanceOf,
  QuestionContent,
  QuestionMetadata,
  QuestionResult,
} from './question.js';

export type Tossup = QuestionContent &
  QuestionMetadata & { normalizedAnswer: string };

export type TossupInstance = InstanceOf<Tossup>;

export type TossupResult = Omit<QuestionResult, 'question'> & {
  formattedWords: FormattedWord[];
  question: Tossup;
  score: TossupScore;
};

export enum TossupScore {
  neg = -5,
  incorrect = 0,
  ten = 10,
  power = 15,
}
