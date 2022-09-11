import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import Progress from '../components/reader/Progress';
import { JudgeResult } from '../types/tossups';
import logger from '../utils/logger';
import { Judge, normalizeAnswer } from '../utils/reader';
import Answer from './Answer';
import Info from './Info';
import Question from './Question';
import Result from './Result';
import Score from './Score';
import {
  prompt,
  ReaderStatus,
  selectIsAnswering,
  selectTossupReader,
  submitAnswer,
} from './tossupReaderSlice';
import UserInput from './UserInput';

const TossupReader = () => {
  const [progress, setProgress] = useState(100);
  const [judge, setJudge] = useState<Judge>();
  const {
    status,
    current: { tossup },
  } = useSelector(selectTossupReader);
  const isAnswering = useSelector(selectIsAnswering);
  const dispatch = useAppDispatch();

  // reset judge and progress on new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setJudge(new Judge(tossup.formattedAnswer));
      setProgress(100);
    }
  }, [status, tossup.formattedAnswer]);

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
            userAnswer,
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
  const renderAnswer = () => status === ReaderStatus.judged && <Answer />;
  const renderQuestion = () => status !== ReaderStatus.idle && <Question />;
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
