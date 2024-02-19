import { Heading, HStack, Text, Tooltip } from '@chakra-ui/react';
import { SelectedClue } from '@qbhub/types';

type ClueDisplayClueProps = {
  clue: SelectedClue;
};

export default function ClueDisplayClue({ clue }: ClueDisplayClueProps) {
  return (
    <Tooltip
      borderRadius="5px"
      hasArrow
      label={<TooltipLabel clue={clue} />}
      p={2}
      placement="top"
    >
      <Text whiteSpace="normal">{clue.text}</Text>
    </Tooltip>
  );
}

type TooltipLabelProps = ClueDisplayClueProps;

function TooltipLabel({ clue }: TooltipLabelProps) {
  const similarClueCount = clue.matches.length;

  return (
    <>
      <HStack justify="start" spacing={2}>
        <Heading display="inline" mb={1} size="md">
          {clue.tournament}
        </Heading>
        <Text display="inline" mb={1}>
          ({similarClueCount} similar clues)
        </Text>
      </HStack>
      <TooltipLabelBody clue={clue} />
    </>
  );
}

type TooltipLabelBodyProps = ClueDisplayClueProps;

function TooltipLabelBody({ clue }: TooltipLabelBodyProps) {
  const startIndex = clue.sentence.indexOf(clue.text);
  if (startIndex === -1) {
    return <Text>{clue.sentence}</Text>;
  }
  return (
    <>
      <Text display="inline">{clue.sentence.substring(0, startIndex)}</Text>
      <Text as="mark" bgColor="#fffea9" display="inline">
        {clue.sentence.substring(startIndex, startIndex + clue.text.length)}
      </Text>
      <Text display="inline">
        {clue.sentence.substring(startIndex + clue.text.length)}
      </Text>
    </>
  );
}
