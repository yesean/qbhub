import { QuestionResult, TossupResult, TossupScore } from '@qbhub/types';
import { useCallback, useState } from 'react';
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
import {
  getFormattedWords,
  getPowerIndex,
  getTossupScore,
} from '../utils/reader';
import TossupReaderContentDisplay from './TossupReaderContentDisplay';
import { selectTossupReader, submitResult } from './tossupReaderSlice';

// evaluate user answer
const getTossupResult = (
  { question, ...result }: QuestionResult<TossupScore>,
  normalizedAnswer: string,
): TossupResult => ({
  formattedWords: getFormattedWords(question.formattedText),
  tossup: { ...question, normalizedAnswer },
  ...result,
});

const getScore = ({
  buzzIndex,
  isCorrect,
  question,
}: UnscoredQuestionResult): TossupScore => {
  const tossupWords = getFormattedWords(question.formattedText);
  const isInPower = buzzIndex <= getPowerIndex(tossupWords);
  const isBuzzAtEnd = buzzIndex === tossupWords.length - 1;

  return getTossupScore(isCorrect, isInPower, isBuzzAtEnd);
};

const displayJudgedToast = (result: QuestionResult<TossupScore>) => {
  if (result.isCorrect) {
    if (result.score === TossupScore.power) {
      toast.success('Power!');
    } else if (result.score === TossupScore.ten) {
      toast.success('Ten!');
    }
  } else {
    toast.error('Incorrect');
  }
};

const displayPromptToast = () => {
  toast('Prompt', { icon: '💭' });
};

function TossupReaderDisplay() {
  const [tossupResult, setTossupResult] = useState<TossupResult>();
  const { currentTossup, score } = useSelector(selectTossupReader);
  const { openTossupHistoryModal } = useModalContext();
  const { dispatchNextTossup } = useActions();
  const dispatch = useAppDispatch();

  const handleQuestionResult = useCallback(
    (questionResult: QuestionResult<TossupScore>) => {
      if (currentTossup === undefined) return;

      const newTossupResult = getTossupResult(
        questionResult,
        currentTossup.normalizedAnswer,
      );
      setTossupResult(newTossupResult);
      dispatch(submitResult(newTossupResult));
      displayJudgedToast(questionResult);
    },
    [currentTossup, dispatch],
  );

  const handleNextQuestion = useCallback(() => {
    toast.dismiss();
    setTossupResult(undefined);
    dispatchNextTossup();
  }, [dispatchNextTossup]);

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
      getScore={getScore}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={displayPromptToast}
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
