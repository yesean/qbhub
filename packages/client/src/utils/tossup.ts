import { useToast } from '@chakra-ui/react';
import { QuestionResult, TossupResult, TossupScore } from '@qbhub/types';

import { getFormattedWords, getPowerIndex } from './reader';

function getTossupResultScore({
  buzzIndex,
  isCorrect,
  question,
}: QuestionResult): TossupScore {
  const tossupWords = getFormattedWords(question.formattedText);
  const isInPower = buzzIndex <= getPowerIndex(tossupWords);
  const isBuzzAtEnd = buzzIndex === tossupWords.length - 1;

  if (isCorrect) {
    return isInPower ? TossupScore.power : TossupScore.ten;
  }
  return isBuzzAtEnd ? TossupScore.incorrect : TossupScore.neg;
}

export function getTossupResult(
  result: QuestionResult,
  normalizedAnswer: string,
): TossupResult {
  return {
    ...result,
    formattedWords: getFormattedWords(result.question.formattedText),
    question: { ...result.question, normalizedAnswer },
    score: getTossupResultScore(result),
  };
}

export function updateTossupResult(
  result: TossupResult,
  isCorrect: boolean,
): TossupResult {
  const newScore = getTossupResultScore({ ...result, isCorrect });
  return {
    ...result,
    isCorrect,
    score: newScore,
  };
}

type ToastTrigger =
  | {
      result: TossupResult;
      type: 'judged';
    }
  | {
      type: 'prompt';
    };

export function displayToast(
  toast: ReturnType<typeof useToast>,
  trigger: ToastTrigger,
) {
  toast.closeAll();

  switch (trigger.type) {
    case 'judged': {
      if (!trigger.result.isCorrect) {
        return toast({
          status: 'error',
          title: 'Incorrect',
        });
      }

      return toast({
        status: 'success',
        title: trigger.result.score === TossupScore.power ? 'Power!' : 'Ten!',
      });
    }
    case 'prompt': {
      return toast({
        status: 'info',
        title: 'Prompt',
      });
    }
  }
}

type TossupResultsSummary = {
  score: number;
  scoreCounts: Record<TossupScore, number>;
};
const INITIAL_TOSSUP_RESULTS_SUMMARY = {
  score: 0,
  scoreCounts: {
    [TossupScore.power]: 0,
    [TossupScore.ten]: 0,
    [TossupScore.incorrect]: 0,
    [TossupScore.neg]: 0,
  },
};

export function getTossupResultsSummary(
  results: TossupResult[],
): TossupResultsSummary {
  return results.reduce(
    ({ score, scoreCounts }, result) => ({
      score: score + result.score,
      scoreCounts: {
        ...scoreCounts,
        [result.score]: scoreCounts[result.score] + 1,
      },
    }),
    INITIAL_TOSSUP_RESULTS_SUMMARY,
  );
}
