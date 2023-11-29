import { Box, Flex, Input } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import {
  QuestionReaderStatus,
  getNextStatus,
} from '../../utils/questionReader';
import { Judge, JudgeResult, getTossupWords } from '../../utils/reader';
import TealButton from '../buttons/TealButton';
import FormattedQuestion from '../reader/FormattedQuestion';
import {
  QuestionResult,
  UnscoredQuestionResult,
} from './QuestionReaderContext';
import QuestionReaderProgress from './QuestionReaderProgress';
import useQuestionReaderContext from './useQuestionReaderContext';
import useRevealer from './useRevealer';

// get input border color for tossup results, green/red for correct/incorrect
const getInputBorderColor = (
  status: QuestionReaderStatus,
  questionResult?: QuestionResult,
): string => {
  if (status !== QuestionReaderStatus.Judged || questionResult == null)
    return 'gray.300';

  if (questionResult.isCorrect) return 'green.400';
  return 'red.400';
};

// get button text depending on reader status
const getButtonText = (status: QuestionReaderStatus): string => {
  switch (status) {
    case QuestionReaderStatus.Reading:
      return 'Buzz';
    case QuestionReaderStatus.Answering:
      return 'Submit';
    case QuestionReaderStatus.AnsweringAfterPrompt:
      return 'Submit';
    case QuestionReaderStatus.Judged:
      return 'Next';
  }
};

const getQuestionResult = (
  question: Tossup,
  userAnswer: string,
  buzzIndex: number,
  getScore: (result: UnscoredQuestionResult) => number,
) => {
  const judge = new Judge(question.formattedAnswer);
  const judgeResult = judge.judge(userAnswer);
  const isCorrect = judgeResult === JudgeResult.correct;
  const unscoredQuestionResult = {
    buzzIndex,
    isCorrect,
    judgeResult,
    question,
    userAnswer,
  };
  const score = getScore(unscoredQuestionResult);
  return { ...unscoredQuestionResult, score };
};

/**
 * Question text revealer + Answering input
 */
export default function QuestionTextPlusInput() {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const visibleRef = useRef<HTMLParagraphElement>(null);
  const {
    getScore,
    onJudged,
    onNextQuestion,
    previousResults,
    question,
    setStatus,
    status,
  } = useQuestionReaderContext();

  const focusInput = useCallback(() => {
    if (inputRef.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  }, []);
  const blurInput = useCallback(() => inputRef.current?.blur(), []);
  const selectInput = useCallback(() => inputRef.current?.select(), []);

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

  const scrollToVisible = useCallback(() => {
    if (visibleRef.current != null)
      elementScrollIntoView(visibleRef.current, { block: 'center' });
  }, []);

  const buzzIfUserHasNot = useCallback(() => {
    if (status !== QuestionReaderStatus.Reading) return;

    scrollToVisible();
    handleBuzz();
  }, [handleBuzz, scrollToVisible, status]);

  const {
    pause: pauseQuestionRevealing,
    reveal: revealQuestion,
    visibleIndex,
  } = useRevealer({
    onChange: scrollToVisible,
    onFinish: buzzIfUserHasNot,
    words: tossupWords, // manually trigger buzz, if all words are revealed before the user buzzes
  });

  const submitResult = useCallback(
    (result: QuestionResult) => {
      blurInput();
      revealQuestion();
      onJudged(result);
      setStatus(getNextStatus(status));

      if (result.isCorrect) {
        toast.success('correct!');
      } else {
        toast.error('sorry, incorrect');
      }
    },
    [blurInput, onJudged, revealQuestion, setStatus, status],
  );

  /**
   * @Action submit answer after being prompted
   * @CausedBy enter press, button click, answering timer finishes
   * @Behavior blur input, reveal answer, evaluate user answer, call the passed-in submit callback, set next status
   */
  const handleSubmitOnAnsweringAfterPrompt = useCallback(() => {
    // evaluate user answer
    const result = getQuestionResult(
      question,
      userInput,
      visibleIndex,
      getScore,
    );
    submitResult(result);
  }, [getScore, question, submitResult, userInput, visibleIndex]);

  /**
   * @Action submit answer
   * @CausedBy enter press, button click, answering timer finishes
   * @Behavior
   *  if prompted: focus input, set next status
   *  otherwise: mimic behavior of: submit answer after being prompted
   */
  const handleSubmitOnAnswering = useCallback(() => {
    const result = getQuestionResult(
      question,
      userInput,
      visibleIndex,
      getScore,
    );

    // if user is prompted
    if (result.judgeResult === JudgeResult.prompt) {
      focusInput();
      selectInput();
      toast('prompt', { icon: '💭' });
      setStatus(getNextStatus(status, { isPrompted: true }));
      return;
    }

    // not prompted
    submitResult(result);
  }, [
    focusInput,
    getScore,
    question,
    selectInput,
    setStatus,
    status,
    submitResult,
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
        handleSubmitOnAnswering();
        break;
      }
      case QuestionReaderStatus.AnsweringAfterPrompt: {
        handleSubmitOnAnsweringAfterPrompt();
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
    handleSubmitOnAnswering,
    handleSubmitOnAnsweringAfterPrompt,
    pauseQuestionRevealing,
    status,
  ]);

  const isAnswering = [
    QuestionReaderStatus.Answering,
    QuestionReaderStatus.AnsweringAfterPrompt,
  ].includes(status);

  useKeyboardShortcut(' ', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Reading,
  });

  useKeyboardShortcut('Enter', handleClick, {
    allowHTMLInput: true,
    customAllowCondition: isAnswering,
  });

  useKeyboardShortcut('n', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Judged,
  });

  const shouldShowProgress = isAnswering;
  const shouldShowBorder = status === QuestionReaderStatus.Judged;
  const lastResult = previousResults.at(-1);
  const buzzIndex =
    status === QuestionReaderStatus.Judged ? lastResult?.buzzIndex : undefined;
  const shouldDisableInput = !isAnswering;

  return (
    <>
      <Box overflow="auto" bg="gray.100" p={4} borderRadius="md">
        <FormattedQuestion
          words={tossupWords}
          indices={{ buzz: buzzIndex, visible: visibleIndex }}
          visibleRef={visibleRef}
        />
      </Box>
      {shouldShowProgress && (
        <QuestionReaderProgress
          key={status}
          onFinish={handleSubmitOnAnswering}
        />
      )}
      <Flex w="100%" justify="center">
        <Input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Answer"
          mr={4}
          isDisabled={shouldDisableInput}
          borderColor={getInputBorderColor(status, lastResult)}
          borderWidth={shouldShowBorder ? 2 : undefined}
        />
        <TealButton onClick={handleClick}>{getButtonText(status)}</TealButton>
      </Flex>
    </>
  );
}
