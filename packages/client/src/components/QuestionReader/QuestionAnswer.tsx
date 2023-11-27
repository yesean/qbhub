import { Box, Link, Text } from '@chakra-ui/react';
import { isTossup } from '@qbhub/types';
import { Link as RouterLink } from 'react-router-dom';
import { getClueDisplayURL } from '../../utils/routes';
import { parseHTMLString } from '../../utils/string';
import useQuestionReaderContext from './useQuestionReaderContext';

export default function QuestionAnswer() {
  const { question } = useQuestionReaderContext();

  if (!isTossup(question)) return null;

  const clueDisplayURL = getClueDisplayURL({
    answer: question.normalizedAnswer,
  });
  const answer = parseHTMLString(question.formattedAnswer);

  return (
    <Box bg="gray.100" p={4} borderRadius="md">
      <Text>
        <b>ANSWER: </b>
        <Link as={RouterLink} to={clueDisplayURL}>
          {answer}
        </Link>
      </Text>
    </Box>
  );
}
