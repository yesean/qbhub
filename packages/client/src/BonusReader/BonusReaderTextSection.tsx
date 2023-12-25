import { Box, Flex, Text } from '@chakra-ui/react';
import { PartialOptional } from '@qbhub/types';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { getBonusLeadinDelimiterIndex } from '../utils/reader';

type SelectedQuestionContentDisplayProps = Omit<
  QuestionContentDisplayProps,
  'question' | 'status'
>;

type BonusReaderTextSectionProps = PartialOptional<
  SelectedQuestionContentDisplayProps,
  'visibleIndex' | 'visibleRef'
>;

// Display bonus part text
// part one is displayed as two sections: leadin + part one text
// part two and three are each displayed as one normal section
export default function BonusReaderTextSection({
  buzzIndex,
  visibleIndex,
  visibleRef,
  words,
}: BonusReaderTextSectionProps) {
  const leadinDelimiterIndex = getBonusLeadinDelimiterIndex(words);

  // part two and three of bonus
  if (leadinDelimiterIndex === undefined) {
    return (
      <PrefixedFormattedQuestion
        buzzIndex={buzzIndex}
        prefix="[10]"
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={words}
      />
    );
  }

  // part one of bonus
  // part one text needs to be offset by the leadin
  const nonleadinStartIndex = leadinDelimiterIndex + 1;
  const nonleadinBuzzIndex =
    buzzIndex === undefined ? undefined : buzzIndex - nonleadinStartIndex;
  const nonleadinVisibleIndex =
    visibleIndex === undefined ? undefined : visibleIndex - nonleadinStartIndex;
  const isReadingLeadin =
    visibleIndex !== undefined && visibleIndex < leadinDelimiterIndex;
  return (
    <Flex direction="column" gap={2}>
      <PrefixedFormattedQuestion
        buzzIndex={buzzIndex}
        prefix="BONUS:"
        visibleIndex={visibleIndex}
        visibleRef={isReadingLeadin ? visibleRef : undefined}
        words={words.slice(0, leadinDelimiterIndex)}
      />
      <PrefixedFormattedQuestion
        buzzIndex={nonleadinBuzzIndex}
        prefix={isReadingLeadin ? '' : '[10]'} // hide [10] while reading leadin
        visibleIndex={nonleadinVisibleIndex}
        visibleRef={isReadingLeadin ? undefined : visibleRef}
        words={words.slice(nonleadinStartIndex)}
      />
    </Flex>
  );
}

type TextSectionProps = BonusReaderTextSectionProps & { prefix: string };

// Display a formatted question with a bold prefix
function PrefixedFormattedQuestion({
  buzzIndex,
  prefix,
  visibleIndex,
  visibleRef,
  words,
}: TextSectionProps) {
  return (
    <Box>
      <Text as="b">{prefix}</Text>{' '}
      <FormattedQuestion
        buzzIndex={buzzIndex}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={words}
      />
    </Box>
  );
}
