import { Box, Divider } from '@chakra-ui/react';
import { Bonus, BonusPartResult } from '@qbhub/types';
import { useMemo } from 'react';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { getFormattedWords } from '../utils/reader';
import BonusReaderAnswer from './BonusReaderAnswer';

type BonusReaderPreviousBonusPartProps = {
  bonus: Bonus;
  bonusPartResult: BonusPartResult;
};

export default function BonusReaderPreviousBonusPart(
  props: BonusReaderPreviousBonusPartProps,
) {
  const { bonus, bonusPartResult } = props;
  const { bonusPart } = bonusPartResult;

  const formattedWords = useMemo(() => {
    if (bonusPart === undefined) {
      return undefined;
    }

    const formattedText =
      bonusPartResult.number === 0
        ? `${bonus.formattedLeadin} ${bonusPart.formattedText}`
        : bonusPart.formattedText;

    return getFormattedWords(formattedText);
  }, [bonus.formattedLeadin, bonusPart, bonusPartResult.number]);

  if (bonusPart === undefined || formattedWords === undefined) {
    return null;
  }

  return (
    <>
      <Box>
        <FormattedQuestion
          buzzIndex={bonusPartResult.buzzIndex}
          words={formattedWords}
        />
      </Box>
      <BonusReaderAnswer bonusPartResult={bonusPartResult} />
      <Divider borderColor="gray.300" />
    </>
  );
}
