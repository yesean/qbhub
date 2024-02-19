import { Question } from '@qbhub/types';
import { useMemo } from 'react';

import { Judge, JudgeResult } from '../../utils/judge';

type UseJudgeType = {
  judgeInput: (userInput: string) => JudgeResult;
};

export default function useJudge(question: Question): UseJudgeType {
  const judge = useMemo(
    () => new Judge(question.formattedAnswer),
    [question.formattedAnswer],
  );

  return useMemo(() => ({ judgeInput: judge.judgeInput.bind(judge) }), [judge]);
}
