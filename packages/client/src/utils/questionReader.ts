import { Question, QuestionResult } from '@qbhub/types';
import { Judge, JudgeResult } from './reader';

// question reader states
export enum ReaderStatus {
  Reading,
  Answering,
  AnsweringAfterPrompt,
  Judged,
}

type NextStatusOptions = {
  isPrompted?: boolean;
};

// question reader state machine
export const getNextStatus = (
  prevStatus: ReaderStatus,
  { isPrompted = false }: NextStatusOptions = {},
): ReaderStatus => {
  switch (prevStatus) {
    case ReaderStatus.Reading:
      return ReaderStatus.Answering;
    case ReaderStatus.Answering:
      return isPrompted
        ? ReaderStatus.AnsweringAfterPrompt
        : ReaderStatus.Judged;
    case ReaderStatus.AnsweringAfterPrompt:
      return ReaderStatus.Judged;
    case ReaderStatus.Judged:
      return ReaderStatus.Reading;
  }
};

export type UnscoredQuestionResult = Omit<QuestionResult, 'score'>;

// get evaluated question result from user input
export const getQuestionResult = (
  question: Question,
  userAnswer: string,
  buzzIndex: number,
  getScore: (result: UnscoredQuestionResult) => number,
) => {
  const judge = new Judge(question.formattedAnswer);
  const judgeResult = judge.judge(userAnswer);
  const isCorrect = judgeResult === JudgeResult.correct;
  const unscoredQuestionResult = {
    buzzIndex,
    isCorrect,
    judgeResult,
    question,
    userAnswer,
  };
  const score = getScore(unscoredQuestionResult);
  return { ...unscoredQuestionResult, score };
};
