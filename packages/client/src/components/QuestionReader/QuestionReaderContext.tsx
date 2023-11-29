import { Tossup } from '@qbhub/types';
import React, { ReactNode, useMemo, useState } from 'react';
import { QuestionReaderStatus } from '../../utils/questionReader';
import { JudgeResult } from '../../utils/reader';

export type QuestionResult = {
  question: Tossup;
  judgeResult: JudgeResult;
  userAnswer: string;
  buzzIndex: number;
  score: number;
};

export type UnscoredQuestionResult = Omit<QuestionResult, 'score'>;

// TODO: generalize types to Question
type QuestionReaderContextType = {
  status: QuestionReaderStatus;
  setStatus: React.Dispatch<React.SetStateAction<QuestionReaderStatus>>;
  question: Tossup;
  previousResults: QuestionResult[];
  onNextQuestion: () => void;
  onJudged: (result: QuestionResult) => void;
  getScore: (result: UnscoredQuestionResult) => number;
};

export const QuestionReaderContext =
  React.createContext<QuestionReaderContextType>({
    question: {} as Tossup,
    previousResults: [],
    status: QuestionReaderStatus.Judged,
    setStatus: () => {},
    onNextQuestion: () => {},
    onJudged: () => {},
    getScore: () => 0,
  });

export type QuestionReaderContextProviderProps = Omit<
  QuestionReaderContextType,
  'status' | 'setStatus'
> & {
  children: ReactNode;
};

export const QuestionReaderContextProvider = ({
  children,
  question,
  previousResults,
  onNextQuestion,
  onJudged,
  getScore,
}: QuestionReaderContextProviderProps) => {
  const [status, setStatus] = useState<QuestionReaderStatus>(
    QuestionReaderStatus.Reading,
  );
  const context = useMemo(
    () => ({
      status,
      setStatus,
      question,
      previousResults,
      onNextQuestion,
      onJudged,
      getScore,
    }),
    [getScore, onJudged, onNextQuestion, previousResults, question, status],
  );

  return (
    <QuestionReaderContext.Provider value={context}>
      {children}
    </QuestionReaderContext.Provider>
  );
};
