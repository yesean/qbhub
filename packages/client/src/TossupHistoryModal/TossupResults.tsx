import { Box, Text } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import FormattedQuestion from '../components/FormattedQuestion';
import { VirtualizedTable, VirtualizedTableColumn } from '../components/tables';
import { TOURNAMENT_METADATA_BY_TOURNAMENT } from '../utils/constants';
import { parseHTMLString } from '../utils/string';

type TossupResultProps = {
  results: TossupResult[];
};

const cells: { [key: string]: (result: TossupResult) => JSX.Element } = {
  answer: ({ tossup: { formattedAnswer } }) => (
    <Box overflowWrap="break-word" textAlign="center">
      {parseHTMLString(formattedAnswer)}
    </Box>
  ),
  input: ({ userAnswer }) => (
    <Box overflowWrap="break-word" textAlign="center">
      {userAnswer || '<no answer>'}
    </Box>
  ),
  question: ({ buzzIndex, formattedWords }) => (
    <Box>
      <FormattedQuestion buzzIndex={buzzIndex} words={formattedWords} />
    </Box>
  ),
  score: ({ score }) => <Text align="center">{score}</Text>,
  tournament: ({ tossup: { tournament } }) => (
    <Box>{TOURNAMENT_METADATA_BY_TOURNAMENT[tournament].label}</Box>
  ),
};

const TossupResults: React.FC<React.PropsWithChildren<TossupResultProps>> = ({
  results,
}) => {
  const columns: VirtualizedTableColumn<TossupResult>[] = [
    {
      cell: cells.score,
      label: 'Score',
      minWidth: 50,
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

export default TossupResults;
