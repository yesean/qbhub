import { log } from '@qbhub/utils';
import { useCallback, useEffect, useState } from 'react';
import { Judge, JudgeResult, normalizeAnswer } from '../utils/reader';

const useJudge = (
  answer: string,
  {
    onPrompt,
    onSubmit,
  }: {
    onPrompt: () => void;
    onSubmit: (isCorrect: boolean, userAnswer: string) => void;
  },
) => {
  const [judge, setJudge] = useState<Judge>();

  useEffect(() => {
    setJudge(new Judge(answer));
  }, [answer]);

  const submit = useCallback(
    (input: string) => {
      if (judge == null) return;

      // judge the user answer
      const userAnswer = normalizeAnswer(input);
      log.debug(`user answer: ${userAnswer}`);
      const judgeResult = judge.judge(userAnswer);

      // either prompt on answer or mark it as correct/incorrect
      if (judgeResult === JudgeResult.prompt) {
        // prompt on answer
        log.debug(`prompting on: ${userAnswer}`);
        onPrompt();
      } else {
        // submit answer
        const isCorrect = judgeResult === JudgeResult.correct;
        log.debug(
          `user answer (${userAnswer}) is: ${isCorrect ? 'correct' : 'incorrect'
          }.`,
        );
        onSubmit(isCorrect, input);
      }
    },
    [judge, onPrompt, onSubmit],
  );

  return submit;
};

export default useJudge;
