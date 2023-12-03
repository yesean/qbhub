import { Box, Flex, Input } from '@chakra-ui/react';
import { FormattedWord, QuestionResult } from '@qbhub/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import { ReaderStatus, getNextStatus } from '../../utils/questionReader';
import { Judge, getFormattedWords } from '../../utils/reader';
import TealButton from '../buttons/TealButton';
import QuestionReaderProgress from './QuestionReaderProgress';
import useQuestionReaderContext from './useQuestionReaderContext';
import useReader from './useReader';

// get input border color for tossup results, green/red for correct/incorrect
const getInputBorderColor = (
  status: ReaderStatus,
  questionResult?: QuestionResult,
): string => {
  if (status !== ReaderStatus.Judged || questionResult == null)
    return 'gray.300';

  if (questionResult.isCorrect) return 'green.400';
  return 'red.400';
};

// get button text depending on reader status
const getButtonText = (status: ReaderStatus): string => {
  switch (status) {
    case ReaderStatus.Reading:
      return 'Buzz';
    case ReaderStatus.Answering:
      return 'Submit';
    case ReaderStatus.AnsweringAfterPrompt:
      return 'Submit';
    case ReaderStatus.Judged:
      return 'Next';
  }
};

export type TextDisplayProps = {
  visibleIndex: number;
  visibleRef: React.RefObject<HTMLParagraphElement>;
  words: FormattedWord[];
  buzzIndex?: number;
};

type QuestionTextPlusInputProps = {
  textDisplay: React.ComponentType<TextDisplayProps>;
};

/**
 * Question text revealer + Answering input
 */
export default function QuestionTextPlusInput({
  textDisplay: TextDisplay,
}: QuestionTextPlusInputProps) {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    getScore,
    onJudged,
    onNextQuestion,
    onPrompt,
    previousResults,
    question,
    setStatus,
  } = useQuestionReaderContext();

  const focusInput = useCallback(() => {
    if (inputRef.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  }, []);
  const blurInput = useCallback(() => inputRef.current?.blur(), []);
  const selectInput = useCallback(() => inputRef.current?.select(), []);

  const scrollToVisible = useCallback(() => {
    if (visibleRef.current != null)
      elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, []);

  const formattedWords = useMemo(
    () => getFormattedWords(question.formattedText),
    [question.formattedText],
  );

  const onReveal = useCallback(() => {
    scrollToVisible();
  }, [scrollToVisible]);

  const onBuzz = useCallback(() => {
    focusInput();
    setStatus(getNextStatus);
  }, [focusInput, setStatus]);

  const onJudgedWrapper = useCallback(
    (result: QuestionResult) => {
      blurInput();
      onJudged(result);
      setStatus(getNextStatus);
    },
    [blurInput, onJudged, setStatus],
  );

  const onPromptWrapper = useCallback(
    (result: QuestionResult) => {
      focusInput();
      selectInput();
      onPrompt(result);
      setStatus((status) => getNextStatus(status, { isPrompted: true }));
    },
    [focusInput, onPrompt, selectInput, setStatus],
  );

  const onNext = useCallback(() => {
    blurInput();
    onNextQuestion();
    setStatus(getNextStatus);
  }, [blurInput, onNextQuestion, setStatus]);

  const { handleClick, status, visibleIndex } = useReader({
    getScore,
    onBuzz,
    onJudged: onJudgedWrapper,
    onNext,
    onPrompt: onPromptWrapper,
    onReveal,
    question,
    userInput,
  });

  const isAnswering = [
    ReaderStatus.Answering,
    ReaderStatus.AnsweringAfterPrompt,
  ].includes(status);

  const shouldShowProgress = isAnswering;
  const shouldShowBorder = status === ReaderStatus.Judged;
  const lastResult = previousResults.at(-1);
  const buzzIndex =
    status === ReaderStatus.Judged ? lastResult?.buzzIndex : undefined;
  const shouldDisableInput = !isAnswering;

  return (
    <>
      <Box bg="gray.100" borderRadius="md" overflow="auto" p={4}>
        <TextDisplay
          buzzIndex={buzzIndex}
          visibleIndex={visibleIndex}
          visibleRef={visibleRef}
          words={formattedWords}
        />
      </Box>
      {shouldShowProgress && (
        <QuestionReaderProgress key={status} onFinish={handleClick} />
      )}
      <Flex justify="center" w="100%">
        <Input
          ref={inputRef}
          borderColor={getInputBorderColor(status, lastResult)}
          borderWidth={shouldShowBorder ? 2 : undefined}
          isDisabled={shouldDisableInput}
          mr={4}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Answer"
          value={userInput}
        />
        <TealButton onClick={handleClick}>{getButtonText(status)}</TealButton>
      </Flex>
    </>
  );
}
