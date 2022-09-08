import { Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { parseHTMLString } from '../../utils/string';

type AnswerProps = {
  text: string;
  query?: string;
};

const Answer: React.FC<React.PropsWithChildren<AnswerProps>> = ({ text, query }) => {
  const renderAnswer = () => {
    if (query === undefined) {
      return parseHTMLString(text);
    }

    return (
      <Link as={RouterLink} to={ROUTES.clues.searchResults(query)}>
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
