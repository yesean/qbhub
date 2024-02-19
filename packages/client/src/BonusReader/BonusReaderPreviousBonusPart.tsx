import { Bonus, BonusPartResult } from '@qbhub/types';
import { useMemo } from 'react';

import { combineBonusPartWithLeadin } from '../utils/bonus';
import { getFormattedWords } from '../utils/reader';
import BonusReaderAnswer from './BonusReaderAnswer';
import BonusReaderTextSection from './BonusReaderTextSection';

type BonusReaderPreviousBonusPartProps = {
  bonus: Bonus;
  bonusPartResult: BonusPartResult;
};

export default function BonusReaderPreviousBonusPart({
  bonus,
  bonusPartResult,
}: BonusReaderPreviousBonusPartProps) {
  const formattedWords = useMemo(() => {
    if (bonusPartResult.bonusPart === undefined) {
      return undefined;
    }

    const formattedText =
      bonusPartResult.number === 0
        ? combineBonusPartWithLeadin(bonusPartResult.bonusPart, bonus)
        : bonusPartResult.bonusPart.formattedText;

    return getFormattedWords(formattedText);
  }, [bonus, bonusPartResult.bonusPart, bonusPartResult.number]);

  if (bonusPartResult.bonusPart === undefined || formattedWords === undefined) {
    return null;
  }

  return (
    <>
      <BonusReaderTextSection
        buzzIndex={bonusPartResult.buzzIndex}
        words={formattedWords}
      />
      <BonusReaderAnswer bonusPartResult={bonusPartResult} />
    </>
  );
}
