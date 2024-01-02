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
    formattedWords: getFormattedWords(result.question.formattedText),
    score: getTossupResultScore(result),
    tossup: { ...result.question, normalizedAnswer },
    ...result,
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
