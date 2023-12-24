import { Flex } from '@chakra-ui/react';
import { ReaderStatus } from '../../utils/questionReader';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import {
  QuestionReaderContextProvider,
  QuestionReaderContextProviderProps,
} from './QuestionReaderContext';
import QuestionReaderScore from './QuestionReaderScore';
import QuestionTextPlusInput, {
  QuestionTextDisplay,
} from './QuestionTextPlusInput';
import useQuestionReaderContext from './useQuestionReaderContext';

type QuestionReaderProps = {
  questionTextDisplay: QuestionTextDisplay;
};

const QuestionReader = ({ questionTextDisplay }: QuestionReaderProps) => {
  const { status } = useQuestionReaderContext();

  const shouldShowAnswer = status === ReaderStatus.Judged;

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo />
      {shouldShowAnswer && <QuestionAnswer />}
      <QuestionTextPlusInput questiontextDisplay={questionTextDisplay} />
      <QuestionReaderScore />
    </Flex>
  );
};

type QuestionReaderWrapperProps = Omit<
  QuestionReaderContextProviderProps,
  'children'
> & { questionTextDisplay: QuestionTextDisplay };

export default function QuestionReaderWrapper(
  props: QuestionReaderWrapperProps,
) {
  const { question, questionTextDisplay } = props;

  return (
    // use `key` to reset question reader per question
    <QuestionReaderContextProvider key={question.id} {...props}>
      <QuestionReader questionTextDisplay={questionTextDisplay} />
    </QuestionReaderContextProvider>
  );
}
