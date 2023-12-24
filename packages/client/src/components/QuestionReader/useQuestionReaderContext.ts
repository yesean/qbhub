import { useContext, useMemo } from 'react';
import { QuestionReaderStatus } from '../../utils/questionReader';
import { QuestionReaderContext } from './QuestionReaderContext';

export default function useQuestionReaderContext() {
  const context = useContext(QuestionReaderContext);

  const score = context.previousResults.reduce(
    (acc, result) => acc + result.score,
    0,
  );

  const isAnswering = [
    QuestionReaderStatus.Answering,
    QuestionReaderStatus.AnsweringAfterPrompt,
  ].includes(context.status);

  const latestResult = context.previousResults.at(-1);

  return useMemo(
    () => ({
      isAnswering,
      latestResult,
      score,
      ...context,
    }),
    [context, isAnswering, latestResult, score],
  );
}
