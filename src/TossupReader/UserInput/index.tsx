import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button, Flex, Input } from '@chakra-ui/react';

import { TossupContext } from '../../services/TossupContext';
import { Mode, ModeContext } from '../../services/ModeContext';
import { TossupResultContext } from '../../services/TossupResultContext';
import { addShortcut, checkAnswer, getAnswers } from '../../services/utils';
import { TossupScore } from '../../types/tossupReader';
import logger from '../../services/logger';
import { TossupBuzzContext } from '../../services/TossupBuzzContext';

const UserInput: React.FC = () => {
  const { mode, setMode } = useContext(ModeContext);
  const { buzz, setBuzz } = useContext(TossupBuzzContext);
  const {
    tossup: { formattedAnswer },
  } = useContext(TossupContext);
  const { result, setResult } = useContext(TossupResultContext);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // focus input when user is answering, blur otherwise
  useEffect(() => {
    if (inputRef.current !== null) {
      if (mode === Mode.answering) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [mode]);

  // reset input when fetching a new tossup
  useEffect(() => {
    if (mode === Mode.fetchingTossup) {
      setInputValue('');
    }
  }, [mode]);

  // process a user's answer when submitting
  useEffect(() => {
    if (buzz !== null && mode === Mode.submitting) {
      logger.info('buzz: ', buzz);
      const submittedAnswer = inputValue.trim().toLowerCase();
      const answers = getAnswers(formattedAnswer);
      logger.info('answers: ', answers);
      const isAnswerCorrect = checkAnswer(submittedAnswer, answers);
      let score;
      if (isAnswerCorrect) {
        score = buzz.isInPower ? TossupScore.power : TossupScore.ten;
      } else {
        score = TossupScore.neg;
      }
      setResult({
        isCorrect: isAnswerCorrect,
        score,
        submittedAnswer,
        buzz,
      });
      setMode(Mode.revealed);
    }
  }, [mode, setMode, inputValue, formattedAnswer, setResult, buzz, setBuzz]);

  // get new tossup
  const nextTossup = useCallback(() => {
    setMode(Mode.fetchingTossup);
    setResult(null);
    setBuzz(null);
  }, [setResult, setBuzz, setMode]);

  // prompt user for answer
  const promptUser = useCallback(() => {
    setMode(Mode.answering);
  }, [setMode]);

  // submit user inputted answer
  const submitAnswer = useCallback(() => {
    setMode(Mode.submitting);
  }, [setMode]);

  // add keyboard shortcuts
  useEffect(() => {
    if (mode === Mode.start) return addShortcut('n', nextTossup);
    if (mode === Mode.reading) return addShortcut(' ', promptUser);
    if (mode === Mode.answering) return addShortcut('Enter', submitAnswer);
    if (mode === Mode.revealed) return addShortcut('n', nextTossup);
    return () => {};
  }, [mode, nextTossup, promptUser, submitAnswer]);

  // add button behavior in different modes
  const onButtonClick = () => {
    if (mode === Mode.start) nextTossup();
    if (mode === Mode.reading) promptUser();
    if (mode === Mode.answering) submitAnswer();
    if (mode === Mode.revealed) nextTossup();
  };

  // set button text depending on mode
  let buttonText = '';
  if (mode === Mode.start) buttonText = 'Start';
  else if (mode === Mode.fetchingTossup) buttonText = '...';
  else if (mode === Mode.reading) buttonText = 'Buzz';
  else if (mode === Mode.answering) buttonText = 'Submit';
  else if (mode === Mode.revealed) buttonText = 'Next';

  // set input border depending on user correctness
  let inputBorderColor;
  if (mode === Mode.revealed && result !== null)
    inputBorderColor = result.isCorrect ? 'green.400' : 'red.400';

  // only show start button at start
  const shouldShowInput = mode !== Mode.start;

  return (
    <Flex w="100%" justify="center">
      {shouldShowInput && (
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          placeholder="Answer:"
          mb={8}
          mr={4}
          isDisabled={mode !== Mode.answering}
          borderColor={inputBorderColor}
          borderWidth={mode === Mode.revealed ? 2 : undefined}
        />
      )}
      <Button colorScheme="cyan" color="gray.50" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Flex>
  );
};

export default UserInput;
