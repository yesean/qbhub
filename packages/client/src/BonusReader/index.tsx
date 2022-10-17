import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Progress from '../components/reader/Progress';
import { useAppDispatch } from '../redux/hooks';
import { JudgeResult } from '../types/tossups';
import logger from '../utils/logger';
import { Judge, normalizeAnswer } from '../utils/reader';
import {
  prompt,
  ReaderStatus,
  selectBonusReader,
  selectIsAnswering,
  submitAnswer,
} from './bonusReaderSlice';
import Info from './Info';
import Result from './Result';
import Score from './Score';
import UserInput from './UserInput';
import Viewer from './Viewer';

const BonusReader: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [progress, setProgress] = useState(100);
  const [judge, setJudge] = useState<Judge>();
  const {
    status,
    current: { part },
  } = useSelector(selectBonusReader);
  const isAnswering = useSelector(selectIsAnswering);
  const dispatch = useAppDispatch();

  // reset judge and progress on new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setJudge(new Judge(part.formattedAnswer));
      setProgress(100);
    }
  }, [part.formattedAnswer, status]);

  // process a user's answer when submitting
  const submit = useCallback(
    (input: string) => {
      if (judge === undefined || !isAnswering) return;

      // judge the user answer
      const userAnswer = normalizeAnswer(input);
      logger.info(`User submitted "${userAnswer}".`);
      const judgeResult = judge.judge(userAnswer);

      // either prompt on answer or mark it as correct/incorrect
      if (judgeResult === JudgeResult.prompt) {
        // prompt on answer
        logger.info(`Prompting on "${userAnswer}".`);
        dispatch(prompt());
      } else {
        // submit answer
        const isCorrect = judgeResult === JudgeResult.correct;
        logger.info(
          `User answer "${userAnswer}" is ${
            isCorrect ? 'correct' : 'incorrect'
          }.`,
        );
        dispatch(
          submitAnswer({
            isCorrect,
            userAnswer: input,
          }),
        );
      }
    },
    [dispatch, isAnswering, judge],
  );

  const renderInfo = () =>
    ![ReaderStatus.idle, ReaderStatus.fetching, ReaderStatus.empty].includes(
      status,
    ) && <Info />;
  const renderViewer = () => status !== ReaderStatus.idle && <Viewer />;
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
      <UserInput progress={progress} submit={submit} />
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
      {renderViewer()}
      {renderResult()}
      {renderProgress()}
      {renderInput()}
      {renderScore()}
    </Flex>
  );
};

export default BonusReader;
