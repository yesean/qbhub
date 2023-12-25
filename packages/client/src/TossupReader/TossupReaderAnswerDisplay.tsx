import { Box, Link, Text } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import { Link as RouterLink } from 'react-router-dom';
import { getClueDisplayURL } from '../utils/routes';
import { parseHTMLString } from '../utils/string';

type TossupReaderAnswerDisplayProps = {
  tossup: Tossup;
};

export default function TossupReaderAnswerDisplay({
  tossup,
}: TossupReaderAnswerDisplayProps) {
  const clueDisplayURL = getClueDisplayURL({
    answer: tossup.normalizedAnswer,
  });
  const answer = parseHTMLString(tossup.formattedAnswer);

  return (
    <Box bg="gray.100" borderRadius="md" p={4}>
      <Text>
        <Text as="b">ANSWER: </Text>
        <Link as={RouterLink} to={clueDisplayURL}>
          {answer}
        </Link>
      </Text>
    </Box>
  );
}
