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
      bg="gray.100"
      borderRadius="md"
      maxW="container.md"
      mb={4}
      p={4}
      w="100%"
    >
      <ReaderAnswer query={normalizedAnswer} text={formattedAnswer} />
    </Container>
  );
};

export default Answer;
