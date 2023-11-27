import { Flex } from '@chakra-ui/react';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import {
  QuestionReaderContextProvider,
  QuestionReaderContextProviderProps,
  QuestionReaderStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';
import QuestionReaderScore from './QuestionReaderScore';
import QuestionTextPlusInput from './QuestionTextPlusInput';

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

type QuestionReaderWrapperProps = Omit<
  QuestionReaderContextProviderProps,
  'children'
>;

export default (props: QuestionReaderWrapperProps) => {
  const { question } = props;

  return (
    // use `key` to reset question reader per question
    <QuestionReaderContextProvider key={question.id} {...props}>
      <QuestionReader />
    </QuestionReaderContextProvider>
  );
};
