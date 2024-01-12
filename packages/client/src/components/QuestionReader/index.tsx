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

export type JudgeResultChange = {
  instanceID: string;
  isCorrect: boolean;
};

type QuestionReaderProps = {
  latestResult: ScoredQuestionResult | undefined;
  onJudged: (result: QuestionResult) => void;
  onJudgeResultChange: (judgeResultChange: JudgeResultChange) => void;
  onNextQuestion: () => void;
  onPrompt: (result: QuestionResult) => void;
  questionInstance: QuestionInstance;
  renderQuestionContentDisplay: QuestionContentDisplay;
  score: number;
};

export default function QuestionReader({
  latestResult,
  onJudged,
  onJudgeResultChange,
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
  const [questionResult, setQuestionResult] = useState<
    QuestionResult | undefined
  >(isCurrentQuestionJudged ? latestResult : undefined);

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
      setQuestionResult(judgedResult);
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

  const handleJudgeResultChange = useCallback(() => {
    if (questionResult === undefined) {
      return;
    }

    const newIsCorrect = !questionResult.isCorrect;
    onJudgeResultChange({
      instanceID: questionInstance.instanceID,
      isCorrect: newIsCorrect,
    });
    setQuestionResult(() => ({
      ...questionResult,
      isCorrect: newIsCorrect,
    }));
  }, [onJudgeResultChange, questionInstance.instanceID, questionResult]);

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
        currentResult={questionResult}
        inputRef={inputRef}
        onClick={handleClick}
        onJudgeResultChangeClick={handleJudgeResultChange}
        setUserInput={setUserInput}
        status={status}
        userInput={userInput}
      />
      <QuestionReaderScore
        currentResult={isCurrentQuestionJudged ? latestResult : undefined}
        score={score}
      />
    </Flex>
  );
}
