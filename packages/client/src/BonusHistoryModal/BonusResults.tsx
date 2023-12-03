import { Box, Flex, Text } from '@chakra-ui/react';
import { Bonus, BonusPart, BonusPartResult } from '@qbhub/types';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { VirtualizedTable, VirtualizedTableColumn } from '../components/tables';
import { TOURNAMENT_MAP } from '../utils/constants';
import { getFormattedWords } from '../utils/reader';
import { parseHTMLString } from '../utils/string';

type BonusPartRowResult = BonusPartResult & { bonus: Bonus; part: BonusPart };
type BonusResultProps = {
  results: BonusPartRowResult[];
};

const cells: { [key: string]: (result: BonusPartRowResult) => JSX.Element } = {
  answer: ({ part: { formattedAnswer } }) => (
    <Box overflowWrap="break-word" textAlign="center">
      {parseHTMLString(formattedAnswer)}
    </Box>
  ),
  input: ({ userAnswer }) => (
    <Box overflowWrap="break-word" textAlign="center">
      {userAnswer || '<no answer>'}
    </Box>
  ),
  part: ({ number }) => <Text align="center">{number}</Text>,
  question: ({ buzzIndex, part: { formattedText } }) => (
    <Flex flexWrap="wrap">
      <FormattedQuestion
        buzzIndex={buzzIndex}
        words={getFormattedWords(formattedText)}
      />
    </Flex>
  ),
  tournament: ({ bonus: { tournament } }) => (
    <Box>{TOURNAMENT_MAP[tournament].name}</Box>
  ),
};

const BonusResults: React.FC<React.PropsWithChildren<BonusResultProps>> = ({
  results,
}) => {
  const columns: VirtualizedTableColumn<BonusPartRowResult>[] = [
    {
      cell: cells.part,
      label: 'Part',
      minWidth: 40,
      proportion: 1,
      useForHeight: false,
    },
    {
      cell: cells.input,
      label: 'Input',
      minWidth: 120,
      proportion: 1,
      useForHeight: false,
    },
    {
      cell: cells.answer,
      label: 'Answer',
      minWidth: 120,
      proportion: 2,
      useForHeight: true,
    },
    {
      cell: cells.question,
      label: 'Question',
      minWidth: 150,
      proportion: 4,
      useForHeight: true,
    },
    {
      cell: cells.tournament,
      label: 'Tournament',
      minWidth: 105,
      proportion: 3,
      useForHeight: false,
    },
  ];

  return (
    <VirtualizedTable
      columns={columns}
      results={results}
      rowColor={(result) => (result.isCorrect ? 'green.200' : 'red.200')}
    />
  );
};

export default BonusResults;
