import { Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Answer from './Answer';
import Info from './Info';
import Progress from './Progress';
import Question from './Question';
import Result from './Result';
import Score from './Score';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';
import UserInput from './UserInput';

type TossupReaderProps = {};

const TossupReader: React.FC<TossupReaderProps> = () => {
  const [progress, setProgress] = useState(100);
  const { status } = useSelector(selectTossupReader);

  const isAnswering = useMemo(
    () => [ReaderStatus.answering, ReaderStatus.prompting].includes(status),
    [status],
  );

  useEffect(() => {
    if (isAnswering) {
      setProgress(100);
    }
  }, [isAnswering, status]);

  const renderInfo = () =>
    ![ReaderStatus.idle, ReaderStatus.fetching, ReaderStatus.empty].includes(
      status,
    ) && <Info />;
  const renderAnswer = () => status === ReaderStatus.judged && <Answer />;
  const renderQuestion = () => status !== ReaderStatus.idle && <Question />;
  const renderResult = () =>
    [ReaderStatus.prompting, ReaderStatus.judged].includes(status) && (
      <Result />
    );
  const renderProgress = () =>
    isAnswering && <Progress progress={progress} setProgress={setProgress} />;
  const renderInput = () =>
    status !== ReaderStatus.empty && <UserInput progress={progress} />;
  const renderScore = () =>
    ![ReaderStatus.idle, ReaderStatus.empty].includes(status) && <Score />;

  return (
    <Flex
      direction="column"
      w="100%"
      maxH="100%"
      maxW="3xl"
      padding={4}
      overflow="auto"
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
