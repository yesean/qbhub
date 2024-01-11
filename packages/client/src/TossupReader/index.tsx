import { useToast } from '@chakra-ui/react';
import { QuestionResult, TossupInstance, TossupResult } from '@qbhub/types';
import { useCallback } from 'react';
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
import { displayToast, getTossupResult } from '../utils/tossup';
import EmptyTossupsNotice from './EmptyTossupsNotice';
import TossupReaderContentDisplay from './TossupReaderContentDisplay';
import { selectTossupReader, submitResult } from './tossupReaderSlice';

type TossupReaderDisplayProps = {
  currentTossupInstance: TossupInstance;
  latestTossupResult: TossupResult | undefined;
  score: number;
};

function TossupReaderDisplay({
  currentTossupInstance,
  latestTossupResult,
  score,
}: TossupReaderDisplayProps): JSX.Element {
  const { openTossupHistoryModal } = useModalContext();
  const { dispatchNextTossup } = useActions();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleQuestionResult = useCallback(
    (questionResult: QuestionResult) => {
      if (currentTossupInstance === undefined) return;

      const newTossupResult = getTossupResult(
        questionResult,
        currentTossupInstance.normalizedAnswer,
      );
      dispatch(submitResult(newTossupResult));
      displayToast(toast, { result: newTossupResult, type: 'judged' });
    },
    [currentTossupInstance, dispatch, toast],
  );

  const handlePrompt = useCallback(() => {
    displayToast(toast, { type: 'prompt' });
  }, [toast]);

  const handleNextQuestion = useCallback(() => {
    toast.closeAll();
    dispatchNextTossup();
  }, [dispatchNextTossup, toast]);

  const renderQuestionContentDisplay = useCallback(
    (props: QuestionContentDisplayProps) => (
      <TossupReaderContentDisplay {...props} tossup={currentTossupInstance} />
    ),
    [currentTossupInstance],
  );

  useKeyboardShortcut('h', openTossupHistoryModal);

  return (
    <QuestionReader
      key={currentTossupInstance.instanceID}
      latestResult={latestTossupResult}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={handlePrompt}
      questionInstance={currentTossupInstance}
      renderQuestionContentDisplay={renderQuestionContentDisplay}
      score={score}
    />
  );
}

export default function TossupReader() {
  const {
    currentTossupInstance,
    isUninitialized,
    isUserWaiting,
    latestTossupResult,
    score,
  } = useSelector(selectTossupReader);
  const { dispatchNextTossup } = useActions();

  useKeyboardShortcut('n', dispatchNextTossup, {
    customAllowCondition: isUninitialized,
  });

  if (isUninitialized) {
    return <TealButton onClick={dispatchNextTossup}>Start tossups</TealButton>;
  }

  if (isUserWaiting) {
    return <QuestionReaderSkeleton />;
  }

  if (currentTossupInstance === undefined) {
    return <EmptyTossupsNotice />;
  }

  return (
    <TossupReaderDisplay
      currentTossupInstance={currentTossupInstance}
      latestTossupResult={latestTossupResult}
      score={score}
    />
  );
}
