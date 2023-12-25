import { Flex } from '@chakra-ui/react';
import { FormattedWord, Question, QuestionResult } from '@qbhub/types';
import { useCallback, useMemo, useState } from 'react';
import useInput from '../../hooks/useInput';
import useScrollIntoView from '../../hooks/useScrollToVisible';
import {
  QuestionReaderStatus,
  UnscoredQuestionResult,
  getIsAnswering,
} from '../../utils/questionReader';
import { getFormattedWords } from '../../utils/reader';
import QuestionInfo from './QuestionInfo';
import QuestionReaderInput from './QuestionReaderInput';
import QuestionReaderProgress from './QuestionReaderProgress';
import QuestionReaderScore from './QuestionReaderScore';
import useReader from './useReader';

export type QuestionContentDisplayProps = {
  question: Question;
  status: QuestionReaderStatus;
  visibleIndex: number;
  visibleRef: React.RefObject<HTMLParagraphElement>;
  words: FormattedWord[];
  buzzIndex?: number;
};
export type QuestionContentDisplay =
  React.ComponentType<QuestionContentDisplayProps>;

type QuestionReaderProps<T extends number> = {
  getScore: (result: UnscoredQuestionResult) => T;
  onJudged: (result: QuestionResult<T>) => void;
  onNextQuestion: () => void;
  onPrompt: (result: QuestionResult<T>) => void;
  question: Question;
  renderQuestionContentDisplay: QuestionContentDisplay;
  score: number;
};

export default function QuestionReader<T extends number>({
  getScore,
  onJudged,
  onNextQuestion,
  onPrompt,
  question,
  renderQuestionContentDisplay: QuestionContentDisplay,
  score,
}: QuestionReaderProps<T>) {
  const [buzzIndex, setBuzzIndex] = useState<number>();
  const [result, setResult] = useState<QuestionResult<T>>();

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

  const handleJudged = useCallback(
    (judgedResult: QuestionResult<T>) => {
      setResult(judgedResult);
      setBuzzIndex(judgedResult.buzzIndex);
      blurInput();
      onJudged(judgedResult);
    },
    [blurInput, onJudged],
  );

  const handlePrompt = useCallback(
    (promptResult: QuestionResult<T>) => {
      focusInput();
      selectInput();
      onPrompt(promptResult);
    },
    [focusInput, onPrompt, selectInput],
  );

  const handleNext = useCallback(() => {
    blurInput();
    onNextQuestion();
  }, [blurInput, onNextQuestion]);

  const { handleClick, status, visibleIndex } = useReader({
    getScore,
    onBuzz: focusInput,
    onJudged: handleJudged,
    onNext: handleNext,
    onPrompt: handlePrompt,
    onReveal: scrollToVisible,
    question,
    userInput,
  });

  const shouldShowProgress = getIsAnswering(status);

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo question={question} />
      <QuestionContentDisplay
        buzzIndex={buzzIndex}
        question={question}
        status={status}
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
        result={result}
        setUserInput={setUserInput}
        status={status}
        userInput={userInput}
      />
      <QuestionReaderScore result={result} score={score} />
    </Flex>
  );
}
