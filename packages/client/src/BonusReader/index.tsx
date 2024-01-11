import { useToast } from '@chakra-ui/react';
import {
  BonusInstance,
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
  currentBonusInstance: BonusInstance;
  latestBonusPartResult: BonusPartResult | undefined;
  latestBonusResult: BonusResult | undefined;
  score: number;
};

function BonusReaderDisplay({
  currentBonusInstance,
  latestBonusPartResult,
  latestBonusResult,
  score,
}: BonusReaderDisplayProps) {
  const isCurrentBonusJudged =
    currentBonusInstance.instanceID === latestBonusResult?.instanceID;
  const initialBonusReaderState = isCurrentBonusJudged
    ? { bonusPartNumber: 2, bonusPartResults: latestBonusResult.parts }
    : undefined;

  const [{ bonusPartNumber, bonusPartResults }, dispatchBonusReader] =
    useBonusReaderReducer(initialBonusReaderState);
  const { openBonusHistoryModal } = useModalContext();
  const { dispatchNextBonus } = useActions();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const currentBonusPart = currentBonusInstance.parts[bonusPartNumber];

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => {
      if (currentBonusInstance === undefined || currentBonusPart === undefined)
        return;

      const bonusPartResult = getBonusPartResult(
        result,
        bonusPartNumber,
        currentBonusPart,
      );
      dispatchBonusReader({
        bonus: currentBonusInstance,
        bonusPartResult,
        type: 'newBonusPartResult',
      });
      const nextBonusPartResults = [...bonusPartResults, bonusPartResult];

      if (bonusPartNumber === currentBonusInstance.parts.length - 1) {
        const newBonusResult = getBonusResult(
          nextBonusPartResults,
          currentBonusInstance,
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
      currentBonusInstance,
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
    if (currentBonusInstance === undefined) return;

    dispatchBonusReader({
      bonus: currentBonusInstance,
      type: 'nextBonusPart',
    });

    toast.closeAll();
    if (isLastBonusPart(bonusPartNumber, currentBonusInstance)) {
      dispatchNextBonus();
    }
  }, [
    bonusPartNumber,
    currentBonusInstance,
    dispatchBonusReader,
    dispatchNextBonus,
    toast,
  ]);

  const currentQuestionInstance = useMemo(() => {
    if (currentBonusInstance === undefined || currentBonusPart === undefined)
      return;

    if (bonusPartNumber === 0) {
      const formattedText = combineBonusPartWithLeadin(
        currentBonusPart,
        currentBonusInstance,
      );
      return { ...currentBonusInstance, ...currentBonusPart, formattedText };
    }

    return { ...currentBonusInstance, ...currentBonusPart };
  }, [bonusPartNumber, currentBonusInstance, currentBonusPart]);

  const renderQuestionContentDisplay = useCallback(
    (props: QuestionContentDisplayProps) =>
      currentBonusInstance === undefined ? null : (
        <BonusReaderContentDisplay
          {...props}
          bonus={currentBonusInstance}
          bonusPartNumber={bonusPartNumber}
          bonusPartResults={bonusPartResults}
        />
      ),
    [bonusPartNumber, bonusPartResults, currentBonusInstance],
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

  if (currentQuestionInstance === undefined) {
    return <QuestionReaderSkeleton />;
  }

  return (
    <QuestionReader
      key={`${currentBonusInstance.instanceID}-${bonusPartNumber}`}
      latestResult={latestBonusPartResultWithMetadata}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={handlePrompt}
      questionInstance={currentQuestionInstance}
      renderQuestionContentDisplay={renderQuestionContentDisplay}
      score={score}
    />
  );
}

export default function BonusReader() {
  const {
    currentBonusInstance,
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

  if (currentBonusInstance === undefined) {
    return <EmptyBonusesNotice />;
  }

  return (
    <BonusReaderDisplay
      currentBonusInstance={currentBonusInstance}
      latestBonusPartResult={latestBonusPartResult}
      latestBonusResult={latestBonusResult}
      score={score}
    />
  );
}
