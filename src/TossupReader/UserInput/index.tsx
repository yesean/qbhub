import { Button, Center, Flex, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { TossupScore } from '../../types/tossupReader';
import { addShortcut } from '../../utils/keyboard';
import logger from '../../utils/logger';
import {
  checkAnswer,
  convertNumberToWords,
  getAnswers,
} from '../../utils/questionReader';
import {
  buzz,
  nextTossup,
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
  useEffect(() => {
    if (status === ReaderStatus.idle)
      return addShortcut('n', () => dispatch(nextTossup()));
    if (status === ReaderStatus.reading)
      return addShortcut(' ', () => dispatch(buzz()));
    if (status === ReaderStatus.answering) return addShortcut('Enter', submit);
    if (status === ReaderStatus.answered)
      return addShortcut('n', () => dispatch(nextTossup()));
    return () => {};
  }, [dispatch, status, submit]);

  // add button behavior in different modes
  const onButtonClick = () => {
    if (status === ReaderStatus.idle) dispatch(nextTossup());
    if (status === ReaderStatus.reading) dispatch(buzz());
    if (status === ReaderStatus.answering) submit();
    if (status === ReaderStatus.answered) dispatch(nextTossup());
  };

  // set button text depending on mode
  let buttonText;
  switch (status) {
    case ReaderStatus.idle:
      buttonText = 'Start';
      break;
    case ReaderStatus.fetching:
      buttonText = '...';
      break;
    case ReaderStatus.reading:
      buttonText = 'Buzz';
      break;
    case ReaderStatus.answering:
      buttonText = 'Submit';
      break;
    case ReaderStatus.answered:
      buttonText = 'Next';
      break;
    default:
  }

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
        <Button colorScheme="cyan" color="gray.50" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </Flex>
    </Center>
  );
};

export default UserInput;
