import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Progress from '../components/reader/Progress';
import { open as openTossupHistory } from '../components/TossupHistoryModal/tossupHistoryModalSlice';
import { useKeyboardShortcut } from '../hooks/keyboard';
import useJudge from '../hooks/useJudge';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus } from '../utils/reader';
import Answer from './Answer';
import Info from './Info';
import Question from './Question';
import Result from './Result';
import Score from './Score';
import {
  prompt,
  selectIsAnswering,
  selectTossupReader,
  submitAnswer,
} from './tossupReaderSlice';
import UserInput from './UserInput';

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

  useKeyboardShortcut('h', () => dispatch(openTossupHistory()));

  const renderInfo = () =>
    ![ReaderStatus.idle, ReaderStatus.fetching, ReaderStatus.empty].includes(
      status,
    ) && <Info />;
  const renderAnswer = () => status === ReaderStatus.judged && <Answer />;
  const renderQuestion = () =>
    status !== ReaderStatus.idle && <Question setBuzz={setBuzz} />;
  const renderResult = () =>
    [ReaderStatus.prompting, ReaderStatus.judged].includes(status) && (
      <Result />
    );
  const renderProgress = () =>
    isAnswering && (
      <Progress
        progress={progress}
        setProgress={setProgress}
        shouldTick={isAnswering}
      />
    );
  const renderInput = () =>
    status !== ReaderStatus.empty && (
      <UserInput progress={progress} submit={judge} buzz={buzz} />
    );
  const renderScore = () =>
    ![ReaderStatus.idle, ReaderStatus.empty].includes(status) && <Score />;

  return (
    <Flex
      direction="column"
      w="100%"
      maxH="100%"
      maxW="3xl"
      overflow="auto"
      p={1}
    >
      {renderInfo()}
      {renderAnswer()}
      {renderQuestion()}
      {renderResult()}
      {renderProgress()}
      {renderInput()}
      {renderScore()}
    </Flex>
  );
};

export default TossupReader;
