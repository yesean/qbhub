import { Box, Text } from '@chakra-ui/react';
import { BonusPartResult } from '@qbhub/types';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { QuestionReaderStatus } from '../utils/questionReader';
import BonusReaderAnswer from './BonusReaderAnswer';

type BonusReaderCurrentBonusPartProps = Omit<
  QuestionContentDisplayProps,
  'question'
> & {
  bonusPartResult: BonusPartResult | undefined;
};

export default function BonusReaderCurrentBonusPart({
  bonusPartResult,
  buzzIndex,
  status,
  visibleIndex,
  visibleRef,
  words,
}: BonusReaderCurrentBonusPartProps) {
  const shouldShowAnswer = status === QuestionReaderStatus.Judged;

  return (
    <>
      <Box>
        <Text as="b">[10]</Text>{' '}
        <FormattedQuestion
          buzzIndex={buzzIndex}
          visibleIndex={visibleIndex}
          visibleRef={visibleRef}
          words={words}
        />
      </Box>
      {shouldShowAnswer && bonusPartResult !== undefined && (
        <BonusReaderAnswer bonusPartResult={bonusPartResult} />
      )}
    </>
  );
}
