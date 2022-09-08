import { Box, Flex, Heading } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

type TwoColumnTableProps = {
  data: { [key: string]: any }[];
  headers: readonly [
    { label: string; dataKey: string },
    { label: string; dataKey: string },
  ];
  width: number;
  height: number;
};

/**
 * Custom striped, two column table for presenting data in the format `key (1st column) -> value (2nd column)`.
 */
export const TwoColumnTable: React.FC<React.PropsWithChildren<TwoColumnTableProps>> = ({
  data,
  headers,
  width,
  height,
}) => {
  /**
   * Since we set the bottom border for each row, if the table body has to scroll,
   * then the last row will draw an overlapping border with the table border (it creates a double border, which looks ugly).
   * We can prevent this by calculating the clientHeight and scrollHeight to check
   * if the table has to scroll, and if it does, then we prevent the last row
   * from having a bottom border.
   */
  const [{ client, scroll }, setBodyHeights] = useState({
    client: 0,
    scroll: 0,
  });
  const tableBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableBodyRef.current) {
      setBodyHeights({
        client: tableBodyRef.current.clientHeight,
        scroll: tableBodyRef.current.scrollHeight,
      });
    }
  }, []);

  return (
    <Flex
      w={`min(${width}px, 100%)`}
      h={`min(${height}px, 100%)`}
      direction="column"
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="12px"
      overflow="hidden"
    >
      <Flex px={4} py={3} borderBottom="1px" borderColor="gray.200">
        <Heading size="md" flex="1">
          {headers[0].label}
        </Heading>
        <Heading size="md" flex="1" textAlign="right">
          {headers[1].label}
        </Heading>
      </Flex>
      <Box ref={tableBodyRef} flex="1" overflow="auto">
        {data.map(
          ({ [headers[0].dataKey]: text, [headers[1].dataKey]: score }, i) => (
            <Flex
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              px={4}
              py={2}
              borderBottom="1px"
              borderColor="gray.200"
              sx={{
                '&:nth-of-type(odd)': { bg: 'gray.100' },
                '&:last-child': {
                  borderBottom: scroll > client ? 'none' : '1px',
                  borderColor: 'gray.200',
                },
              }}
            >
              <Box flex="0.6">{text}</Box>
              <Box flex="0.4" textAlign="right">
                {score}
              </Box>
            </Flex>
          ),
        )}
      </Box>
    </Flex>
  );
};
