import { TableContainer, Text } from '@chakra-ui/react';
import { FrequencyListEntry } from '@qbhub/types';
import { Table } from '../components/Table';
import { TableColumns } from '../hooks/useTable';
import FrequencyListTableAnswer from './FrequencyListTableAnswer';

const COLUMNS: TableColumns<FrequencyListEntry> = [
  {
    cell: (entry) => <FrequencyListTableAnswer answer={entry.answer} />,
    id: 'answerline',
    label: 'Answer',
  },
  {
    cell: ({ frequency }) => <Text align="right">{frequency}</Text>,
    id: 'frequency',
    label: <Text align="right">Frequency</Text>,
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
