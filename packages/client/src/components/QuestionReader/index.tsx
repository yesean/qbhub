import { Flex } from '@chakra-ui/react';
import { Tossup, isTossup } from '@qbhub/types';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import { QuestionReaderContextProvider } from './QuestionReaderContext';
import QuestionTextPlusInput from './QuestionTextPlusInput';

type Props = {
  question: Tossup; // TODO: fix type
  // onNextQuestion: () => void;
  // onSubmitAnswer: () => void;
  // onJudged: () => void;
};

// eslint-disable-next-line arrow-body-style
const QuestionReader = (_: Props) => {
  return (
    <Flex direction="column" maxW="container.md" overflow="auto" p={2} gap={4}>
      <QuestionInfo />
      <QuestionAnswer />
      <QuestionTextPlusInput />
    </Flex>
  );
};

export default (props: Props) => {
  const { question } = props;

  if (!isTossup(question)) return null;

  return (
    // use `key` to reset question reader per question
    <QuestionReaderContextProvider key={question.id} question={question}>
      <QuestionReader {...props} />
    </QuestionReaderContextProvider>
  );
};
