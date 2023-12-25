import { Question } from '@qbhub/types';
import { Judge, JudgeResult } from './reader';

// question reader states
export enum QuestionReaderStatus {
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
  prevStatus: QuestionReaderStatus,
  { isPrompted = false }: NextStatusOptions = {},
): QuestionReaderStatus => {
  switch (prevStatus) {
    case QuestionReaderStatus.Reading:
      return QuestionReaderStatus.Answering;
    case QuestionReaderStatus.Answering:
      return isPrompted
        ? QuestionReaderStatus.AnsweringAfterPrompt
        : QuestionReaderStatus.Judged;
    case QuestionReaderStatus.AnsweringAfterPrompt:
      return QuestionReaderStatus.Judged;
    case QuestionReaderStatus.Judged:
      return QuestionReaderStatus.Reading;
  }
};

export type UnscoredQuestionResult = {
  buzzIndex: number;
  isCorrect: boolean;
  question: Question;
  userAnswer: string;
};

// get evaluated question result from user input
export const getQuestionResult = (
  question: Question,
  userAnswer: string,
  buzzIndex: number,
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
  return { ...unscoredQuestionResult };
};

export function getIsAnswering(status: QuestionReaderStatus) {
  return (
    status === QuestionReaderStatus.Answering ||
    status === QuestionReaderStatus.AnsweringAfterPrompt
  );
}
