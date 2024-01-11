import { useToast } from '@chakra-ui/react';
import {
  Bonus,
  BonusInstance,
  BonusPart,
  BonusPartResult,
  BonusPartScore,
  BonusResult,
  BonusScore,
  FormattedWord,
  QuestionResult,
  ScoredQuestionResult,
} from '@qbhub/types';

export function getBonusPartResult(
  result: QuestionResult,
  number: number,
  bonusPart: BonusPart,
): BonusPartResult {
  return {
    ...result,
    bonusPart,
    number,
    score: result.isCorrect ? BonusPartScore.ten : BonusPartScore.zero,
  };
}

export function getBonusResult(
  results: BonusPartResult[],
  bonusInstance: BonusInstance,
): BonusResult {
  const score = (() => {
    const correctPartsCount = results.filter(
      ({ isCorrect }) => isCorrect,
    ).length;
    switch (correctPartsCount) {
      case 3:
        return BonusScore.thirty;
      case 2:
        return BonusScore.twenty;
      case 1:
        return BonusScore.ten;
      default:
        return BonusScore.zero;
    }
  })();

  return {
    instanceID: bonusInstance.instanceID,
    parts: results,
    question: bonusInstance,
    score,
  };
}

const BONUS_LEADIN_DELIMITER = '|:|';

/**
 * Combine leadin and part one text with a special delimiter, for the first bonus part
 */
export function combineBonusPartWithLeadin(bonusPart: BonusPart, bonus: Bonus) {
  return [
    bonus.formattedLeadin,
    BONUS_LEADIN_DELIMITER,
    bonusPart.formattedText,
  ].join(' ');
}

export function getBonusLeadinDelimiterIndex(words: FormattedWord[]) {
  const leadinDelimiterIndex = words.findIndex(
    ({ value }) => value === BONUS_LEADIN_DELIMITER,
  );
  return leadinDelimiterIndex === -1 ? undefined : leadinDelimiterIndex;
}

export function isLastBonusPart(bonusPartNumber: number, bonus: Bonus) {
  return bonusPartNumber === bonus.parts.length - 1;
}

type ToastTrigger =
  | {
      result: BonusPartResult;
      type: 'judgedBonusPart';
    }
  | {
      result: BonusResult;
      type: 'judgedBonus';
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
    case 'judgedBonus': {
      switch (trigger.result.score) {
        case BonusScore.thirty:
          return toast({
            status: 'success',
            title: 'All thirty!',
          });
        case BonusScore.twenty:
          return toast({
            status: 'success',
            title: 'Twenty!',
          });
        case BonusScore.ten:
          return toast({
            status: 'success',
            title: 'Ten',
          });
        case BonusScore.zero:
          return toast({
            status: 'error',
            title: 'Zero',
          });
      }
    }
    // the above case has an exhaustive switch which always returns, so the
    // above case will never fall through, eslint is being dumb here
    // eslint-disable-next-line no-fallthrough
    case 'judgedBonusPart': {
      return toast({
        status: trigger.result.isCorrect ? 'success' : 'error',
        title: trigger.result.isCorrect ? 'Correct' : 'Incorrect',
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

type BonusResultsSummary = {
  score: number;
  scoreCounts: Record<BonusScore, number>;
};
const INITIAL_BONUS_RESULTS_SUMMARY = {
  score: 0,
  scoreCounts: {
    [BonusScore.thirty]: 0,
    [BonusScore.twenty]: 0,
    [BonusScore.ten]: 0,
    [BonusScore.zero]: 0,
  },
};

export function getBonusResultsSummary(
  results: BonusResult[],
): BonusResultsSummary {
  return results.reduce(
    ({ score, scoreCounts }, result) => ({
      score: score + result.score,
      scoreCounts: {
        ...scoreCounts,
        [result.score]: scoreCounts[result.score] + 1,
      },
    }),
    INITIAL_BONUS_RESULTS_SUMMARY,
  );
}

export function getBonusPartResultWithMetadata(
  bonusPartResult: BonusPartResult,
  bonusResult: BonusResult,
): ScoredQuestionResult {
  return {
    ...bonusPartResult,
    ...bonusResult,
    question: {
      ...bonusPartResult.bonusPart,
      ...bonusResult.question,
    },
  };
}
