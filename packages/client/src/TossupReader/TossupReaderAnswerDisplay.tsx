import { Link, Text } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../routes';
import { parseHTMLString } from '../utils/reader';

type TossupReaderAnswerDisplayProps = {
  tossup: Tossup;
};

export default function TossupReaderAnswerDisplay({
  tossup,
}: TossupReaderAnswerDisplayProps) {
  const { getURL: getClueDisplayURL } = ROUTES.clueDisplay.useRouteContext();
  const clueDisplayURL = getClueDisplayURL({
    answer: tossup.normalizedAnswer,
  }).href;
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
