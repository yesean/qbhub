import { Flex, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import TealButton from '../buttons/TealButton';
import {
  QuestionReaderStatus,
  getNextStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';

export default () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, setStatus } = useQuestionReaderContext();

  const handleClick = useCallback(() => {
    setStatus(getNextStatus);
  }, [setStatus]);

  // focus/blur input depending on question reader status
  useEffect(() => {
    if (status === QuestionReaderStatus.Answering) {
      if (inputRef.current != null) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    } else {
      inputRef.current?.blur();
    }
  }, [status]);

  useKeyboardShortcut(' ', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Reading,
  });

  useKeyboardShortcut('Enter', handleClick, {
    allowHTMLInput: true,
    customAllowCondition: status === QuestionReaderStatus.Answering,
  });

  useKeyboardShortcut('n', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Judged,
  });

  return (
    <Flex w="100%" justify="center">
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Answer"
        mb={8}
        mr={4}
        isDisabled={status !== QuestionReaderStatus.Answering}
        // borderColor={borderColor}
        // borderWidth={showBorder ? 2 : undefined}
      />
      <TealButton onClick={handleClick}>Buzz</TealButton>
    </Flex>
  );
};
