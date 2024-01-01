import {
  Bonus,
  BonusPart,
  BonusPartResult,
  BonusPartScore,
  BonusResult,
  BonusScore,
  FormattedWord,
  QuestionResult,
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
  bonus: Bonus,
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
    bonus,
    parts: results,
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
