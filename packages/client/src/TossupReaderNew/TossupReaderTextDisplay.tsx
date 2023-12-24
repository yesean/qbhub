import { Box } from '@chakra-ui/react';
import { QuestionTextDisplayProps } from '../components/QuestionReader';
import FormattedQuestion from '../components/reader/FormattedQuestion';

type TossupReaderTextDisplayProps = QuestionTextDisplayProps;

export default function TossupReaderTextDisplay({
  buzzIndex,
  visibleIndex,
  visibleRef,
  words,
}: TossupReaderTextDisplayProps) {
  return (
    <Box bg="gray.100" borderRadius="md" overflow="auto" p={4}>
      <FormattedQuestion
        buzzIndex={buzzIndex}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={words}
      />
    </Box>
  );
}
