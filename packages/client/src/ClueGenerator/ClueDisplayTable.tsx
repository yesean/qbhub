import { TableContainer, Text } from '@chakra-ui/react';
import { SelectedClue } from '@qbhub/types';

import { Table } from '../components/table/Table';
import { makeProportion, TableColumns } from '../components/table/useTable';
import ClueDisplayClue from './ClueDisplayClue';

const COLUMNS: TableColumns<SelectedClue> = [
  {
    cell: (entry) => <ClueDisplayClue clue={entry} />,
    id: 'clue',
    label: 'Clue',
    width: makeProportion(7),
  },
  {
    cell: ({ score }) => <Text align="right">{score}</Text>,
    id: 'score',
    label: <Text align="right">Score</Text>,
    width: makeProportion(3),
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
