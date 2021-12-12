import { Center, Flex, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import TealButton from '../components/TealButton';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { selectSettings } from '../Settings/settingsSlice';
import { JudgeResult } from '../types/tossups';
import logger from '../utils/logger';
import { getTossupScore, Judge } from '../utils/reader';
import { convertNumberToWords } from '../utils/string';
import {
  buzz as buzzAction,
  nextTossup as nextTossupAction,
  prompt,
  ReaderStatus,
  selectTossupReader,
  submitAnswer,
} from './tossupReaderSlice';

type UserInputProps = {
  progress: number;
};
const UserInput: React.FC<UserInputProps> = ({ progress }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, currentTossup, currentResult, currentBuzz } =
    useSelector(selectTossupReader);
  const settings = useSelector(selectSettings);
  const [inputValue, setInputValue] = useState('');
  const [judge, setJudge] = useState<Judge>();
  const dispatch = useAppDispatch();

  const isAnswering = useMemo(
    () => [ReaderStatus.answering, ReaderStatus.prompting].includes(status),
    [status],
  );

  // focus input when user is answering, blur otherwise
  useEffect(() => {
    if (inputRef.current !== null) {
      if (isAnswering) {
        setInputValue('');
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [isAnswering, status]);

  // reset input when fetching a new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setInputValue('');
      setJudge(new Judge(currentTossup.formattedAnswer));
    }
  }, [currentTossup.formattedAnswer, status]);

  // process a user's answer when submitting
  const submit = useCallback(() => {
    if (judge === undefined) return;

    // judge the user answer
    const userAnswer = convertNumberToWords(inputValue.trim().toLowerCase());
    logger.info(`User submitted "${userAnswer}".`);
    const judgeResult = judge.judge(userAnswer);

    // prompt on answer
    if (judgeResult === JudgeResult.prompt) {
      logger.info(`Prompting on "${userAnswer}".`);
      dispatch(prompt());
      return;
    }

    // submit answer
    const isCorrect = judgeResult === JudgeResult.correct;
    const result = {
      tossup: currentTossup,
      isCorrect,
      score: getTossupScore(isCorrect, currentBuzz.isPower),
      userAnswer,
      buzz: currentBuzz,
    };
    logger.info(
      `User answer "${userAnswer}" is ${
        isCorrect ? `correct for ${result.score}` : 'incorrect'
      }.`,
    );
    logger.info('Buzz:', currentBuzz);
    dispatch(submitAnswer(result));
  }, [currentBuzz, currentTossup, dispatch, inputValue, judge]);

  // if timer ends, forcefully submit user answer
  useEffect(() => {
    if (progress === 0) {
      submit();
    }
  }, [progress, submit]);

  // add keyboard shortcuts
  const buzz = useCallback(() => dispatch(buzzAction()), [dispatch]);
  const next = useCallback(() => dispatch(nextTossupAction()), [dispatch]);
  useKeyboardShortcut('n', next, () => !settings.isOpen);
  useKeyboardShortcut(' ', buzz, () => !settings.isOpen);
  useKeyboardShortcut('Enter', submit, () => !settings.isOpen && isAnswering);

  // add button behavior in different modes
  const statusBehavior: { [key in ReaderStatus]?: any } = {
    [ReaderStatus.idle]: next,
    [ReaderStatus.reading]: buzz,
    [ReaderStatus.answering]: submit,
    [ReaderStatus.judged]: next,
  };
  const onButtonClick = () => statusBehavior[status]();

  // set button text depending on mode
  const statusText: { [key in ReaderStatus]?: string } = {
    [ReaderStatus.idle]: 'Start',
    [ReaderStatus.fetching]: '...',
    [ReaderStatus.reading]: 'Buzz',
    [ReaderStatus.answering]: 'Submit',
    [ReaderStatus.prompting]: 'Submit',
    [ReaderStatus.judged]: 'Next',
  };
  const buttonText = statusText[status];

  const inputPlaceholder =
    status === ReaderStatus.prompting ? 'Prompt:' : 'Answer:';

  // set input border depending on user correctness
  let inputBorderColor;
  if (status === ReaderStatus.judged)
    inputBorderColor = currentResult.isCorrect ? 'green.400' : 'red.400';

  // only show start button at start
  const shouldShowInput = status !== ReaderStatus.idle;

  return (
    <Center>
      <Flex w="100%" justify="center">
        {shouldShowInput && (
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            placeholder={inputPlaceholder}
            mb={8}
            mr={4}
            isDisabled={!isAnswering}
            borderColor={inputBorderColor}
            borderWidth={status === ReaderStatus.judged ? 2 : undefined}
          />
        )}
        <TealButton onClick={onButtonClick}>{buttonText}</TealButton>
      </Flex>
    </Center>
  );
};

export default UserInput;
