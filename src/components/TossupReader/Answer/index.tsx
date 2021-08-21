import { Container, Text } from '@chakra-ui/react';

const Answer: React.FC = () => {
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
        {
          'ANSWER: UV/Vis spec [or ultraviolet–visible spectroscopy] <Science - Chemistry>'
        }
      </Text>
    </Container>
  );
};

export default Answer;
