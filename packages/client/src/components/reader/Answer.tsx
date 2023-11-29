import { Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetURL } from '../../utils/routes';
import { parseHTMLString } from '../../utils/string';

type AnswerProps = {
  text: string;
  query?: string;
};

const Answer: React.FC<React.PropsWithChildren<AnswerProps>> = ({
  query,
  text,
}) => {
  const { getClueDisplayURL } = useGetURL();

  const renderAnswer = () => {
    if (query === undefined) {
      return parseHTMLString(text);
    }

    return (
      <Link as={RouterLink} to={getClueDisplayURL({ answer: text })}>
        {parseHTMLString(text)}
      </Link>
    );
  };

  return (
    <Text>
      <b>ANSWER:</b> {renderAnswer()}
    </Text>
  );
};

export default Answer;
