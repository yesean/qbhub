import { Box, Flex, Input } from '@chakra-ui/react';
import { Tossup, TossupResult } from '@qbhub/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import {
  Judge,
  JudgeResult,
  getPowerIndex,
  getTossupScore,
  getTossupWords,
} from '../../utils/reader';
import TealButton from '../buttons/TealButton';
import FormattedQuestion from '../reader/FormattedQuestion';
import {
  QuestionReaderStatus,
  getNextStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';
import QuestionReaderProgress from './QuestionReaderProgress';
import useRevealer from './useRevealer';

// get input border color for tossup results, green/red for correct/incorrect
const getInputBorderColor = (
  status: QuestionReaderStatus,
  questionResult?: TossupResult,
) => {
  if (status !== QuestionReaderStatus.Judged || questionResult == null)
    return 'gray.300';

  if (questionResult.isCorrect) return 'green.400';
  return 'red.400';
};

// get button text depending on reader status
const getButtonText = (status: QuestionReaderStatus) => {
  switch (status) {
    case QuestionReaderStatus.Reading:
      return 'Buzz';
    case QuestionReaderStatus.Answering:
      return 'Submit';
    case QuestionReaderStatus.Judged:
      return 'Next';
  }
};

// evaluate user answer
const getTossupResult = (
  question: Tossup,
  userInput: string,
  visibleIndex: number,
) => {
  const tossupWords = getTossupWords(question.formattedText);

  const judge = new Judge(question.formattedAnswer);
  const isCorrect = judge.judge(userInput) === JudgeResult.correct;
  const isInPower = visibleIndex <= getPowerIndex(tossupWords);
  const isBuzzAtEnd = visibleIndex === tossupWords.length - 1;
  return {
    buzzIndex: visibleIndex,
    isCorrect,
    userAnswer: userInput,
    words: tossupWords,
    tossup: question,
    score: getTossupScore(isCorrect, isInPower, isBuzzAtEnd),
  };
};

/**
 * Question text revealer + Answering input
 */
export default () => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    question,
    status,
    setStatus,
    previousResults,
    onNextQuestion,
    onJudged,
  } = useQuestionReaderContext();

  const focusInput = useCallback(() => {
    if (inputRef.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  }, []);

  const blurInput = useCallback(() => inputRef.current?.blur(), []);

  const tossupWords = useMemo(
    () => getTossupWords(question.formattedText),
    [question.formattedText],
  );

  /**
   * @Action buzz
   * @CausedBy spacebar press, button click, all words get revealed
   * @Behavior focus input, set next status
   */
  const handleBuzz = useCallback(() => {
    focusInput();
    setStatus(getNextStatus(status));
  }, [focusInput, setStatus, status]);

  const buzzIfUserHasNot = useCallback(() => {
    if (status !== QuestionReaderStatus.Reading) return;

    handleBuzz();
  }, [handleBuzz, status]);

  const {
    visibleIndex,
    pause: pauseQuestionRevealing,
    reveal: revealQuestion,
  } = useRevealer({
    words: tossupWords,
    onFinish: buzzIfUserHasNot, // manually trigger buzz, if all words are revealed before the user buzzes
  });

  /**
   * @Action submit answer
   * @CausedBy enter press, button click, answering timer finishes
   * @Behavior blur input, reveal answer, evaluate user answer, call the passed-in submit callback, set next status
   */
  const handleSubmit = useCallback(() => {
    // evaluate user answer
    const nextResult = getTossupResult(question, userInput, visibleIndex);

    blurInput();
    revealQuestion();
    onJudged(nextResult);
    setStatus(getNextStatus(status));
  }, [
    blurInput,
    onJudged,
    question,
    revealQuestion,
    setStatus,
    status,
    userInput,
    visibleIndex,
  ]);

  /**
   * @Action next question
   * @CausedBy n press, button click
   * @Behavior blur input, call the passed-in next callback, set next status
   */
  const handleNextQuestion = useCallback(() => {
    blurInput();
    onNextQuestion();
    setStatus(getNextStatus(status));
  }, [blurInput, onNextQuestion, setStatus, status]);

  const handleClick = useCallback(() => {
    switch (status) {
      case QuestionReaderStatus.Reading: {
        pauseQuestionRevealing();
        handleBuzz();
        break;
      }
      case QuestionReaderStatus.Answering: {
        handleSubmit();
        break;
      }
      case QuestionReaderStatus.Judged: {
        handleNextQuestion();
        break;
      }
    }
  }, [
    handleBuzz,
    handleNextQuestion,
    handleSubmit,
    pauseQuestionRevealing,
    status,
  ]);

  useKeyboardShortcut(' ', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Reading,
  });

  useKeyboardShortcut('Enter', handleClick, {
    allowHTMLInput: true,
    customAllowCondition: status === QuestionReaderStatus.Answering,
  });

  useKeyboardShortcut('n', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Judged,
  });

  const shouldShowProgress = status === QuestionReaderStatus.Answering;
  const shouldShowBorder = status === QuestionReaderStatus.Judged;
  const currentResult = previousResults.find(
    ({ tossup: { id } }) => id === question.id,
  );

  return (
    <>
      <Box overflow="auto" bg="gray.100" p={4} borderRadius="md">
        <FormattedQuestion
          words={tossupWords}
          indices={{ visible: visibleIndex, buzz: currentResult?.buzzIndex }}
        />
      </Box>
      {shouldShowProgress && <QuestionReaderProgress onFinish={handleSubmit} />}
      <Flex w="100%" justify="center">
        <Input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Answer"
          mr={4}
          isDisabled={status !== QuestionReaderStatus.Answering}
          borderColor={getInputBorderColor(status, currentResult)}
          borderWidth={shouldShowBorder ? 2 : undefined}
        />
        <TealButton onClick={handleClick}>{getButtonText(status)}</TealButton>
      </Flex>
    </>
  );
};
