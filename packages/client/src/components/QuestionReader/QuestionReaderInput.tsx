import { Flex, Input } from '@chakra-ui/react';
import { QuestionResult } from '@qbhub/types';
import { QuestionReaderStatus } from '../../utils/questionReader';
import TealButton from '../buttons/TealButton';

// get input border color for tossup results, green/red for correct/incorrect
const getInputBorderColor = (
  status: QuestionReaderStatus,
  questionResult?: QuestionResult,
): string => {
  if (status !== QuestionReaderStatus.Judged || questionResult == null)
    return 'gray.300';

  if (questionResult.isCorrect) return 'green.400';
  return 'red.400';
};

// get button text depending on reader status
const getButtonText = (status: QuestionReaderStatus): string => {
  switch (status) {
    case QuestionReaderStatus.Reading:
      return 'Buzz';
    case QuestionReaderStatus.Answering:
      return 'Submit';
    case QuestionReaderStatus.Judged:
      return 'Next';
  }
};

type QuestionReaderInputProps = {
  currentResult: QuestionResult | undefined;
  inputRef: React.RefObject<HTMLInputElement>;
  onClick: () => void;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  status: QuestionReaderStatus;
  userInput: string;
};

export default function QuestionReaderInput({
  currentResult,
  inputRef,
  onClick,
  setUserInput,
  status,
  userInput,
}: QuestionReaderInputProps) {
  const shouldShowBorder = status === QuestionReaderStatus.Judged;
  const shouldDisableInput = status !== QuestionReaderStatus.Answering;

  return (
    <Flex justify="center" w="100%">
      <Input
        ref={inputRef}
        borderColor={getInputBorderColor(status, currentResult)}
        borderWidth={shouldShowBorder ? 2 : undefined}
        isDisabled={shouldDisableInput}
        mr={4}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Answer"
        value={userInput}
      />
      <TealButton onClick={onClick}>{getButtonText(status)}</TealButton>
    </Flex>
  );
}
