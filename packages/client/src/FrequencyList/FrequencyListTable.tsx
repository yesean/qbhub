import { TableContainer, Text } from '@chakra-ui/react';
import { FrequencyListEntry } from '@qbhub/types';
import { Table } from '../components/table/Table';
import { TableColumns, makeProportion } from '../components/table/useTable';
import FrequencyListTableAnswer from './FrequencyListTableAnswer';

const COLUMNS: TableColumns<FrequencyListEntry> = [
  {
    cell: (entry) => <FrequencyListTableAnswer answer={entry.answer} />,
    id: 'answerline',
    label: 'Answer',
    width: makeProportion(7),
  },
  {
    cell: ({ frequency }) => <Text align="right">{frequency}</Text>,
    id: 'frequency',
    label: <Text align="right">Frequency</Text>,
    width: makeProportion(3),
  },
];

type FrequencyListTableProps = React.ComponentProps<typeof TableContainer> & {
  data: FrequencyListEntry[];
};

export default function FrequencyListTable({
  data,
  ...tableContainerProps
}: FrequencyListTableProps) {
  return <Table columns={COLUMNS} data={data} {...tableContainerProps} />;
}
