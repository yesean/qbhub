import { useToast } from '@chakra-ui/react';
import { QuestionResult, TossupResult } from '@qbhub/types';
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
import TossupReaderContentDisplay from './TossupReaderContentDisplay';
import { selectTossupReader, submitResult } from './tossupReaderSlice';

function TossupReaderDisplay() {
  const [tossupResult, setTossupResult] = useState<TossupResult>();
  const { currentTossup, score } = useSelector(selectTossupReader);
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
    (props: QuestionContentDisplayProps) =>
      currentTossup === undefined ? null : (
        <TossupReaderContentDisplay {...props} tossup={currentTossup} />
      ),
    [currentTossup],
  );

  useKeyboardShortcut('h', openTossupHistoryModal);

  if (currentTossup === undefined) {
    return <QuestionReaderSkeleton />;
  }

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
  const { currentTossup, isFetching } = useSelector(selectTossupReader);
  const { dispatchNextTossup } = useActions();

  const isTossupAvaiableOrPending = currentTossup !== undefined || isFetching;

  useKeyboardShortcut('n', dispatchNextTossup, {
    customAllowCondition: !isTossupAvaiableOrPending,
  });

  if (!isTossupAvaiableOrPending) {
    return <TealButton onClick={dispatchNextTossup}>Start tossups</TealButton>;
  }

  return <TossupReaderDisplay />;
}
