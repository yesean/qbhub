import { Bonus, Tossup } from '@qbhub/types';
import React, { ReactNode, useContext, useMemo, useState } from 'react';

enum QuestionReaderStatus {
  Reading,
  Answering,
  Judged,
}

type QuestionReaderContextType = {
  status: QuestionReaderStatus;
  question: Tossup | Bonus;
};

const QuestionReaderContext = React.createContext<QuestionReaderContextType>({
  status: QuestionReaderStatus.Judged,
  question: {} as Tossup,
});

export const useQuestionReaderContext = () => useContext(QuestionReaderContext);

type QuestionReaderContextProviderProps = {
  children: ReactNode;
  question: Tossup | Bonus;
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
