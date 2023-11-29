import { Center, Flex, Input } from '@chakra-ui/react';
import { useEffect } from 'react';
import TealButton from '../buttons/TealButton';

type UserInputProps = {
  borderColor: string;
  disabled: boolean;
  input: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onClick: () => void;
  placeholder: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  shouldSubmit: boolean;
  showBorder: boolean;
  showInput: boolean;
  submit: () => void;
  text: string;
};

const UserInput: React.FC<React.PropsWithChildren<UserInputProps>> = ({
  borderColor,
  disabled,
  input,
  inputRef,
  onClick,
  placeholder,
  setInput,
  shouldSubmit,
  showBorder,
  showInput,
  submit,
  text,
}) => {
  useEffect(() => {
    if (shouldSubmit) submit();
  }, [shouldSubmit, submit]);

  // focus input when user is answering, blur otherwise
  useEffect(() => {
    if (inputRef.current !== null) {
      if (disabled) {
        inputRef.current.blur();
      } else {
        inputRef.current.focus();
      }
    }
  }, [disabled, inputRef]);

  const renderInput = () => {
    if (!showInput) return null;

    return (
      <Input
        ref={inputRef}
        borderColor={borderColor}
        borderWidth={showBorder ? 2 : undefined}
        isDisabled={disabled}
        mb={8}
        mr={4}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder={placeholder}
        value={input}
      />
    );
  };

  return (
    <Center>
      <Flex justify="center" w="100%">
        {renderInput()}
        <TealButton onClick={onClick}>{text}</TealButton>
      </Flex>
    </Center>
  );
};

export default UserInput;
