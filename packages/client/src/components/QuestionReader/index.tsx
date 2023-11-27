import { Flex } from '@chakra-ui/react';
import { Tossup, TossupResult } from '@qbhub/types';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import {
  QuestionReaderContextProvider,
  QuestionReaderStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';
import QuestionReaderScore from './QuestionReaderScore';
import QuestionTextPlusInput from './QuestionTextPlusInput';

// eslint-disable-next-line arrow-body-style
const QuestionReader = () => {
  const { status } = useQuestionReaderContext();

  const shouldShowAnswer = status === QuestionReaderStatus.Judged;

  return (
    <Flex direction="column" maxW="container.md" overflow="auto" p={2} gap={4}>
      <QuestionInfo />
      {shouldShowAnswer && <QuestionAnswer />}
      <QuestionTextPlusInput />
      <QuestionReaderScore />
    </Flex>
  );
};

type QuestionReaderWrapperProps = {
  question: Tossup; // TODO: fix type
  previousResults: TossupResult[];
  onNextQuestion: () => void;
  onJudged: (result: TossupResult) => void;
};

export default (props: QuestionReaderWrapperProps) => {
  const { question } = props;

  return (
    // use `key` to reset question reader per question
    <QuestionReaderContextProvider key={question.id} {...props}>
      <QuestionReader />
    </QuestionReaderContextProvider>
  );
};
