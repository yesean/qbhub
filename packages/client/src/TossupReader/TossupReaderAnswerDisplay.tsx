import { Link, Text } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import { Link as RouterLink } from 'react-router-dom';
import { parseHTMLString } from '../utils/reader';
import { getClueDisplayURL } from '../utils/routes';

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
    <>
      <Text as="b">ANSWER: </Text>
      <Link as={RouterLink} to={clueDisplayURL}>
        {answer}
      </Link>
    </>
  );
}
