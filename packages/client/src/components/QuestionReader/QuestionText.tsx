import { Container } from '@chakra-ui/react';
import { isTossup } from '@qbhub/types';
import { getTossupWords } from '../../utils/reader';
import FormattedQuestion from '../reader/FormattedQuestion';
import { useQuestionReaderContext } from './QuestionReaderContext';

export default () => {
  const { question } = useQuestionReaderContext();

  if (!isTossup(question)) return null;

  const textWords = getTossupWords(question.formattedText);

  return (
    <Container
      maxW="container.md"
      overflow="auto"
      bg="gray.100"
      w="100%"
      minH="100px"
      mb={4}
      p={4}
      display="flex"
      flexWrap="wrap"
      justifyContent="start"
      borderRadius="md"
    >
      <FormattedQuestion words={textWords} />
    </Container>
  );
};
