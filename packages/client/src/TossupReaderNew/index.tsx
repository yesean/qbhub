import { QuestionResult, TossupResult } from '@qbhub/types';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  nextTossup,
  selectTossupReader,
  submitResult,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader from '../components/QuestionReader';
import { UnscoredQuestionResult } from '../components/QuestionReader/QuestionReaderContext';
import TealButton from '../components/buttons/TealButton';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/hooks';
import { getPowerIndex, getTossupScore, getTossupWords } from '../utils/reader';

// evaluate user answer
const getTossupResult = ({
  buzzIndex,
  isCorrect,
  question,
  score,
  userAnswer,
}: QuestionResult): TossupResult => {
  const tossupWords = getTossupWords(question.formattedText);

  return {
    buzzIndex,
    isCorrect,
    score,
    tossup: question,
    userAnswer,
    words: tossupWords,
  };
};

const getQuestionResult = (result: TossupResult): QuestionResult => ({
  ...result,
  question: result.tossup,
});

export default function TossupReader() {
  const { openTossupHistoryModal } = useModalContext();
  const { current, results } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const questionResults = useMemo(
    () => results.map(getQuestionResult),
    [results],
  );

  const handleNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => {
      dispatch(submitResult(getTossupResult(result)));

      if (result.isCorrect) {
        toast.success('correct!');
      } else {
        toast.error('sorry, incorrect');
      }
    },
    [dispatch],
  );

  const handlePrompt = useCallback(() => {
    toast('prompt', { icon: '💭' });
  }, []);

  const getScore = useCallback(
    ({ buzzIndex, isCorrect, question }: UnscoredQuestionResult) => {
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
      getScore={getScore}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextTossup}
      onPrompt={handlePrompt}
      previousResults={questionResults}
      question={current.tossup}
    />
  );
}
