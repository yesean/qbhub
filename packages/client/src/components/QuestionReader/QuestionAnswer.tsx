import { Box, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { getClueSearchURL } from '../../utils/routes';
import { parseHTMLString } from '../../utils/string';
import useQuestionReaderContext from './useQuestionReaderContext';

export default function QuestionAnswer() {
  const { question } = useQuestionReaderContext();

  // const clueDisplayURL = getClueDisplayURL({
  //   answer: question.normalizedAnswer,
  // });
  const answer = parseHTMLString(question.formattedAnswer);

  return (
    <Box bg="gray.100" borderRadius="md" p={4}>
      <Text>
        <b>ANSWER: </b>
        {/* <Link as={RouterLink} to={clueDisplayURL}> */}
        <Link as={RouterLink} to={getClueSearchURL()}>
          {answer}
        </Link>
      </Text>
    </Box>
  );
}
