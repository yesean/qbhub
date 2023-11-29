import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';

type RowProps<T> = {
  data: {
    columns: Column<T>[];
    results: T[];
    rowColor: (arg: T) => string;
    rowHeaderRef: React.RefObject<HTMLDivElement>;
    rowRefs: React.RefObject<HTMLDivElement>[];
    setRowHeight: (index: number, size: number) => void;
    setRowRefs: React.Dispatch<
      React.SetStateAction<React.RefObject<HTMLDivElement>[]>
    >;
  };
  index: number;
  style: React.CSSProperties;
};

const Row = <T,>({
  data: {
    columns,
    results,
    rowColor,
    rowHeaderRef,
    rowRefs,
    setRowHeight,
    setRowRefs,
  },
  index,
  style,
}: React.PropsWithChildren<RowProps<T>>) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [tallestCell, setTallestCell] = useState(0);

  useEffect(() => {
    setRowRefs((refs) => {
      refs[index] = rowRef;
      return [...refs];
    });

    return () => {
      setRowRefs((refs) => {
        delete refs[index];
        return [...refs];
      });
    };
  }, [index, setRowRefs]);

  useEffect(() => {
    if (rowRef.current) {
      const defaultHeight = rowRef.current.scrollHeight;
      const maxHeight = Math.max(defaultHeight, tallestCell + 20); // add row padding
      setRowHeight(index, maxHeight);
    }
  }, [index, setRowHeight, tallestCell]);

  const result = results[index];

  return (
    <Flex
      key={index}
      ref={rowRef}
      align="center"
      backgroundColor={rowColor(result)}
      onScroll={(e) => {
        if (rowHeaderRef.current != null) {
          rowHeaderRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
        rowRefs.forEach((ref) => {
          if (ref?.current != null)
            ref.current.scrollLeft = e.currentTarget.scrollLeft;
        });
      }}
      outline="1px solid #e2e8f0"
      overflowX="auto"
      py="10px"
      style={style}
    >
      {columns.map(({ cell, label, minWidth, proportion, useForHeight }) => (
        <Center
          key={label}
          ref={(ref) => {
            if (useForHeight) {
              setTallestCell((currentHeight) =>
                Math.max(currentHeight, ref?.scrollHeight ?? 0),
              );
            }
          }}
          flex={`${proportion} 0`}
          minW={`${minWidth}px`}
          px={4}
        >
          {cell(result)}
        </Center>
      ))}
    </Flex>
  );
};

export type Column<T> = {
  cell: (arg: T) => JSX.Element;
  label: string;
  minWidth: number;
  proportion: number;
  useForHeight?: boolean;
};

type VirtualizedTableProps<T> = {
  columns: Column<T>[];
  results: T[];
  rowColor: (arg: T) => string;
};

const VirtualizedTable = <T,>({
  columns,
  results,
  rowColor,
}: React.PropsWithChildren<VirtualizedTableProps<T>>) => {
  const listRef = useRef<VariableSizeList>(null);
  const rowHeaderRef = useRef<HTMLDivElement>(null);
  const [rowRefs, setRowRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  const setRowHeight = useCallback((index: number, size: number) => {
    listRef.current?.resetAfterIndex(0);
    setRowHeights((heights) => ({ ...heights, [index]: size }));
  }, []);

  const getRowSize = (index: number) => rowHeights[index] ?? 100;

  const maxRowWidth = useMemo(
    () =>
      rowRefs.reduce(
        (acc, ref) => Math.max(acc, ref?.current?.scrollWidth ?? 0),
        0,
      ),
    [rowRefs],
  );

  return (
    <>
      <Box
        ref={rowHeaderRef}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        onScroll={(e) => {
          rowRefs.forEach((ref) => {
            if (ref?.current != null)
              ref.current.scrollLeft = e.currentTarget.scrollLeft;
          });
        }}
        overflowX="auto"
      >
        <Flex mb={2} w={`max(100%, ${maxRowWidth})`}>
          {columns.map(({ label, minWidth, proportion }, i) => (
            <Heading
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              flex={proportion}
              minW={`${minWidth}px`}
              size="sm"
              textAlign="center"
            >
              {label}
            </Heading>
          ))}
        </Flex>
      </Box>
      <Box flex="1">
        <AutoSizer>
          {({ height, width }) => (
            <VariableSizeList<RowProps<T>['data']>
              ref={listRef}
              estimatedItemSize={100}
              height={height}
              itemCount={results.length}
              itemData={{
                columns,
                results,
                rowColor,
                rowHeaderRef,
                rowRefs,
                setRowHeight,
                setRowRefs,
              }}
              itemSize={getRowSize}
              onItemsRendered={() => {
                const rightmostScroll = rowRefs.reduce(
                  (acc, ref) => Math.max(acc, ref?.current?.scrollLeft ?? 0),
                  0,
                );
                rowRefs.forEach((ref) => {
                  if (ref?.current != null)
                    ref.current.scrollLeft = rightmostScroll;
                });
              }}
              width={width}
            >
              {Row}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Box>
    </>
  );
};

export default VirtualizedTable;
