import { Container, Text } from '@chakra-ui/react';

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
      <Text pl={2} pr={2}>
        {answer}
      </Text>
    </Container>
  );
};

export default Answer;
