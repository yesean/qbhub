import { Flex } from '@chakra-ui/react';
import { FormattedWord, Question, QuestionResult } from '@qbhub/types';
import { useCallback, useMemo, useState } from 'react';
import useInput from '../../hooks/useInput';
import { QuestionReaderStatus } from '../../utils/questionReader';
import { getFormattedWords } from '../../utils/reader';
import QuestionInfo from './QuestionInfo';
import QuestionReaderInput from './QuestionReaderInput';
import QuestionReaderProgress from './QuestionReaderProgress';
import QuestionReaderScore, { DisplayResult } from './QuestionReaderScore';
import useReader from './useReader';

export type QuestionContentDisplayProps = {
  question: Question;
  status: QuestionReaderStatus;
  visibleIndex: number;
  words: FormattedWord[];
  buzzIndex?: number;
};
export type QuestionContentDisplay =
  React.ComponentType<QuestionContentDisplayProps>;

type QuestionReaderProps = {
  displayResult: DisplayResult;
  onJudged: (result: QuestionResult) => void;
  onNextQuestion: () => void;
  onPrompt: (result: QuestionResult) => void;
  question: Question;
  renderQuestionContentDisplay: QuestionContentDisplay;
  score: number;
};

export default function QuestionReader({
  displayResult,
  onJudged,
  onNextQuestion,
  onPrompt,
  question,
  renderQuestionContentDisplay: QuestionContentDisplay,
  score,
}: QuestionReaderProps) {
  const [buzzIndex, setBuzzIndex] = useState<number>();
  const [result, setResult] = useState<QuestionResult>();
  const [promptCount, setPromptCount] = useState(0);

  const {
    blurInput,
    focusInput,
    inputRef,
    selectInput,
    setUserInput,
    userInput,
  } = useInput();

  const formattedWords = useMemo(
    () => getFormattedWords(question.formattedText),
    [question.formattedText],
  );

  const handleJudged = useCallback(
    (judgedResult: QuestionResult) => {
      setResult(judgedResult);
      setBuzzIndex(judgedResult.buzzIndex);
      blurInput();
      onJudged(judgedResult);
    },
    [blurInput, onJudged],
  );

  const handlePrompt = useCallback(
    (promptResult: QuestionResult) => {
      setPromptCount((prev) => prev + 1);
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
    onBuzz: focusInput,
    onJudged: handleJudged,
    onNext: handleNext,
    onPrompt: handlePrompt,
    question,
    userInput,
  });

  const shouldShowProgress = status === QuestionReaderStatus.Answering;

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo question={question} />
      <QuestionContentDisplay
        buzzIndex={buzzIndex}
        question={question}
        status={status}
        visibleIndex={visibleIndex}
        words={formattedWords}
      />
      {shouldShowProgress && (
        <QuestionReaderProgress key={promptCount} onFinish={handleClick} />
      )}
      <QuestionReaderInput
        inputRef={inputRef}
        onClick={handleClick}
        result={result}
        setUserInput={setUserInput}
        status={status}
        userInput={userInput}
      />
      <QuestionReaderScore result={displayResult} score={score} />
    </Flex>
  );
}
