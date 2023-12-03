import { QuestionResult, Tossup } from '@qbhub/types';
import React, { ReactNode, useMemo, useState } from 'react';
import { ReaderStatus } from '../../utils/questionReader';

export type UnscoredQuestionResult = Omit<QuestionResult, 'score'>;

// TODO: generalize types to Question
type QuestionReaderContextType = {
  getScore: (result: UnscoredQuestionResult) => number;
  onJudged: (result: QuestionResult) => void;
  onNextQuestion: () => void;
  onPrompt: (result: QuestionResult) => void;
  previousResults: QuestionResult[];
  question: Tossup;
  setStatus: React.Dispatch<React.SetStateAction<ReaderStatus>>;
  status: ReaderStatus;
};

export const QuestionReaderContext =
  React.createContext<QuestionReaderContextType>({
    getScore: () => 0,
    onJudged: () => {},
    onNextQuestion: () => {},
    onPrompt: () => {},
    previousResults: [],
    question: {} as Tossup,
    setStatus: () => {},
    status: ReaderStatus.Judged,
  });

export type QuestionReaderContextProviderProps = Omit<
  QuestionReaderContextType,
  'setStatus' | 'status'
> & {
  children: ReactNode;
};

export const QuestionReaderContextProvider = ({
  children,
  ...rest
}: QuestionReaderContextProviderProps) => {
  const [status, setStatus] = useState<ReaderStatus>(
    ReaderStatus.Reading,
  );
  const context = useMemo(
    () => ({
      ...rest,
      setStatus,
      status,
    }),
    [rest, status],
  );

  return (
    <QuestionReaderContext.Provider value={context}>
      {children}
    </QuestionReaderContext.Provider>
  );
};
