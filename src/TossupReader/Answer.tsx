import { Container, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { parseHTMLString } from '../utils/questionReader';
import { selectCurrentTossup } from './tossupReaderSlice';
import { ROUTES } from '../utils/routes';

const Answer: React.FC = () => {
  const { formattedAnswer, normalizedAnswer } =
    useSelector(selectCurrentTossup);

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
