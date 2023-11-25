import { Bonus, Tossup } from '@qbhub/types';
import React, { ReactNode, useContext, useMemo, useState } from 'react';

enum QuestionReaderStatus {
  Reading,
  Answering,
  Judged,
}

type QuestionReaderContextType = {
  status: QuestionReaderStatus;
  question: Tossup | Bonus | null;
};

const QuestionReaderContext = React.createContext<QuestionReaderContextType>({
  status: QuestionReaderStatus.Judged,
  question: null,
});

export const useQuestionReaderContext = () => useContext(QuestionReaderContext);

type QuestionReaderContextProviderProps = {
  children: ReactNode;
  question: Tossup | Bonus | null;
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
