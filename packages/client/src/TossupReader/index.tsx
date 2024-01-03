import { useToast } from '@chakra-ui/react';
import { QuestionResult, Tossup, TossupResult } from '@qbhub/types';
import { useCallback, useState } from 'react';
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
  currentTossup: Tossup;
  score: number;
};

function TossupReaderDisplay({
  currentTossup,
  score,
}: TossupReaderDisplayProps) {
  const [tossupResult, setTossupResult] = useState<TossupResult>();
  const { openTossupHistoryModal } = useModalContext();
  const { dispatchNextTossup } = useActions();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleQuestionResult = useCallback(
    (questionResult: QuestionResult) => {
      if (currentTossup === undefined) return;

      const newTossupResult = getTossupResult(
        questionResult,
        currentTossup.normalizedAnswer,
      );
      setTossupResult(newTossupResult);
      dispatch(submitResult(newTossupResult));
      displayToast(toast, { result: newTossupResult, type: 'judged' });
    },
    [currentTossup, dispatch, toast],
  );

  const handlePrompt = useCallback(() => {
    displayToast(toast, { type: 'prompt' });
  }, [toast]);

  const handleNextQuestion = useCallback(() => {
    toast.closeAll();
    setTossupResult(undefined);
    dispatchNextTossup();
  }, [dispatchNextTossup, toast]);

  const renderQuestionContentDisplay = useCallback(
    (props: QuestionContentDisplayProps) => (
      <TossupReaderContentDisplay {...props} tossup={currentTossup} />
    ),
    [currentTossup],
  );

  useKeyboardShortcut('h', openTossupHistoryModal);

  return (
    <QuestionReader
      key={currentTossup.id}
      displayResult={tossupResult}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={handlePrompt}
      question={currentTossup}
      renderQuestionContentDisplay={renderQuestionContentDisplay}
      score={score}
    />
  );
}

export default function TossupReader() {
  const { currentTossup, isFetching, isUninitialized, isUserWaiting, score } =
    useSelector(selectTossupReader);
  const { dispatchNextTossup } = useActions();

  useKeyboardShortcut('n', dispatchNextTossup, {
    customAllowCondition: isUninitialized,
  });

  if (isUninitialized) {
    return <TealButton onClick={dispatchNextTossup}>Start tossups</TealButton>;
  }

  if (isFetching && isUserWaiting) {
    return <QuestionReaderSkeleton />;
  }

  if (currentTossup === undefined) {
    return <EmptyTossupsNotice />;
  }

  return <TossupReaderDisplay currentTossup={currentTossup} score={score} />;
}
