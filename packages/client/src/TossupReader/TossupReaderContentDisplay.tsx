import { Box, Flex } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import { useMemo } from 'react';
import FormattedQuestion from '../components/FormattedQuestion';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import useAutoScrollIntoView from '../hooks/useAutoScrollIntoView';
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
  words,
}: TossupReaderTextDisplayProps) {
  const autoScrollDependencies = useMemo(
    () => [visibleIndex, status],
    [status, visibleIndex],
  );
  const visibleRef = useAutoScrollIntoView<HTMLParagraphElement>(
    autoScrollDependencies,
  );

  const shouldShowAnswer = status === QuestionReaderStatus.Judged;
  return (
    <Flex direction="column" gap={4} overflow="auto">
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
