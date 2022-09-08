import { Center, Flex, Input } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import TealButton from '../TealButton';

type UserInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  text: string;
  onClick: () => void;
  submit: () => void;
  shouldSubmit: boolean;
  disabled: boolean;
  borderColor: string;
  showBorder: boolean;
  showInput: boolean;
};

const UserInput: React.FC<React.PropsWithChildren<UserInputProps>> = ({
  input,
  setInput,
  placeholder,
  text,
  onClick,
  submit,
  shouldSubmit,
  disabled,
  borderColor,
  showBorder,
  showInput,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, [disabled, setInput]);

  const renderInput = () => {
    if (!showInput) return null;

    return (
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder={placeholder}
        mb={8}
        mr={4}
        isDisabled={disabled}
        borderColor={borderColor}
        borderWidth={showBorder ? 2 : undefined}
      />
    );
  };

  return (
    <Center>
      <Flex w="100%" justify="center">
        {renderInput()}
        <TealButton onClick={onClick}>{text}</TealButton>
      </Flex>
    </Center>
  );
};

export default UserInput;
