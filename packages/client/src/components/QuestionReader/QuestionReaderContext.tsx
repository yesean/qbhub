import { Tossup, TossupResult } from '@qbhub/types';
import React, { ReactNode, useContext, useMemo, useState } from 'react';

export enum QuestionReaderStatus {
  Reading,
  Answering,
  AnsweringAfterPrompt,
  Judged,
}

type NextStatusOptions = {
  isPrompted?: boolean;
};

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

type QuestionReaderContextType = {
  question: Tossup;
  previousResults: TossupResult[];
  status: QuestionReaderStatus;
  setStatus: React.Dispatch<React.SetStateAction<QuestionReaderStatus>>;
  onNextQuestion: () => void;
  onJudged: (result: TossupResult) => void;
};

const QuestionReaderContext = React.createContext<QuestionReaderContextType>({
  question: {} as Tossup,
  previousResults: [],
  status: QuestionReaderStatus.Judged,
  setStatus: () => {},
  onNextQuestion: () => {},
  onJudged: () => {},
});

export const useQuestionReaderContext = () => useContext(QuestionReaderContext);

type QuestionReaderContextProviderProps = {
  children: ReactNode;
  question: Tossup;
  previousResults: TossupResult[];
  onNextQuestion: () => void;
  onJudged: (result: TossupResult) => void;
};

export const QuestionReaderContextProvider = ({
  children,
  question,
  previousResults,
  onNextQuestion,
  onJudged,
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
    }),
    [onJudged, onNextQuestion, previousResults, question, status],
  );

  return (
    <QuestionReaderContext.Provider value={context}>
      {children}
    </QuestionReaderContext.Provider>
  );
};
