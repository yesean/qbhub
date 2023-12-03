import { Flex } from '@chakra-ui/react';
import { isTossup } from '@qbhub/types';
import { ReaderStatus } from '../../utils/questionReader';
import FormattedQuestion from '../reader/FormattedQuestion';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import {
  QuestionReaderContextProvider,
  QuestionReaderContextProviderProps,
} from './QuestionReaderContext';
import QuestionReaderScore from './QuestionReaderScore';
import QuestionTextPlusInput from './QuestionTextPlusInput';
import useQuestionReaderContext from './useQuestionReaderContext';

const QuestionReader = () => {
  const { question, status } = useQuestionReaderContext();

  const shouldShowAnswer = status === ReaderStatus.Judged;
  const textDisplay = isTossup(question)
    ? FormattedQuestion
    : FormattedQuestion;

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo />
      {shouldShowAnswer && <QuestionAnswer />}
      <QuestionTextPlusInput textDisplay={textDisplay} />
      <QuestionReaderScore />
    </Flex>
  );
};

type QuestionReaderWrapperProps = Omit<
  QuestionReaderContextProviderProps,
  'children'
>;

export default function QuestionReaderWrapper(
  props: QuestionReaderWrapperProps,
) {
  const { question } = props;

  return (
    // use `key` to reset question reader per question
    <QuestionReaderContextProvider key={question.id} {...props}>
      <QuestionReader />
    </QuestionReaderContextProvider>
  );
}
