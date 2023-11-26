import { Tossup } from '@qbhub/types';
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
  status: QuestionReaderStatus;
  setStatus: React.Dispatch<React.SetStateAction<QuestionReaderStatus>>;
  question: Tossup;
};

const QuestionReaderContext = React.createContext<QuestionReaderContextType>({
  status: QuestionReaderStatus.Judged,
  setStatus: () => {},
  question: {} as Tossup,
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

  const context = useMemo(
    () => ({
      status,
      setStatus,
      question,
    }),
    [question, status],
  );

  return (
    <QuestionReaderContext.Provider value={context}>
      {children}
    </QuestionReaderContext.Provider>
  );
};
