import { Flex } from '@chakra-ui/react';
import { FormattedWord, Question, QuestionResult } from '@qbhub/types';
import { useCallback, useMemo, useState } from 'react';
import useInput from '../../hooks/useInput';
import useScrollIntoView from '../../hooks/useScrollToVisible';
import {
  QuestionReaderStatus,
  getNextStatus,
} from '../../utils/questionReader';
import { getFormattedWords } from '../../utils/reader';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import {
  QuestionReaderContextProvider,
  QuestionReaderContextProviderProps,
} from './QuestionReaderContext';
import QuestionReaderInput from './QuestionReaderInput';
import QuestionReaderProgress from './QuestionReaderProgress';
import QuestionReaderScore from './QuestionReaderScore';
import useQuestionReaderContext from './useQuestionReaderContext';
import useReader from './useReader';

export type QuestionTextDisplayProps = {
  visibleIndex: number;
  visibleRef: React.RefObject<HTMLParagraphElement>;
  words: FormattedWord[];
  buzzIndex?: number;
};
export type QuestionTextDisplay = React.ComponentType<QuestionTextDisplayProps>;

type QuestionReaderProps = {
  question: Question;
  questionTextDisplay: QuestionTextDisplay;
  score: number;
};

const QuestionReader = ({
  question,
  questionTextDisplay: QuestionTextDisplay,
  score,
}: QuestionReaderProps) => {
  const [buzzIndex, setBuzzIndex] = useState<number>();
  const {
    getScore,
    isAnswering,
    latestResult,
    onJudged,
    onNextQuestion,
    onPrompt,
    setStatus,
  } = useQuestionReaderContext();

  const {
    blurInput,
    focusInput,
    inputRef,
    selectInput,
    setUserInput,
    userInput,
  } = useInput();

  const { scrollToVisible, visibleRef } =
    useScrollIntoView<HTMLParagraphElement>();

  const formattedWords = useMemo(
    () => getFormattedWords(question.formattedText),
    [question.formattedText],
  );

  const handleReveal = useCallback(() => {
    scrollToVisible();
  }, [scrollToVisible]);

  const handleBuzz = useCallback(() => {
    focusInput();
    setStatus(getNextStatus);
  }, [focusInput, setStatus]);

  const handleJudged = useCallback(
    (result: QuestionResult) => {
      blurInput();
      setBuzzIndex(result.buzzIndex);
      onJudged(result);
      setStatus(getNextStatus);
    },
    [blurInput, onJudged, setStatus],
  );

  const handlePrompt = useCallback(
    (result: QuestionResult) => {
      focusInput();
      selectInput();
      onPrompt(result);
      setStatus((status) => getNextStatus(status, { isPrompted: true }));
    },
    [focusInput, onPrompt, selectInput, setStatus],
  );

  const handleNext = useCallback(() => {
    blurInput();
    onNextQuestion();
    setStatus(getNextStatus);
  }, [blurInput, onNextQuestion, setStatus]);

  const { handleClick, status, visibleIndex } = useReader({
    getScore,
    onBuzz: handleBuzz,
    onJudged: handleJudged,
    onNext: handleNext,
    onPrompt: handlePrompt,
    onReveal: handleReveal,
    question,
    userInput,
  });

  const shouldShowProgress = isAnswering;
  const shouldShowAnswer = status === QuestionReaderStatus.Judged;

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo question={question} />
      {shouldShowAnswer && <QuestionAnswer question={question} />}
      <QuestionTextDisplay
        buzzIndex={buzzIndex}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={formattedWords}
      />
      {shouldShowProgress && (
        <QuestionReaderProgress key={status} onFinish={handleClick} />
      )}
      <QuestionReaderInput
        handleClick={handleClick}
        inputRef={inputRef}
        result={latestResult}
        setUserInput={setUserInput}
        status={status}
        userInput={userInput}
      />
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
> &
  QuestionReaderProps;

export default function QuestionReaderWrapper(
  props: QuestionReaderWrapperProps,
) {
  const { question, questionTextDisplay, score } = props;

  return (
    // use `key` to reset question reader per question
    <QuestionReaderContextProvider key={question.id} {...props}>
      <QuestionReader
        question={question}
        questionTextDisplay={questionTextDisplay}
        score={score}
      />
    </QuestionReaderContextProvider>
  );
}
