import { Question, QuestionResult } from '@qbhub/types';
import { useCallback, useMemo, useState } from 'react';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import {
  QuestionReaderStatus,
  UnscoredQuestionResult,
  getNextStatus,
  getQuestionResult,
} from '../../utils/questionReader';
import { JudgeResult, getFormattedWords } from '../../utils/reader';
import useRevealer from './useRevealer';

type Props<T> = {
  getScore: (result: UnscoredQuestionResult) => T;
  onBuzz: () => void;
  onJudged: (result: QuestionResult<T>) => void;
  onNext: () => void;
  onPrompt: (result: QuestionResult<T>) => void;
  onReveal: (visibleIndex: number) => void;
  question: Question;
  userInput: string;
};

type Reader = {
  handleClick: () => void;
  status: QuestionReaderStatus;
  visibleIndex: number;
};

/**
 * Hook for managing the general reader state machine.
 * The general reader state flow is: reading -> answering -> judged
 * Consumers of the hook can attach callbacks on state changes.
 */
export default function useReader<T>({
  getScore,
  onBuzz,
  onJudged,
  onNext,
  onPrompt,
  onReveal,
  question,
  userInput,
}: Props<T>): Reader {
  const [status, setStatus] = useState(QuestionReaderStatus.Reading);

  const formattedWords = getFormattedWords(question.formattedText);

  /**
   * @Action buzz
   * @CausedBy spacebar press, button click, all words get revealed
   * @Behavior focus input, set next status
   */
  const handleBuzz = useCallback(() => {
    onBuzz();
    setStatus(getNextStatus(status));
  }, [onBuzz, status]);

  const buzzIfUserHasNot = useCallback(() => {
    if (status !== QuestionReaderStatus.Reading) return;

    handleBuzz();
  }, [handleBuzz, status]);

  const {
    pause: pauseQuestionRevealing,
    reveal: revealQuestion,
    visibleIndex,
  } = useRevealer({
    onChange: onReveal,
    onFinish: buzzIfUserHasNot, // manually trigger buzz, if all words are revealed before the user buzzes
    words: formattedWords,
  });

  const submitResult = useCallback(
    (result: QuestionResult<T>) => {
      onJudged(result);
      revealQuestion();
      setStatus(getNextStatus(status));
    },
    [onJudged, revealQuestion, status],
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
      onPrompt(result);
      setStatus(getNextStatus(status, { isPrompted: true }));
      return;
    }

    // not prompted
    submitResult(result);
  }, [
    getScore,
    onPrompt,
    question,
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
    onNext();
    setStatus(getNextStatus(status));
  }, [onNext, status]);

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

  return useMemo(
    () => ({ handleClick, status, visibleIndex }),
    [handleClick, status, visibleIndex],
  );
}