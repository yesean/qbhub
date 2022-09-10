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

const BonusResults: React.FC<React.PropsWithChildren<BonusResultProps>> = ({
  results,
}) => {
  const columns: VirtualizedTableColumn<BonusPartRowResult>[] = [
    {
      label: 'Part',
      proportion: 1,
      minWidth: 40,
      useForHeight: false,
      cell: (result) => <Text align="center">{result.number}</Text>,
    },
    {
      label: 'Input',
      proportion: 1,
      minWidth: 120,
      useForHeight: false,
      cell: (result) => (
        <Box textAlign="center" overflowWrap="break-word">
          {result.userAnswer || '<no answer>'}
        </Box>
      ),
    },
    {
      label: 'Answer',
      proportion: 2,
      minWidth: 120,
      useForHeight: true,
      cell: (result) => (
        <Box textAlign="center" overflowWrap="break-word">
          {parseHTMLString(result.part.formattedAnswer)}
        </Box>
      ),
    },
    {
      label: 'Question',
      proportion: 4,
      minWidth: 150,
      useForHeight: true,
      cell: (result) => (
        <Flex flexWrap="wrap">
          {renderQuestion(getTossupWords(result.part.formattedText), {
            buzz: result.buzzIndex,
          })}
        </Flex>
      ),
    },
    {
      label: 'Tournament',
      proportion: 3,
      minWidth: 105,
      useForHeight: false,
      cell: (result) => (
        <Box>{TOURNAMENT_MAP[result.bonus.tournament].name}</Box>
      ),
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
