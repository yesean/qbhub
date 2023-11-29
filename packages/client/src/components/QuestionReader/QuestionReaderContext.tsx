import { QuestionResult, Tossup } from '@qbhub/types';
import React, { ReactNode, useMemo, useState } from 'react';
import { QuestionReaderStatus } from '../../utils/questionReader';

export type UnscoredQuestionResult = Omit<QuestionResult, 'score'>;

// TODO: generalize types to Question
type QuestionReaderContextType = {
  getScore: (result: UnscoredQuestionResult) => number;
  onJudged: (result: QuestionResult) => void;
  onNextQuestion: () => void;
  previousResults: QuestionResult[];
  question: Tossup;
  setStatus: React.Dispatch<React.SetStateAction<QuestionReaderStatus>>;
  status: QuestionReaderStatus;
};

export const QuestionReaderContext =
  React.createContext<QuestionReaderContextType>({
    getScore: () => 0,
    onJudged: () => {},
    onNextQuestion: () => {},
    previousResults: [],
    question: {} as Tossup,
    setStatus: () => {},
    status: QuestionReaderStatus.Judged,
  });

export type QuestionReaderContextProviderProps = Omit<
  QuestionReaderContextType,
  'setStatus' | 'status'
> & {
  children: ReactNode;
};

export const QuestionReaderContextProvider = ({
  children,
  getScore,
  onJudged,
  onNextQuestion,
  previousResults,
  question,
}: QuestionReaderContextProviderProps) => {
  const [status, setStatus] = useState<QuestionReaderStatus>(
    QuestionReaderStatus.Reading,
  );
  const context = useMemo(
    () => ({
      getScore,
      onJudged,
      onNextQuestion,
      previousResults,
      question,
      setStatus,
      status,
    }),
    [getScore, onJudged, onNextQuestion, previousResults, question, status],
  );

  return (
    <QuestionReaderContext.Provider value={context}>
      {children}
    </QuestionReaderContext.Provider>
  );
};
