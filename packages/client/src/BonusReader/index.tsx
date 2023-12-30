import { useToast } from '@chakra-ui/react';
import {
  BonusPart,
  BonusPartResult,
  BonusPartScore,
  BonusResult,
  BonusScore,
  QuestionResult,
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
import { useAppDispatch } from '../redux/hooks';
import { UnscoredQuestionResult } from '../utils/questionReader';
import {
  combineBonusPartWithLeadin,
  getBonusResult,
  isLastBonusPart,
} from '../utils/reader';
import BonusReaderContentDisplay from './BonusReaderContentDisplay';
import { selectBonusReader, submitResult } from './bonusReaderSlice';
import useBonusReaderReducer from './useBonusReaderReducer';

function getBonusPartResultScore({
  isCorrect,
}: UnscoredQuestionResult): BonusPartScore {
  return isCorrect ? BonusPartScore.ten : BonusPartScore.zero;
}

function getBonusPartResult(
  result: QuestionResult,
  number: number,
  bonusPart: BonusPart,
): BonusPartResult {
  return {
    ...result,
    bonusPart,
    number,
    score: getBonusPartResultScore(result),
  };
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
  const toast = useToast();

  const currentBonusPart = currentBonus?.parts[bonusPartNumber];

  const displayJudgedToast = useCallback(
    (result: BonusResult) => {
      switch (result.score) {
        case BonusScore.thirty:
          return toast({
            status: 'success',
            title: 'All thirty!',
          });
        case BonusScore.twenty:
          return toast({
            status: 'success',
            title: 'Twenty!',
          });
        case BonusScore.ten:
          return toast({
            status: 'success',
            title: 'Ten',
          });
        case BonusScore.zero:
          return toast({
            status: 'error',
            title: 'Zero',
          });
      }
    },
    [toast],
  );

  const displayPromptToast = useCallback(() => {
    toast({
      status: 'info',
      title: 'Prompt',
    });
  }, [toast]);

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => {
      if (currentBonus === undefined || currentBonusPart === undefined) return;

      const bonusPartResult = getBonusPartResult(
        result,
        bonusPartNumber,
        currentBonusPart,
      );

      dispatchBonusReader({
        payload: { bonus: currentBonus, bonusPartResult },
        type: 'newBonusPartResult',
      });

      const nextBonusPartResults = [...bonusPartResults, bonusPartResult];
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
      displayJudgedToast,
    ],
  );

  const handleNextQuestion = useCallback(() => {
    if (currentBonus === undefined) return;

    dispatchBonusReader({
      payload: { bonus: currentBonus },
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

  if (currentQuestion === undefined) {
    return <QuestionReaderSkeleton />;
  }

  return (
    <QuestionReader
      key={bonusPartNumber}
      displayResult={bonusResult}
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
