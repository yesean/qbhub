import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  prompt,
  selectBonusReader,
  selectIsAnswering,
  submitAnswer,
} from '../BonusReader/bonusReaderSlice';
import Progress from '../components/reader/Progress';
import useJudge from '../hooks/useJudge';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useModalContext } from '../providers/ModalContext';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus } from '../utils/reader';
import Info from './Info';
import Result from './Result';
import Score from './Score';
import UserInput from './UserInput';
import Viewer from './Viewer';

const BonusReaderOld: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [progress, setProgress] = useState(100);
  const [buzz, setBuzz] = useState(() => () => {});
  const {
    current: {
      part: { formattedAnswer },
    },
    status,
  } = useSelector(selectBonusReader);
  const isAnswering = useSelector(selectIsAnswering);
  const dispatch = useAppDispatch();
  const { openBonusHistoryModal } = useModalContext();

  const judge = useJudge(formattedAnswer ?? '', {
    onPrompt: () => dispatch(prompt()),
    onSubmit: (isCorrect, userAnswer) =>
      dispatch(submitAnswer({ isCorrect, userAnswer })),
  });

  // reset progress on new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setProgress(100);
    }
  }, [formattedAnswer, status]);

  useKeyboardShortcut('h', openBonusHistoryModal);

  const renderInfo = () =>
    ![ReaderStatus.idle, ReaderStatus.fetching, ReaderStatus.empty].includes(
      status,
    ) && <Info />;
  const renderViewer = () =>
    status !== ReaderStatus.idle && <Viewer setBuzz={setBuzz} />;
  const renderResult = () =>
    [
      ReaderStatus.prompting,
      ReaderStatus.partialJudged,
      ReaderStatus.judged,
    ].includes(status) && <Result />;
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
      <UserInput buzz={buzz} progress={progress} submit={judge} />
    );
  const renderScore = () =>
    ![ReaderStatus.idle, ReaderStatus.empty].includes(status) && <Score />;

  return (
    <Flex
      direction="column"
      maxH="100%"
      maxW="3xl"
      overflow="auto"
      p={1}
      w="100%"
    >
      {renderInfo()}
      {renderViewer()}
      {renderResult()}
      {renderProgress()}
      {renderInput()}
      {renderScore()}
    </Flex>
  );
};

export default BonusReaderOld;