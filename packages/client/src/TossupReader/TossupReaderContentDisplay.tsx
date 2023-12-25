import { Box, Flex } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import FormattedQuestion from '../components/FormattedQuestion';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import { QuestionReaderStatus } from '../utils/questionReader';
import TossupReaderAnswerDisplay from './TossupReaderAnswerDisplay';

type TossupReaderTextDisplayProps = QuestionContentDisplayProps & {
  tossup: Tossup;
};

export default function TossupReaderContentDisplay({
  buzzIndex,
  status,
  tossup,
  visibleIndex,
  visibleRef,
  words,
}: TossupReaderTextDisplayProps) {
  const shouldShowAnswer = status === QuestionReaderStatus.Judged;
  return (
    <Flex direction="column" gap={4}>
      {shouldShowAnswer && <TossupReaderAnswerDisplay tossup={tossup} />}
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
