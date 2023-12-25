import { Flex, Skeleton, Stack } from '@chakra-ui/react';
import { QuestionResult, TossupResult, TossupScore } from '@qbhub/types';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  selectTossupReader,
  submitResult,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader, {
  QuestionContentDisplayProps,
} from '../components/QuestionReader';
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

// evaluate user answer
const getTossupResult = (
  { question, ...result }: QuestionResult,
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
}: UnscoredQuestionResult) => {
  const tossupWords = getFormattedWords(question.formattedText);
  const isInPower = buzzIndex <= getPowerIndex(tossupWords);
  const isBuzzAtEnd = buzzIndex === tossupWords.length - 1;

  return getTossupScore(isCorrect, isInPower, isBuzzAtEnd);
};

const displayJudgedToast = (result: QuestionResult) => {
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
  toast('prompt', { icon: '💭' });
};

function TossupReaderDisplay() {
  const { current, score } = useSelector(selectTossupReader);

  const { openTossupHistoryModal } = useModalContext();
  const { dispatchNextTossup } = useActions();
  const dispatch = useAppDispatch();

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => {
      if (current === null) return;

      dispatch(
        submitResult(getTossupResult(result, current.tossup.normalizedAnswer)),
      );
      displayJudgedToast(result);
    },
    [current, dispatch],
  );

  const handleNextQuestion = useCallback(() => {
    toast.dismiss();
    dispatchNextTossup();
  }, [dispatchNextTossup]);

  const renderQuestionContentDisplay = useCallback(
    (props: QuestionContentDisplayProps) =>
      current && (
        <TossupReaderContentDisplay {...props} tossup={current.tossup} />
      ),
    [current],
  );

  useKeyboardShortcut('h', openTossupHistoryModal);

  if (current === null) {
    return (
      <Stack maxW="container.md" w="100%">
        <Skeleton h="40px" w="85%" />
        <Skeleton h="200px" />
        <Flex gap={2}>
          <Skeleton flexGrow={1} h="40px" />
          <Skeleton flexBasis="60px" h="40px" />
        </Flex>
      </Stack>
    );
  }

  return (
    <QuestionReader
      getScore={getScore}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextQuestion}
      onPrompt={displayPromptToast}
      question={current.tossup}
      renderQuestionContentDisplay={renderQuestionContentDisplay}
      score={score}
    />
  );
}

export default function TossupReader() {
  const { current, isFetching } = useSelector(selectTossupReader);
  const { dispatchNextTossup } = useActions();

  const isTossupAvaiableOrPending = current !== null || isFetching;

  useKeyboardShortcut('n', dispatchNextTossup, {
    customAllowCondition: !isTossupAvaiableOrPending,
  });

  if (!isTossupAvaiableOrPending) {
    return <TealButton onClick={dispatchNextTossup}>Start tossups</TealButton>;
  }

  return <TossupReaderDisplay />;
}
