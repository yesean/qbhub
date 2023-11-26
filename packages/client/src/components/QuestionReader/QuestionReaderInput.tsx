import { Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import TealButton from '../buttons/TealButton';
import {
  QuestionReaderStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';

const updateStatus = (
  prevStatus: QuestionReaderStatus,
): QuestionReaderStatus => {
  switch (prevStatus) {
    case QuestionReaderStatus.Reading:
      return QuestionReaderStatus.Answering;
    case QuestionReaderStatus.Answering:
      return QuestionReaderStatus.Judged;
    case QuestionReaderStatus.Judged:
      return QuestionReaderStatus.Reading;
  }
};

export default () => {
  const [input, setInput] = useState('');
  const { setStatus } = useQuestionReaderContext();

  return (
    <Flex w="100%" justify="center">
      <Input
        // ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Answer"
        mb={8}
        mr={4}
        // isDisabled={disabled}
        // borderColor={borderColor}
        // borderWidth={showBorder ? 2 : undefined}
      />
      <TealButton onClick={() => setStatus((status) => updateStatus(status))}>
        Buzz
      </TealButton>
    </Flex>
  );
};
