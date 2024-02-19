import { HStack, Icon, IconButton, Input, Tooltip } from '@chakra-ui/react';
import { QuestionResult } from '@qbhub/types';

import ArrowLeftRight from '../../static/ArrowsRightLeft.svg?react';
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
  onJudgeResultChangeClick: () => void;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  status: QuestionReaderStatus;
  userInput: string;
};

export default function QuestionReaderInput({
  currentResult,
  inputRef,
  onClick,
  onJudgeResultChangeClick,
  setUserInput,
  status,
  userInput,
}: QuestionReaderInputProps) {
  const shouldShowBorder = status === QuestionReaderStatus.Judged;
  const shouldDisableInput = status !== QuestionReaderStatus.Answering;
  const shouldShowJudgeResultChange = currentResult !== undefined;

  return (
    <HStack spacing={2} w="100%">
      <Input
        ref={inputRef}
        borderColor={getInputBorderColor(status, currentResult)}
        borderWidth={shouldShowBorder ? 2 : undefined}
        isDisabled={shouldDisableInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Answer"
        value={userInput}
      />
      {shouldShowJudgeResultChange && (
        <Tooltip
          hasArrow
          label={
            currentResult.isCorrect
              ? 'Mark answer as incorrect'
              : 'Mark answer as correct'
          }
        >
          <IconButton
            aria-label="Change judge result"
            flex="0 0 45px"
            icon={<Icon as={ArrowLeftRight} h="50%" w="50%" />}
            onClick={onJudgeResultChangeClick}
          />
        </Tooltip>
      )}
      <TealButton onClick={onClick}>{getButtonText(status)}</TealButton>
    </HStack>
  );
}
