import { useToast } from '@chakra-ui/react';
import {
  Bonus,
  BonusPartResult,
  BonusResult,
  QuestionResult,
  ScoredQuestionResult,
} from '@qbhub/types';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import QuestionReader, {
  QuestionContentDisplayProps,
} from '../components/QuestionReader';
import QuestionReaderSkeleton from '../components/QuestionReader/QuestionReaderSkeleton';
import TealButton from '../components/buttons/TealButton';
import useActions from '../hooks/useActions';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/utils';
import {
  combineBonusPartWithLeadin,
  displayToast,
  getBonusPartResult,
  getBonusPartResultWithMetadata,
  getBonusResult,
  isLastBonusPart,
} from '../utils/bonus';
import BonusReaderContentDisplay from './BonusReaderContentDisplay';
import EmptyBonusesNotice from './EmptyBonusesNotice';
import { selectBonusReader, submitResult } from './bonusReaderSlice';
import useBonusReaderReducer from './useBonusReaderReducer';

type BonusReaderDisplayProps = {
  currentBonus: Bonus;
  latestBonusPartResult: BonusPartResult | undefined;
  latestBonusResult: BonusResult | undefined;
  score: number;
};

function BonusReaderDisplay({
  currentBonus,
  latestBonusPartResult,
  latestBonusResult,
  score,
}: BonusReaderDisplayProps) {
  const isCurrentBonusJudged =
    currentBonus.id === latestBonusResult?.question.id;
  const initialBonusReaderState = isCurrentBonusJudged
    ? { bonusPartNumber: 2, bonusPartResults: latestBonusResult.parts }
    : undefined;

  const [{ bonusPartNumber, bonusPartResults }, dispatchBonusReader] =
    useBonusReaderReducer(initialBonusReaderState);
  const { openBonusHistoryModal } = useModalContext();
  const { dispatchNextBonus } = useActions();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const currentBonusPart = currentBonus?.parts[bonusPartNumber];

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => {
      if (currentBonus === undefined || currentBonusPart === undefined) return;

      const bonusPartResult = getBonusPartResult(
        result,
        bonusPartNumber,
        currentBonusPart,
      );
      dispatchBonusReader({
        bonus: currentBonus,
        bonusPartResult,
        type: 'newBonusPartResult',
      });
      const nextBonusPartResults = [...bonusPartResults, bonusPartResult];

      if (bonusPartNumber === currentBonus.parts.length - 1) {
        const newBonusResult = getBonusResult(
          nextBonusPartResults,
          currentBonus,
        );
        displayToast(toast, { result: newBonusResult, type: 'judgedBonus' });
        dispatch(submitResult(newBonusResult));
        return;
      }

      displayToast(toast, { result: bonusPartResult, type: 'judgedBonusPart' });
    },
    [
      bonusPartNumber,
      bonusPartResults,
      currentBonus,
      currentBonusPart,
      dispatch,
      dispatchBonusReader,
      toast,
    ],
  );

  const handlePrompt = useCallback(() => {
    displayToast(toast, { type: 'prompt' });
  }, [toast]);

  const handleNextQuestion = useCallback(() => {
    if (currentBonus === undefined) return;

    dispatchBonusReader({
      bonus: currentBonus,
      type: 'nextBonusPart',
    });

    toast.closeAll();
    if (isLastBonusPart(bonusPartNumber, currentBonus)) {
      dispatchNextBonus();
    }
  }, [
    bonusPartNumber,
    currentBonus,
    dispatchBonusReader,
    dispatchNextBonus,
    toast,
  ]);

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

  const latestBonusPartResultWithMetadata = useMemo<
    ScoredQuestionResult | undefined
  >(() => {
    if (
      latestBonusResult === undefined ||
      latestBonusPartResult === undefined
    ) {
      return undefined;
    }

    return getBonusPartResultWithMetadata(
      latestBonusPartResult,
      latestBonusResult,
    );
  }, [latestBonusPartResult, latestBonusResult]);

  if (currentQuestion === undefined) {
    return <QuestionReaderSkeleton />;
  }

  return (
    <QuestionReader
      key={`${currentBonus.id}-${bonusPartNumber}`}
      latestResult={latestBonusPartResultWithMetadata}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={handlePrompt}
      question={currentQuestion}
      renderQuestionContentDisplay={renderQuestionContentDisplay}
      score={score}
    />
  );
}

export default function BonusReader() {
  const {
    currentBonus,
    isUninitialized,
    isUserWaiting,
    latestBonusPartResult,
    latestBonusResult,
    score,
  } = useSelector(selectBonusReader);
  const { dispatchNextBonus } = useActions();

  useKeyboardShortcut('n', dispatchNextBonus, {
    customAllowCondition: isUninitialized,
  });

  if (isUninitialized) {
    return <TealButton onClick={dispatchNextBonus}>Start bonuses</TealButton>;
  }

  if (isUserWaiting) {
    return <QuestionReaderSkeleton />;
  }

  if (currentBonus === undefined) {
    return <EmptyBonusesNotice />;
  }

  return (
    <BonusReaderDisplay
      currentBonus={currentBonus}
      latestBonusPartResult={latestBonusPartResult}
      latestBonusResult={latestBonusResult}
      score={score}
    />
  );
}
