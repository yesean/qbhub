import { TossupResult } from '@qbhub/types';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  nextTossup,
  selectTossupReader,
  submitResult,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader from '../components/QuestionReader';
import { QuestionResult } from '../components/QuestionReader/QuestionReaderContext';
import TealButton from '../components/buttons/TealButton';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import {
  JudgeResult,
  getPowerIndex,
  getTossupScore,
  getTossupWords,
} from '../utils/reader';

// evaluate user answer
const getTossupResult = ({
  judgeResult,
  question,
  userAnswer,
  buzzIndex,
}: QuestionResult): TossupResult => {
  const isCorrect = judgeResult === JudgeResult.correct;
  const tossupWords = getTossupWords(question.formattedText);
  const isInPower = buzzIndex <= getPowerIndex(tossupWords);
  const isBuzzAtEnd = buzzIndex === tossupWords.length - 1;

  return {
    tossup: question,
    userAnswer,
    buzzIndex,
    isCorrect,
    words: tossupWords,
    score: getTossupScore(isCorrect, isInPower, isBuzzAtEnd),
  };
};

export default function TossupReader() {
  const { current, results } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const handleNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => dispatch(submitResult(getTossupResult(result))),
    [dispatch],
  );

  const isTossupMissing = current.tossup.id === undefined;

  useKeyboardShortcut('n', handleNextTossup, {
    customAllowCondition: isTossupMissing,
  });

  if (isTossupMissing) {
    return (
      <TealButton onClick={handleNextTossup}>click for tossups</TealButton>
    );
  }

  return (
    <QuestionReader
      question={current.tossup}
      previousResults={results}
      onNextQuestion={handleNextTossup}
      onJudged={handleQuestionResult}
    />
  );
}
