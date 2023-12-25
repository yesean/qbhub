import { Box, Flex } from '@chakra-ui/react';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { QuestionReaderStatus } from '../utils/questionReader';
import TossupReaderAnswerDisplay from './TossupReaderAnswerDisplay';

type TossupReaderTextDisplayProps = QuestionContentDisplayProps;

export default function TossupReaderContentDisplay({
  buzzIndex,
  question,
  status,
  visibleIndex,
  visibleRef,
  words,
}: TossupReaderTextDisplayProps) {
  const shouldShowAnswer = status === QuestionReaderStatus.Judged;
  return (
    <Flex direction="column" gap={4}>
      {shouldShowAnswer && <TossupReaderAnswerDisplay question={question} />}
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
