import { Question, QuestionResult } from '@qbhub/types';
import { log } from '@qbhub/utils';
import { useCallback, useMemo, useState } from 'react';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import { JudgeResult } from '../../utils/judge';
import {
  QuestionReaderStatus,
  getNextStatus,
} from '../../utils/questionReader';
import { getFormattedWords } from '../../utils/reader';
import useJudge from './useJudge';
import useRevealer from './useRevealer';

type UseReaderProps = {
  onBuzz: () => void;
  onJudged: (result: QuestionResult) => void;
  onNext: () => void;
  onPrompt: (result: QuestionResult) => void;
  question: Question;
  userInput: string;
  onReveal?: (visibleIndex: number) => void;
};

type UseReaderType = {
  handleClick: () => void;
  status: QuestionReaderStatus;
  visibleIndex: number;
};

/**
 * Hook for managing the general reader state machine.
 * The general reader state flow is: reading -> answering -> judged
 * Consumers of the hook can attach callbacks on state changes.
 */
export default function useReader({
  onBuzz,
  onJudged,
  onNext,
  onPrompt,
  onReveal,
  question,
  userInput,
}: UseReaderProps): UseReaderType {
  const [status, setStatus] = useState(QuestionReaderStatus.Reading);
  const { judgeInput } = useJudge(question);

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

  const handleFinish = useCallback(() => {
    if (status !== QuestionReaderStatus.Reading) return;

    // buzz, if the user has not
    handleBuzz();
  }, [handleBuzz, status]);

  const {
    pause: pauseQuestionRevealing,
    reveal: revealQuestion,
    visibleIndex,
  } = useRevealer({
    onChange: onReveal,
    onFinish: handleFinish, // manually trigger buzz, if all words are revealed before the user buzzes
    words: formattedWords,
  });

  const submitResult = useCallback(
    (result: QuestionResult) => {
      onJudged(result);
      revealQuestion();
      setStatus(getNextStatus(status));
    },
    [onJudged, revealQuestion, status],
  );

  const getQuestionResult = useCallback(
    (judgeResult: JudgeResult) => ({
      buzzIndex: visibleIndex,
      isCorrect: judgeResult === JudgeResult.correct,
      judgeResult,
      question,
      userAnswer: userInput,
    }),
    [question, userInput, visibleIndex],
  );

  /**
   * @Action submit answer
   * @CausedBy enter press, button click, answering timer finishes
   * @Behavior
   *  if prompted: focus input, set next status
   *  otherwise: mimic behavior of: submit answer after being prompted
   */
  const handleSubmitOnAnswering = useCallback(() => {
    log.debug('User submitted:', userInput);

    const judgeResult = judgeInput(userInput);
    const questionResult = getQuestionResult(judgeResult);

    // if user is prompted
    if (judgeResult === JudgeResult.prompt) {
      onPrompt(questionResult);
      setStatus(getNextStatus(status, { isPrompted: true }));
      return;
    }

    // not prompted
    submitResult(questionResult);
  }, [
    getQuestionResult,
    judgeInput,
    onPrompt,
    status,
    submitResult,
    userInput,
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

  const handleClick = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();

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
        case QuestionReaderStatus.Judged: {
          handleNextQuestion();
          break;
        }
      }
    },
    [
      handleBuzz,
      handleNextQuestion,
      handleSubmitOnAnswering,
      pauseQuestionRevealing,
      status,
    ],
  );

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

  return useMemo(
    () => ({ handleClick: () => handleClick, status, visibleIndex }),
    [handleClick, status, visibleIndex],
  );
}
