import { TableContainer, Text } from '@chakra-ui/react';
import { SelectedClue } from '@qbhub/types';
import { Table } from '../components/Table';
import { TableColumns } from '../hooks/useTable';
import ClueDisplayClue from './ClueDisplayClue';

const COLUMNS: TableColumns<SelectedClue> = [
  {
    cell: (entry) => <ClueDisplayClue clue={entry} />,
    id: 'clue',
    label: 'Clue',
  },
  {
    cell: ({ score }) => <Text align="right">{score}</Text>,
    id: 'score',
    label: <Text align="right">Score</Text>,
  },
];

type ClueDisplayTableProps = React.ComponentProps<typeof TableContainer> & {
  clues: SelectedClue[];
};

export default function ClueDisplayTable({
  clues,
  ...tableContainerProps
}: ClueDisplayTableProps) {
  return <Table columns={COLUMNS} data={clues} {...tableContainerProps} />;
}
