import { Box, Text } from '@chakra-ui/react';
import { TossupResult } from '../../types/tossups';
import { renderQuestion } from '../../utils/reader';
import { parseHTMLString } from '../../utils/string';
import { VirtualizedTable, VirtualizedTableColumn } from '../tables';

type TossupResultProps = {
  results: TossupResult[];
};

const TossupResults: React.FC<React.PropsWithChildren<TossupResultProps>> = ({
  results,
}) => {
  const columns: VirtualizedTableColumn<TossupResult>[] = [
    {
      label: 'Score',
      proportion: 1,
      minWidth: 40,
      useForHeight: false,
      cell: (result) => <Text align="center">{result.score}</Text>,
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
          {parseHTMLString(result.tossup.formattedAnswer)}
        </Box>
      ),
    },
    {
      label: 'Question',
      proportion: 4,
      minWidth: 150,
      useForHeight: true,
      cell: (result) => (
        <Box>
          {renderQuestion(result.words, {
            buzz: result.buzzIndex,
          })}
        </Box>
      ),
    },
    {
      label: 'Tournament',
      proportion: 3,
      minWidth: 105,
      useForHeight: false,
      cell: (result) => <Box>{result.tossup.tournament}</Box>,
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

export default TossupResults;
