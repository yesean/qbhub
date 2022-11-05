import { useCallback, useEffect, useState } from 'react';
import { JudgeResult } from '../types/tossups';
import logger from '../utils/logger';
import { Judge, normalizeAnswer } from '../utils/reader';

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
      logger.info(`User submitted "${userAnswer}".`);
      const judgeResult = judge.judge(userAnswer);

      // either prompt on answer or mark it as correct/incorrect
      if (judgeResult === JudgeResult.prompt) {
        // prompt on answer
        logger.info(`Prompting on "${userAnswer}".`);
        onPrompt();
      } else {
        // submit answer
        const isCorrect = judgeResult === JudgeResult.correct;
        logger.info(
          `User answer "${userAnswer}" is ${
            isCorrect ? 'correct' : 'incorrect'
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
