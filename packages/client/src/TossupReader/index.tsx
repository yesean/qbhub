import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Progress from '../components/reader/Progress';
import useJudge from '../hooks/useJudge';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus } from '../utils/reader';
import Answer from './Answer';
import Info from './Info';
import Question from './Question';
import Result from './Result';
import Score from './Score';
import UserInput from './UserInput';
import {
  prompt,
  selectIsAnswering,
  selectTossupReader,
  submitAnswer,
} from './tossupReaderSlice';

const TossupReader = () => {
  const [progress, setProgress] = useState(100);
  const [buzz, setBuzz] = useState(() => () => {});
  const {
    status,
    current: {
      tossup: { formattedAnswer },
    },
  } = useSelector(selectTossupReader);
  const isAnswering = useSelector(selectIsAnswering);
  const { openTossupHistoryModal } = useModalContext();
  const dispatch = useAppDispatch();

  const judge = useJudge(formattedAnswer ?? '', {
    onPrompt: () => dispatch(prompt()),
    onSubmit: (isCorrect, userAnswer) =>
      dispatch(submitAnswer({ isCorrect, userAnswer })),
  });

  // reset judge and progress on new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setProgress(100);
    }
  }, [status, formattedAnswer]);

  useKeyboardShortcut('h', openTossupHistoryModal);

  const shouldRenderInfo = ![
    ReaderStatus.idle,
    ReaderStatus.fetching,
    ReaderStatus.empty,
  ].includes(status);
  const shouldRenderAnswer = status === ReaderStatus.judged;
  const shouldRenderQuestion = status !== ReaderStatus.idle;
  const shouldRenderResult = [
    ReaderStatus.prompting,
    ReaderStatus.judged,
  ].includes(status);
  const shouldRenderProgress = isAnswering;
  const shouldRenderInput = status !== ReaderStatus.empty;
  const shouldRenderScore = ![ReaderStatus.idle, ReaderStatus.empty].includes(
    status,
  );

  return (
    <Flex
      direction="column"
      w="100%"
      maxH="100%"
      maxW="3xl"
      overflow="auto"
      p={1}
    >
      {shouldRenderInfo && <Info />}
      {shouldRenderAnswer && <Answer />}
      {shouldRenderQuestion && <Question setBuzz={setBuzz} />}
      {shouldRenderResult && <Result />}
      {shouldRenderProgress && (
        <Progress
          progress={progress}
          setProgress={setProgress}
          shouldTick={isAnswering}
        />
      )}
      {shouldRenderInput && (
        <UserInput progress={progress} submit={judge} buzz={buzz} />
      )}
      {shouldRenderScore && <Score />}
    </Flex>
  );
};

export default TossupReader;
