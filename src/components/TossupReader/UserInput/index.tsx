import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Flex, Input } from '@chakra-ui/react';

import { TossupContext } from '../../../services/TossupContext';
import { Mode, ModeContext } from '../../../services/ModeContext';

const UserInput: React.FC = () => {
  const { mode, setMode } = useContext(ModeContext);
  const { refreshTossup } = useContext(TossupContext);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  let buttonText = '';
  if (mode === Mode.start) buttonText = 'Start';
  else if (mode === Mode.fetchingTossup) buttonText = 'Buzz';
  else if (mode === Mode.reading) buttonText = 'Buzz';
  else if (mode === Mode.answering) buttonText = 'Submit';
  else if (mode === Mode.revealed) buttonText = 'Next';

  useEffect(() => {
    if (inputRef.current !== null) {
      if (mode === Mode.answering) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [mode]);

  useEffect(() => {
    if (mode === Mode.reading) {
      setInputValue('');
    }
  }, [mode]);

  useEffect(() => {
    if (mode === Mode.revealed) {
      console.log(`submitted ${inputValue} as answer`);
    }
  }, [mode, inputValue]);

  const onButtonClick = () => {
    if (mode === Mode.start) {
      refreshTossup();
    }
    if (mode === Mode.reading) setMode(Mode.answering);
    if (mode === Mode.answering) setMode(Mode.revealed);
    if (mode === Mode.revealed) {
      refreshTossup();
    }
  };

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
          borderColor={mode === Mode.revealed ? 'red.400' : undefined}
          borderWidth={mode === Mode.revealed ? 2 : undefined}
        />
      )}
      <Button colorScheme="green" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Flex>
  );
};

export default UserInput;
