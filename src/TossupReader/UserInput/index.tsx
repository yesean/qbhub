import { Center, Flex, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import TealButton from '../../components/TealButton';
import { selectSettings } from '../../Settings/settingsSlice';
import { TossupScore } from '../../types/tossups';
import { addShortcut } from '../../utils/keyboard';
import logger from '../../utils/logger';
import {
  checkAnswer,
  convertNumberToWords,
  getAnswers,
} from '../../utils/questionReader';
import {
  buzz as buzzAction,
  nextTossup as nextTossupAction,
  ReaderStatus,
  selectCurrentBuzz,
  selectCurrentResult,
  selectCurrentTossup,
  selectStatus,
  submitAnswer,
} from '../tossupReaderSlice';

type UserInputProps = {
  progress: number;
};
const UserInput: React.FC<UserInputProps> = ({ progress }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const status = useSelector(selectStatus);
  const currentTossup = useSelector(selectCurrentTossup);
  const currentResult = useSelector(selectCurrentResult);
  const currentBuzz = useSelector(selectCurrentBuzz);
  const { isOpen } = useSelector(selectSettings);
  const dispatch = useAppDispatch();

  // focus input when user is answering, blur otherwise
  useEffect(() => {
    if (inputRef.current !== null) {
      if (status === ReaderStatus.answering) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [status]);

  // reset input when fetching a new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setInputValue('');
    }
  }, [status]);

  // process a user's answer when submitting
  const submit = useCallback(() => {
    if (status === ReaderStatus.answering) {
      const submittedAnswer = convertNumberToWords(
        inputValue.trim().toLowerCase(),
      );
      const answers = getAnswers(currentTossup.formattedAnswer);
      const isAnswerCorrect = checkAnswer(submittedAnswer, answers);

      logger.info(`User submitted "${submittedAnswer}"`);
      logger.info('Buzz:', currentBuzz);
      logger.info('Processed answers:', answers);

      let score;
      if (isAnswerCorrect) {
        score = currentBuzz.isPower ? TossupScore.power : TossupScore.ten;
      } else {
        score = TossupScore.neg;
      }

      const result = {
        tossup: currentTossup,
        isCorrect: isAnswerCorrect,
        score,
        submittedAnswer,
        buzz: currentBuzz,
      };

      dispatch(submitAnswer(result));
    }
  }, [currentBuzz, currentTossup, dispatch, inputValue, status]);

  useEffect(() => {
    if (progress === 0) {
      submit();
    }
  }, [progress, submit]);

  // add keyboard shortcuts
  const buzz = useCallback(() => dispatch(buzzAction()), [dispatch]);
  const next = useCallback(() => dispatch(nextTossupAction()), [dispatch]);
  useEffect(() => addShortcut('n', next, [!isOpen]), [next, isOpen]);
  useEffect(() => addShortcut(' ', buzz, [!isOpen]), [buzz, isOpen]);
  useEffect(() => addShortcut('Enter', submit, [!isOpen]), [submit, isOpen]);

  // add button behavior in different modes
  const statusBehavior: { [key in ReaderStatus]?: any } = {
    [ReaderStatus.idle]: next,
    [ReaderStatus.reading]: buzz,
    [ReaderStatus.answering]: submit,
    [ReaderStatus.answered]: next,
  };
  const onButtonClick = () => statusBehavior[status]();

  // set button text depending on mode
  const statusText: { [key in ReaderStatus]?: string } = {
    [ReaderStatus.idle]: 'Start',
    [ReaderStatus.fetching]: '...',
    [ReaderStatus.reading]: 'Buzz',
    [ReaderStatus.answering]: 'Submit',
    [ReaderStatus.answered]: 'Next',
  };
  const buttonText = statusText[status];

  // set input border depending on user correctness
  let inputBorderColor;
  if (status === ReaderStatus.answered)
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
            placeholder="Answer:"
            mb={8}
            mr={4}
            isDisabled={status !== ReaderStatus.answering}
            borderColor={inputBorderColor}
            borderWidth={status === ReaderStatus.answered ? 2 : undefined}
          />
        )}
        <TealButton onClick={onButtonClick}>{buttonText}</TealButton>
      </Flex>
    </Center>
  );
};

export default UserInput;
