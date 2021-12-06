import { Container, Link, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import { parseHTMLString } from '../utils/string';
import { selectTossupReader } from './tossupReaderSlice';

const Answer: React.FC = () => {
  const {
    currentTossup: { formattedAnswer, normalizedAnswer },
  } = useSelector(selectTossupReader);

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
        <b>ANSWER:</b>{' '}
        <Link as={RouterLink} to={ROUTES.clues.searchResults(normalizedAnswer)}>
          {parseHTMLString(formattedAnswer)}
        </Link>
      </Text>
    </Container>
  );
};

export default Answer;
