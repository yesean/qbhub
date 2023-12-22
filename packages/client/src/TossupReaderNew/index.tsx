import { Flex, Skeleton, Stack } from '@chakra-ui/react';
import { QuestionResult, TossupResult, TossupScore } from '@qbhub/types';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  nextTossup,
  selectTossupReader,
  submitResult,
} from '../TossupReader/tossupReaderSlice';
import QuestionReader from '../components/QuestionReader';
import { UnscoredQuestionResult } from '../components/QuestionReader/QuestionReaderContext';
import TealButton from '../components/buttons/TealButton';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/hooks';
import {
  getFormattedWords,
  getPowerIndex,
  getTossupScore,
} from '../utils/reader';

// evaluate user answer
const getTossupResult = ({
  buzzIndex,
  isCorrect,
  question,
  score,
  userAnswer,
}: QuestionResult): TossupResult => {
  const formattedWords = getFormattedWords(question.formattedText);

  return {
    buzzIndex,
    formattedWords,
    isCorrect,
    score,
    tossup: question,
    userAnswer,
  };
};

const getQuestionResult = (result: TossupResult): QuestionResult => ({
  ...result,
  question: result.tossup,
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
      toast.success('power!');
    } else if (result.score === TossupScore.ten) {
      toast.success('ten!');
    }
  } else {
    toast.error('incorrect');
  }
};

const displayPromptToast = () => {
  toast('prompt', { icon: '💭' });
};

export default function TossupReader() {
  const { openTossupHistoryModal } = useModalContext();
  const { current, isFetching, results } = useSelector(selectTossupReader);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const questionResults = useMemo(
    () => results.map(getQuestionResult),
    [results],
  );

  const handleNextTossup = useCallback(
    () => dispatch(nextTossup({ settings })),
    [dispatch, settings],
  );

  const handleQuestionResult = useCallback(
    (result: QuestionResult) => {
      dispatch(submitResult(getTossupResult(result)));
      displayJudgedToast(result);
    },
    [dispatch],
  );

  const isTossupMissing = current == null;

  useKeyboardShortcut('n', handleNextTossup, {
    customAllowCondition: isTossupMissing && !isFetching,
  });

  useKeyboardShortcut('h', openTossupHistoryModal);

  if (isFetching) {
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

  if (isTossupMissing) {
    return <TealButton onClick={handleNextTossup}>Start tossups</TealButton>;
  }

  return (
    <QuestionReader
      getScore={getScore}
      onJudged={handleQuestionResult}
      onNextQuestion={handleNextTossup}
      onPrompt={displayPromptToast}
      previousResults={questionResults}
      question={current.tossup}
    />
  );
}
