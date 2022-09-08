import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import { TossupResult } from '../../types/tossups';
import { renderQuestion } from '../../utils/reader';
import { parseHTMLString } from '../../utils/string';

type TossupRowProps = {
  style: React.CSSProperties;
  index: number;
  data: {
    results: TossupResult[];
    setRowHeight: (index: number, size: number) => void;
  };
};

const TossupRow: React.FC<React.PropsWithChildren<TossupRowProps>> = ({
  style,
  index,
  data: { results, setRowHeight },
}) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      let height = rowRef.current.scrollHeight;
      if (boxRef.current)
        height = Math.max(height, boxRef.current.scrollHeight + 20);
      setRowHeight(index, height);
    }
  }, [index, rowRef, boxRef, setRowHeight]);

  const result = results[index];

  return (
    <Flex
      style={style}
      overflowX="auto"
      ref={rowRef}
      backgroundColor={result.score > 0 ? 'green.200' : 'red.200'}
      key={index}
      outline="1px solid #e2e8f0"
      py="10px"
    >
      <Center flex="1 0">{result.score}</Center>
      <Center flex="1 0">{result.userAnswer || '<no answer>'}</Center>
      <Center flex="2 0">
        <Box width="75%" textAlign="center">
          {parseHTMLString(result.tossup.formattedAnswer)}
        </Box>
      </Center>
      <Box flex="4 0" overflow="auto" h={boxRef.current?.scrollHeight}>
        <Box minW={80} ref={boxRef}>
          {renderQuestion(result.words, {
            buzz: result.buzzIndex,
          })}
        </Box>
      </Box>
      <Center flex="1.5 0">
        <Box w="75%">{result.tossup.tournament}</Box>
      </Center>
    </Flex>
  );
};

const tossupHeaders = [
  ['Score', 1],
  ['Input', 1],
  ['Answer', 2],
  ['Question', 4],
  ['Tournament', 1.5],
];

type TossupResultProps = {
  results: TossupResult[];
};

const TossupResults: React.FC<React.PropsWithChildren<TossupResultProps>> = ({ results }) => {
  const listRef = useRef<VariableSizeList>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  const setRowHeight = useCallback((index: number, size: number) => {
    listRef.current?.resetAfterIndex(0);
    setRowHeights((heights) => ({ ...heights, [index]: size }));
  }, []);

  const getRowSize = (index: number) => rowHeights[index] ?? 200;

  return (
    <>
      <Flex w={innerRef.current?.clientWidth} mb={2}>
        {tossupHeaders.map(([header, flex], i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Heading size="sm" key={i} flex={flex} textAlign="center">
            {header}
          </Heading>
        ))}
      </Flex>
      <Box flex="1" ref={innerRef}>
        <AutoSizer>
          {({ width, height }) => (
            <VariableSizeList
              width={width}
              height={height}
              estimatedItemSize={400}
              itemCount={results.length}
              itemSize={getRowSize}
              ref={listRef}
              innerRef={innerRef}
              itemData={{ results, setRowHeight }}
            >
              {TossupRow}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Box>
    </>
  );
};

export default TossupResults;
