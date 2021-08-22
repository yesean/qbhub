import { useContext } from 'react';
import { Button, Flex, Input } from '@chakra-ui/react';

import { TossupContext } from '../../../services/TossupContext';
import { Mode, ModeContext } from '../../../services/ModeContext';

const UserInput: React.FC = () => {
  const { mode, setMode } = useContext(ModeContext);
  const { refreshTossup } = useContext(TossupContext);

  let buttonText = '';
  if (mode === Mode.start) buttonText = 'Start';
  else if (mode === Mode.reading) buttonText = 'Buzz';
  else if (mode === Mode.answering) buttonText = 'Submit';
  else if (mode === Mode.revealed) buttonText = 'Next';

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

  const shouldShowInput = mode !== Mode.start && mode !== Mode.fetchingTossup;

  return (
    <Flex w="100%" justify="center">
      {shouldShowInput && (
        <Input placeholder="Answer:" mb={8} mr={4} isDisabled />
      )}
      <Button colorScheme="green" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </Flex>
  );
};

export default UserInput;
