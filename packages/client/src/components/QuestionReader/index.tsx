import { Flex } from '@chakra-ui/react';
import {
  FormattedWord,
  Question,
  QuestionInstance,
  QuestionResult,
  ScoredQuestionResult,
} from '@qbhub/types';
import { useCallback, useMemo, useState } from 'react';
import useInput from '../../hooks/useInput';
import { QuestionReaderStatus } from '../../utils/questionReader';
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
  words: FormattedWord[];
  buzzIndex?: number;
};

type QuestionContentDisplay = React.ComponentType<QuestionContentDisplayProps>;

type QuestionReaderProps = {
  latestResult: ScoredQuestionResult | undefined;
  onJudged: (result: QuestionResult) => void;
  onNextQuestion: () => void;
  onPrompt: (result: QuestionResult) => void;
  questionInstance: QuestionInstance;
  renderQuestionContentDisplay: QuestionContentDisplay;
  score: number;
};

export default function QuestionReader({
  latestResult,
  onJudged,
  onNextQuestion,
  onPrompt,
  questionInstance,
  renderQuestionContentDisplay: QuestionContentDisplay,
  score,
}: QuestionReaderProps) {
  const isCurrentQuestionJudged =
    questionInstance.instanceID === latestResult?.instanceID;

  const [buzzIndex, setBuzzIndex] = useState<number | undefined>(
    isCurrentQuestionJudged ? latestResult?.buzzIndex : undefined,
  );
  const [promptCount, setPromptCount] = useState(0);

  const {
    blurInput,
    focusInput,
    inputRef,
    selectInput,
    setUserInput,
    userInput,
  } = useInput(isCurrentQuestionJudged ? latestResult?.userAnswer : undefined);

  const formattedWords = useMemo(
    () => getFormattedWords(questionInstance.formattedText),
    [questionInstance.formattedText],
  );

  const handleJudged = useCallback(
    (judgedResult: QuestionResult) => {
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
    isCurrentQuestionJudged,
    onBuzz: focusInput,
    onJudged: handleJudged,
    onNext: handleNext,
    onPrompt: handlePrompt,
    questionInstance,
    userInput,
  });

  const shouldShowProgress = status === QuestionReaderStatus.Answering;
  const currentResult = isCurrentQuestionJudged ? latestResult : undefined;

  return (
    <Flex direction="column" gap={4} maxW="container.md" overflow="auto" p={2}>
      <QuestionInfo questionMetadata={questionInstance} />
      <QuestionContentDisplay
        buzzIndex={buzzIndex}
        question={questionInstance}
        status={status}
        visibleIndex={visibleIndex}
        words={formattedWords}
      />
      {shouldShowProgress && (
        <QuestionReaderProgress key={promptCount} onFinish={handleClick} />
      )}
      <QuestionReaderInput
        currentResult={currentResult}
        inputRef={inputRef}
        onClick={handleClick}
        setUserInput={setUserInput}
        status={status}
        userInput={userInput}
      />
      <QuestionReaderScore currentResult={latestResult} score={score} />
    </Flex>
  );
}
