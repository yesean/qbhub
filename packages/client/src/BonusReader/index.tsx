import {
  BonusPart,
  BonusPartResult,
  BonusPartScore,
  BonusResult,
  BonusScore,
  QuestionResult,
} from '@qbhub/types';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import QuestionReader, {
  QuestionContentDisplayProps,
} from '../components/QuestionReader';
import QuestionReaderSkeleton from '../components/QuestionReader/QuestionReaderSkeleton';
import TealButton from '../components/buttons/TealButton';
import useActions from '../hooks/useActions';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/hooks';
import { UnscoredQuestionResult } from '../utils/questionReader';
import { combineBonusPartWithLeadin, getBonusResult } from '../utils/reader';
import BonusReaderContentDisplay from './BonusReaderContentDisplay';
import { selectBonusReader, submitResult } from './bonusReaderSlice';
import useBonusReaderReducer from './useBonusReaderReducer';

function getBonusPartResult(
  result: QuestionResult<BonusPartScore>,
  number: number,
  bonusPart: BonusPart,
): BonusPartResult {
  return { ...result, bonusPart, number };
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
  const [
    { bonusPartNumber, bonusPartResults, bonusResult },
    dispatchBonusReader,
  ] = useBonusReaderReducer();
  const { currentBonus, score } = useSelector(selectBonusReader);
  const { openBonusHistoryModal } = useModalContext();
  const { dispatchNextBonus } = useActions();
  const dispatch = useAppDispatch();

  const currentBonusPart = currentBonus?.parts[bonusPartNumber];

  const handleQuestionResult = useCallback(
    (result: QuestionResult<BonusPartScore>) => {
      if (currentBonus === undefined || currentBonusPart === undefined) return;

      const bonusPartResult = getBonusPartResult(
        result,
        bonusPartNumber,
        currentBonusPart,
      );
      const nextBonusPartResults = [...bonusPartResults, bonusPartResult];

      dispatchBonusReader({
        payload: { bonus: currentBonus, bonusPartResult },
        type: 'new_bonus_part_result',
      });

      if (bonusPartNumber === currentBonus.parts.length - 1) {
        const newBonusResult = getBonusResult(
          nextBonusPartResults,
          currentBonus,
        );
        displayJudgedToast(newBonusResult);
        dispatch(submitResult(newBonusResult));
      }
    },
    [
      bonusPartNumber,
      bonusPartResults,
      currentBonus,
      currentBonusPart,
      dispatch,
      dispatchBonusReader,
    ],
  );

  const handleNextQuestion = useCallback(() => {
    if (currentBonus === undefined) return;

    dispatchBonusReader({
      payload: { bonus: currentBonus },
      type: 'next_bonus_part',
    });

    toast.dismiss();
    if (bonusPartNumber === currentBonus.parts.length - 1) {
      dispatchNextBonus();
    }
  }, [bonusPartNumber, currentBonus, dispatchBonusReader, dispatchNextBonus]);

  const currentQuestion = useMemo(() => {
    if (currentBonus === undefined || currentBonusPart === undefined) return;

    if (bonusPartNumber === 0) {
      const formattedText = combineBonusPartWithLeadin(
        currentBonusPart,
        currentBonus,
      );
      return { ...currentBonus, ...currentBonusPart, formattedText };
    }

    return { ...currentBonus, ...currentBonusPart };
  }, [bonusPartNumber, currentBonus, currentBonusPart]);

  const renderQuestionContentDisplay = useCallback(
    (props: QuestionContentDisplayProps) =>
      currentBonus === undefined ? null : (
        <BonusReaderContentDisplay
          {...props}
          bonus={currentBonus}
          bonusPartNumber={bonusPartNumber}
          bonusPartResults={bonusPartResults}
        />
      ),
    [bonusPartNumber, bonusPartResults, currentBonus],
  );

  useKeyboardShortcut('h', openBonusHistoryModal);

  if (currentQuestion === undefined) {
    return <QuestionReaderSkeleton />;
  }

  return (
    <QuestionReader
      key={bonusPartNumber}
      displayResult={bonusResult}
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
