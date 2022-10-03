import { Box, Text } from '@chakra-ui/react';
import { TossupResult } from '../../types/tossups';
import { TOURNAMENT_MAP } from '../../utils/constants';
import { renderQuestion } from '../../utils/reader';
import { parseHTMLString } from '../../utils/string';
import { VirtualizedTable, VirtualizedTableColumn } from '../tables';

type TossupResultProps = {
  results: TossupResult[];
};


const cells: { [key: string]: (result: TossupResult) => JSX.Element } = {
  score: ({ score }) => <Text align="center">{score}</Text>,
  input: ({ userAnswer }) => (
    <Box textAlign="center" overflowWrap="break-word">
      {userAnswer || '<no answer>'}
    </Box>
  ),
  answer: ({ tossup: { formattedAnswer } }) => (
    <Box textAlign="center" overflowWrap="break-word">
      {parseHTMLString(formattedAnswer)}
    </Box>
  ),
  question: ({ words, buzzIndex }) => (
    <Box>
      {renderQuestion(words, {
        buzz: buzzIndex,
      })}
    </Box>
  ),
  tournament: ({ tossup: { tournament } }) => (
    <Box>{TOURNAMENT_MAP[tournament].name}</Box>
  ),
}

const TossupResults: React.FC<React.PropsWithChildren<TossupResultProps>> = ({
  results,
}) => {
  const columns: VirtualizedTableColumn<TossupResult>[] = [
    {
      label: 'Score',
      proportion: 1,
      minWidth: 50,
      useForHeight: false,
      cell: cells.score,
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

export default TossupResults;
