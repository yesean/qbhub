import { Tossup, TossupResult } from '@qbhub/types';
import React, { ReactNode, useContext, useMemo, useState } from 'react';

export enum QuestionReaderStatus {
  Reading,
  Answering,
  Judged,
}

export const getNextStatus = (
  prevStatus: QuestionReaderStatus,
): QuestionReaderStatus => {
  switch (prevStatus) {
    case QuestionReaderStatus.Reading:
      return QuestionReaderStatus.Answering;
    case QuestionReaderStatus.Answering:
      return QuestionReaderStatus.Judged;
    case QuestionReaderStatus.Judged:
      return QuestionReaderStatus.Reading;
  }
};

type QuestionReaderContextType = {
  question: Tossup;
  status: QuestionReaderStatus;
  setStatus: React.Dispatch<React.SetStateAction<QuestionReaderStatus>>;
  questionResult: TossupResult | null;
  setQuestionResult: React.Dispatch<React.SetStateAction<TossupResult | null>>;
};

const QuestionReaderContext = React.createContext<QuestionReaderContextType>({
  question: {} as Tossup,
  status: QuestionReaderStatus.Judged,
  setStatus: () => {},
  questionResult: {} as TossupResult,
  setQuestionResult: () => {},
});

export const useQuestionReaderContext = () => useContext(QuestionReaderContext);

type QuestionReaderContextProviderProps = {
  children: ReactNode;
  question: Tossup;
};

export const QuestionReaderContextProvider = ({
  children,
  question,
}: QuestionReaderContextProviderProps) => {
  const [status, setStatus] = useState<QuestionReaderStatus>(
    QuestionReaderStatus.Reading,
  );
  const [questionResult, setQuestionResult] = useState<TossupResult | null>(
    null,
  );

  const context = useMemo(
    () => ({
      status,
      setStatus,
      question,
      questionResult,
      setQuestionResult,
    }),
    [question, questionResult, status],
  );

  return (
    <QuestionReaderContext.Provider value={context}>
      {children}
    </QuestionReaderContext.Provider>
  );
};
