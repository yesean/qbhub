import { Flex } from '@chakra-ui/react';
import { Tossup, isTossup } from '@qbhub/types';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import { QuestionReaderContextProvider } from './QuestionReaderContext';
import QuestionReaderInput from './QuestionReaderInput';
import QuestionText from './QuestionText';

type Props = {
  question: Tossup; // TODO: fix type
  // onNextQuestion: () => void;
  // onSubmitAnswer: () => void;
  // onJudged: () => void;
};

const QuestionReader = (_: Props) => {
  return (
    <Flex direction="column" maxW="container.md" overflow="auto" p={2} gap={4}>
      <QuestionInfo />
      <QuestionAnswer />
      <QuestionText />
      <QuestionReaderInput />
    </Flex>
  );
};

export default (props: Props) => {
  const { question } = props;

  if (!isTossup(question)) return null;

  return (
    <QuestionReaderContextProvider question={question}>
      <QuestionReader {...props} />
    </QuestionReaderContextProvider>
  );
};
