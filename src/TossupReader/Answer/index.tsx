import { Container, Text } from '@chakra-ui/react';
import { parseHTMLString } from '../../services/utils';

type AnswerProps = {
  answer: string;
};

const Answer: React.FC<AnswerProps> = ({ answer }) => {
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
        <b>ANSWER:</b> {parseHTMLString(answer)}
      </Text>
    </Container>
  );
};

export default Answer;
