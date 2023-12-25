import { Box, Flex } from '@chakra-ui/react';
import { Bonus } from '@qbhub/types';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { QuestionReaderStatus } from '../utils/questionReader';

type BonusReaderTextDisplayProps = QuestionContentDisplayProps & {
  bonus: Bonus;
  bonusPartNumber: number;
};

export default function BonusReaderContentDisplay({
  bonus,
  bonusPartNumber,
  buzzIndex,
  status,
  visibleIndex,
  visibleRef,
  words,
}: BonusReaderTextDisplayProps) {
  const shouldShowAnswer = status === QuestionReaderStatus.Judged;
  const bonusPart = bonus.parts[bonusPartNumber];
  return (
    <Flex direction="column" gap={4}>
      {shouldShowAnswer && <div>{bonusPart?.answer}</div>}
      <Box bg="gray.100" borderRadius="md" overflow="auto" p={4}>
        <FormattedQuestion
          buzzIndex={buzzIndex}
          visibleIndex={visibleIndex}
          visibleRef={visibleRef}
          words={words}
        />
      </Box>
    </Flex>
  );
}
