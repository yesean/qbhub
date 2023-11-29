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
      style={style}
      align="center"
      overflowX="auto"
      ref={rowRef}
      backgroundColor={rowColor(result)}
      key={index}
      outline="1px solid #e2e8f0"
      py="10px"
      onScroll={(e) => {
        if (rowHeaderRef.current != null) {
          rowHeaderRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
        rowRefs.forEach((ref) => {
          if (ref?.current != null)
            ref.current.scrollLeft = e.currentTarget.scrollLeft;
        });
      }}
    >
      {columns.map(({ cell, label, minWidth, proportion, useForHeight }) => (
        <Center
          key={label}
          minW={`${minWidth}px`}
          flex={`${proportion} 0`}
          px={4}
          ref={(ref) => {
            if (useForHeight) {
              setTallestCell((currentHeight) =>
                Math.max(currentHeight, ref?.scrollHeight ?? 0),
              );
            }
          }}
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
        overflowX="auto"
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
      >
        <Flex w={`max(100%, ${maxRowWidth})`} mb={2}>
          {columns.map(({ label, minWidth, proportion }, i) => (
            <Heading
              size="sm"
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              flex={proportion}
              textAlign="center"
              minW={`${minWidth}px`}
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
              width={width}
              height={height}
              estimatedItemSize={100}
              itemCount={results.length}
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
              ref={listRef}
              itemData={{
                columns,
                results,
                rowColor,
                rowHeaderRef,
                rowRefs,
                setRowHeight,
                setRowRefs,
              }}
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
