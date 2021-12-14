import { Container, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';
import { parseHTMLString } from '../../utils/string';

type AnswerProps = {
  text: string;
  query: string | undefined;
};

const Answer: React.FC<AnswerProps> = ({ text, query }) => {
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
    <Container
      maxW="container.md"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      borderRadius="md"
    >
      <Text>
        <b>ANSWER:</b> {renderAnswer()}
      </Text>
    </Container>
  );
};

export default Answer;
