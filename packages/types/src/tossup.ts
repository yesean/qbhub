import {
  FormattedWord,
  QuestionContent,
  QuestionMetadata,
  QuestionResult,
} from './question.js';

export type Tossup = QuestionContent &
  QuestionMetadata & { normalizedAnswer: string };

export type TossupResult = Omit<QuestionResult<TossupScore>, 'question'> & {
  formattedWords: FormattedWord[];
  tossup: Tossup;
};

export enum TossupScore {
  neg = -5,
  incorrect = 0,
  ten = 10,
  power = 15,
}
