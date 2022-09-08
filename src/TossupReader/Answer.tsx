import { Container } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import ReaderAnswer from '../components/reader/Answer';
import { selectTossupReader } from './tossupReaderSlice';

const Answer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: {
      tossup: { formattedAnswer, normalizedAnswer },
    },
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
      <ReaderAnswer text={formattedAnswer} query={normalizedAnswer} />;
    </Container>
  );
};

export default Answer;
