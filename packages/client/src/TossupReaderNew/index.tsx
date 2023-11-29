import { TossupResult } from '@qbhub/types';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  nextTossup,
  selectTossupReader,
  submitResult,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader from '../components/QuestionReader';
import {
  QuestionResult,
  UnscoredQuestionResult,
} from '../components/QuestionReader/QuestionReaderContext';
import TealButton from '../components/buttons/TealButton';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useModalContext } from '../providers/ModalContext';
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
  score,
}: QuestionResult): TossupResult => {
  const tossupWords = getTossupWords(question.formattedText);
  const isCorrect = judgeResult === JudgeResult.correct;

  return {
    tossup: question,
    userAnswer,
    buzzIndex,
    isCorrect,
    words: tossupWords,
    score,
  };
};

const getQuestionResult = (result: TossupResult): QuestionResult => ({
  question: result.tossup,
  judgeResult: result.isCorrect ? JudgeResult.correct : JudgeResult.incorrect,
  userAnswer: result.userAnswer,
  buzzIndex: result.buzzIndex,
  score: result.score,
});

export default function TossupReader() {
  const { openTossupHistoryModal } = useModalContext();
  const { current, results } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const questionResults = results.map(getQuestionResult);

  const handleNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => dispatch(submitResult(getTossupResult(result))),
    [dispatch],
  );

  const getScore = useCallback(
    ({ question, judgeResult, buzzIndex }: UnscoredQuestionResult) => {
      const isCorrect = judgeResult === JudgeResult.correct;
      const tossupWords = getTossupWords(question.formattedText);
      const isInPower = buzzIndex <= getPowerIndex(tossupWords);
      const isBuzzAtEnd = buzzIndex === tossupWords.length - 1;

      return getTossupScore(isCorrect, isInPower, isBuzzAtEnd);
    },
    [],
  );

  const isTossupMissing = current.tossup.id === undefined;

  useKeyboardShortcut('n', handleNextTossup, {
    customAllowCondition: isTossupMissing,
  });

  useKeyboardShortcut('h', openTossupHistoryModal);

  if (isTossupMissing) {
    return (
      <TealButton onClick={handleNextTossup}>click for tossups</TealButton>
    );
  }

  return (
    <QuestionReader
      question={current.tossup}
      previousResults={questionResults}
      onNextQuestion={handleNextTossup}
      onJudged={handleQuestionResult}
      getScore={getScore}
    />
  );
}
