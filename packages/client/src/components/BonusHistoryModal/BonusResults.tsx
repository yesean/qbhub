import { Box, Flex, Text } from '@chakra-ui/react';
import { Bonus, BonusPart, BonusPartResult } from '../../types/bonus';
import { TOURNAMENT_MAP } from '../../utils/constants';
import { getTossupWords, renderQuestion } from '../../utils/reader';
import { parseHTMLString } from '../../utils/string';
import { VirtualizedTable, VirtualizedTableColumn } from '../tables';

type BonusPartRowResult = BonusPartResult & { bonus: Bonus; part: BonusPart };
type BonusResultProps = {
  results: BonusPartRowResult[];
};

const cells: { [key: string]: (result: BonusPartRowResult) => JSX.Element } = {
  part: ({ number }) => <Text align="center">{number}</Text>,
  input: ({ userAnswer }) => (
    <Box textAlign="center" overflowWrap="break-word">
      {userAnswer || '<no answer>'}
    </Box>
  ),
  answer: ({ part: { formattedAnswer } }) => (
    <Box textAlign="center" overflowWrap="break-word">
      {parseHTMLString(formattedAnswer)}
    </Box>
  ),
  question: ({ part: { formattedText }, buzzIndex }) => (
    <Flex flexWrap="wrap">
      {renderQuestion(getTossupWords(formattedText), {
        buzz: buzzIndex,
      })}
    </Flex>
  ),
  tournament: ({ bonus: { tournament } }) => (
    <Box>{TOURNAMENT_MAP[tournament].name}</Box>
  ),
}

const BonusResults: React.FC<React.PropsWithChildren<BonusResultProps>> = ({
  results,
}) => {
  const columns: VirtualizedTableColumn<BonusPartRowResult>[] = [
    {
      label: 'Part',
      proportion: 1,
      minWidth: 40,
      useForHeight: false,
      cell: cells.part,
    },
    {
      label: 'Input',
      proportion: 1,
      minWidth: 120,
      useForHeight: false,
      cell: cells.input,
    },
    {
      label: 'Answer',
      proportion: 2,
      minWidth: 120,
      useForHeight: true,
      cell: cells.answer,
    },
    {
      label: 'Question',
      proportion: 4,
      minWidth: 150,
      useForHeight: true,
      cell: cells.question,
    },
    {
      label: 'Tournament',
      proportion: 3,
      minWidth: 105,
      useForHeight: false,
      cell: cells.tournament,
    },
  ];

  return (
    <VirtualizedTable
      columns={columns}
      rowColor={(result) => (result.isCorrect ? 'green.200' : 'red.200')}
      results={results}
    />
  );
};

export default BonusResults;
