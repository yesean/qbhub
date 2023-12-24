import { Flex } from '@chakra-ui/react';
import { Question } from '@qbhub/types';
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
  question: Question;
  questionTextDisplay: QuestionTextDisplay;
};

const QuestionReader = ({
  question,
  questionTextDisplay,
}: QuestionReaderProps) => {
  const { latestResult, score, status } = useQuestionReaderContext();

  const shouldShowAnswer = status === ReaderStatus.Judged;

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo question={question} />
      {shouldShowAnswer && <QuestionAnswer question={question} />}
      <QuestionTextPlusInput questiontextDisplay={questionTextDisplay} />
      <QuestionReaderScore
        latestResult={latestResult}
        score={score}
        status={status}
      />
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
      <QuestionReader
        question={question}
        questionTextDisplay={questionTextDisplay}
      />
    </QuestionReaderContextProvider>
  );
}
