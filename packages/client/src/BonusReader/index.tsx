import { Box } from '@chakra-ui/react';
import {
  Bonus,
  BonusPartResult,
  BonusPartScore,
  BonusResult,
  BonusScore,
  QuestionResult,
} from '@qbhub/types';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import QuestionReader, {
  QuestionContentDisplayProps,
} from '../components/QuestionReader';
import QuestionReaderSkeleton from '../components/QuestionReader/QuestionReaderSkeleton';
import TealButton from '../components/buttons/TealButton';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import useActions from '../hooks/useActions';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/hooks';
import { UnscoredQuestionResult } from '../utils/questionReader';
import BonusReaderContentDisplay from './BonusReaderContentDisplay';
import { selectBonusReader, submitResult } from './bonusReaderSlice';

function getBonusPartResult(
  result: QuestionResult<BonusPartScore>,
  number: number,
): BonusPartResult {
  return { ...result, number };
}

function getBonusResult(results: BonusPartResult[], bonus: Bonus): BonusResult {
  const score = (() => {
    const correctPartsCount = results.filter(
      ({ isCorrect }) => isCorrect,
    ).length;
    switch (correctPartsCount) {
      case 3:
        return BonusScore.thirty;
      case 2:
        return BonusScore.twenty;
      case 1:
        return BonusScore.ten;
      default:
        return BonusScore.zero;
    }
  })();

  return {
    bonus,
    parts: results,
    score,
  };
}

function getBonusPartResultScore({
  isCorrect,
}: UnscoredQuestionResult): BonusPartScore {
  return isCorrect ? BonusPartScore.ten : BonusPartScore.zero;
}

const displayJudgedToast = (result: BonusResult) => {
  switch (result.score) {
    case BonusScore.thirty:
      return toast.success('All thirty!');
    case BonusScore.twenty:
      return toast.success('Twenty!');
    case BonusScore.ten:
      return toast.success('Ten');
    case BonusScore.zero:
      return toast.error('Zero');
  }
};

function displayPromptToast() {
  toast('Prompt', { icon: '💭' });
}

function BonusReaderDisplay() {
  const [bonusPartNumber, setBonusPartNumber] = useState(0);
  const [bonusPartResults, setBonusPartResults] = useState<BonusPartResult[]>(
    [],
  );
  const { currentBonus, score } = useSelector(selectBonusReader);
  const { openBonusHistoryModal } = useModalContext();
  const { dispatchNextBonus } = useActions();
  const dispatch = useAppDispatch();

  const handleQuestionResult = useCallback(
    (result: QuestionResult<BonusPartScore>) => {
      if (currentBonus === undefined) return;

      const bonusPartResult = getBonusPartResult(result, bonusPartNumber);
      const nextBonusPartResults = [...bonusPartResults, bonusPartResult];

      if (bonusPartNumber === 2) {
        const bonusResult = getBonusResult(nextBonusPartResults, currentBonus);
        displayJudgedToast(bonusResult);
        dispatch(submitResult(bonusResult));
      } else {
        setBonusPartResults(nextBonusPartResults);
      }
    },
    [bonusPartResults, currentBonus, bonusPartNumber, dispatch],
  );

  const handleNextQuestion = useCallback(() => {
    toast.dismiss();
    const nextBonusPartNumber = bonusPartNumber + 1;

    if (nextBonusPartNumber === 3) {
      setBonusPartNumber(0);
      setBonusPartResults([]);
      dispatchNextBonus();
      return;
    }

    setBonusPartNumber(nextBonusPartNumber);
  }, [bonusPartNumber, dispatchNextBonus]);

  const currentQuestion = useMemo(() => {
    const currentBonusPart = currentBonus?.parts[bonusPartNumber];

    if (currentBonus === undefined || currentBonusPart === undefined) return;

    return { ...currentBonus, ...currentBonusPart };
  }, [bonusPartNumber, currentBonus]);

  const renderQuestionContentDisplay = useCallback(
    (props: QuestionContentDisplayProps) =>
      currentBonus === undefined ? null : (
        <BonusReaderContentDisplay
          {...props}
          bonus={currentBonus}
          bonusPartNumber={bonusPartNumber}
        />
      ),
    [bonusPartNumber, currentBonus],
  );

  useKeyboardShortcut('h', openBonusHistoryModal);

  if (currentQuestion === undefined) {
    return <QuestionReaderSkeleton />;
  }

  return (
    <QuestionReader
      key={bonusPartNumber}
      getScore={getBonusPartResultScore}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={displayPromptToast}
      question={currentQuestion}
      renderQuestionContentDisplay={renderQuestionContentDisplay}
      score={score}
    />
  );
}

export default function BonusReader() {
  const { currentBonus, isFetching } = useSelector(selectBonusReader);
  const { dispatchNextBonus } = useActions();

  const isBonusAvaiableOrPending = currentBonus !== undefined || isFetching;

  useKeyboardShortcut('n', dispatchNextBonus, {
    customAllowCondition: !isBonusAvaiableOrPending,
  });

  if (!isBonusAvaiableOrPending) {
    return <TealButton onClick={dispatchNextBonus}>Start bonuses</TealButton>;
  }

  return <BonusReaderDisplay />;
}
