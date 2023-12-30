import { Heading, Text, Tooltip } from '@chakra-ui/react';
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
      <Text>{clue.text}</Text>
    </Tooltip>
  );
}

type TooltipLabelProps = ClueDisplayClueProps;

function TooltipLabel({ clue }: TooltipLabelProps) {
  const startIndex = clue.sentence.indexOf(clue.text);
  if (startIndex === -1) {
    return (
      <>
        <Heading mb={1} size="sm">
          {clue.tournament}
        </Heading>
        <Text>{clue.sentence}</Text>
      </>
    );
  }
  return (
    <>
      <Heading mb={1} size="sm">
        {clue.tournament}
      </Heading>
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
