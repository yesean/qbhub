import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

type TwoColumnTableProps = {
  data: { [key: string]: any }[];
  fields: readonly [
    { label: string; key: string },
    { label: string; key: string },
  ];
  width: number;
  height: number;
};
export const TwoColumnTable: React.FC<TwoColumnTableProps> = ({
  data,
  fields,
  width,
  height,
}) => {
  return (
    <Box
      w={`min(${width}px, 100%)`}
      h={`min(${height}px, 100%)`}
      overflow="auto"
    >
      <Table style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '53%' }} />
          {/* the smallest width `frequency` can take on a mobile screen */}
          <col style={{ width: '47%' }} />
        </colgroup>
        <Thead pos="sticky" top="0" bg="white">
          <Tr>
            <Th fontSize="lg">{fields[0].label}</Th>
            <Th fontSize="lg" isNumeric>
              {fields[1].label}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(({ [fields[0].key]: text, [fields[1].key]: score }) => (
            <Tr>
              <Td>{text}</Td>
              <Td isNumeric>{score}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
