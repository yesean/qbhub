import {
  Table as ChakraTable,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import useTable, { UseTableProps } from './useTable';

type TableProps<T> = React.ComponentProps<typeof TableContainer> &
  UseTableProps<T>;

export function Table<T>({
  columns,
  data,
  ...tableContainerProps
}: TableProps<T>) {
  const useTableProps = useMemo(() => ({ columns, data }), [columns, data]);
  const { headers, rows } = useTable<T>(useTableProps);

  return (
    <TableContainer {...tableContainerProps}>
      <ChakraTable layout="fixed">
        <Thead bgColor="white" pos="sticky" top={0}>
          <Tr>
            {headers.map((header) => (
              <Th key={header.id} w={`${header.widthPercentage}%`}>
                {header.element}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((cells, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Tr key={index}>
              {cells.map((cell) => (
                <Td key={cell.columnID} w={`${cell.widthPercentage}%`}>
                  {cell.element}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
}
