import { Container, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { parseHTMLString } from '../../utils/questionReader';
import { selectCurrentTossup } from '../tossupReaderSlice';

const Answer: React.FC = () => {
  const { formattedAnswer } = useSelector(selectCurrentTossup);

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
        <b>ANSWER:</b> {parseHTMLString(formattedAnswer)}
      </Text>
    </Container>
  );
};

export default Answer;
