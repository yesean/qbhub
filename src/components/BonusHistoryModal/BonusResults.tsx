import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import { Bonus, BonusPart, BonusPartResult } from '../../types/bonus';
import { getTossupWords, renderQuestion } from '../../utils/reader';
import { parseHTMLString } from '../../utils/string';

type BonusPartRowResult = BonusPartResult & { bonus: Bonus; part: BonusPart };

type BonusRowProps = {
  style: React.CSSProperties;
  index: number;
  data: {
    results: BonusPartRowResult[];
    setRowHeight: (index: number, size: number) => void;
    rowHeaderRef: React.RefObject<HTMLDivElement>;
    rowRefs: React.RefObject<HTMLDivElement>[];
    setRowRefs: React.Dispatch<
      React.SetStateAction<React.RefObject<HTMLDivElement>[]>
    >;
  };
};

const BonusRow: React.FC<React.PropsWithChildren<BonusRowProps>> = ({
  style,
  index,
  data: { results, setRowHeight, rowHeaderRef, rowRefs, setRowRefs },
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const answerBoxRef = useRef<HTMLDivElement>(null);
  const questionBoxRef = useRef<HTMLDivElement>(null);

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
      let height = rowRef.current.scrollHeight;
      if (answerBoxRef.current)
        height = Math.max(height, answerBoxRef.current.scrollHeight + 20); // row padding + cell padding
      if (questionBoxRef.current)
        height = Math.max(height, questionBoxRef.current.scrollHeight + 20);
      setRowHeight(index, height);
    }
  }, [index, rowRef, questionBoxRef, setRowHeight]);

  const result = results[index];

  return (
    <Flex
      style={style}
      align="center"
      overflowX="auto"
      ref={rowRef}
      backgroundColor={result.isCorrect ? 'green.200' : 'red.200'}
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
      <Center minW="40px" flex="1 0">
        {result.number}
      </Center>
      <Center minW="80px" flex="1 0">
        <Text align="center">{result.userAnswer || '<no answer>'}</Text>
      </Center>
      <Center
        flex="2 0"
        h={`${questionBoxRef.current?.scrollHeight}px + 2rem`}
        px={4}
      >
        <Box minW="80px" textAlign="center" ref={answerBoxRef}>
          {parseHTMLString(result.part.formattedAnswer)}
        </Box>
      </Center>
      <Box
        flex="4 0"
        h={`${questionBoxRef.current?.scrollHeight}px + 2rem`}
        px={4}
      >
        <Box minW="120px" ref={questionBoxRef}>
          {renderQuestion(getTossupWords(result.part.formattedText), {
            buzz: result.buzzIndex,
          })}
        </Box>
      </Box>
      <Center padding={4} flex="3 0">
        <Box minW="105px">{result.bonus.tournament}</Box>
      </Center>
    </Flex>
  );
};

const bonusHeaders = [
  ['Part', 1, 40],
  ['Input', 1, 80],
  ['Answer', 2, 80],
  ['Question', 4, 120],
  ['Tournament', 3, 105],
];

type BonusResultProps = {
  results: BonusPartRowResult[];
};

const BonusResults: React.FC<React.PropsWithChildren<BonusResultProps>> = ({
  results,
}) => {
  const listRef = useRef<VariableSizeList>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rowHeaderRef = useRef<HTMLDivElement>(null);
  const [rowRefs, setRowRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  const setRowHeight = useCallback((index: number, size: number) => {
    listRef.current?.resetAfterIndex(0);
    setRowHeights((heights) => ({ ...heights, [index]: size }));
  }, []);

  const getRowSize = (index: number) => rowHeights[index] ?? 100;
  const maxRowWidth = rowRefs.reduce(
    (acc, ref) => Math.max(acc, ref?.current?.scrollWidth ?? 0),
    0,
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
        <Flex w={maxRowWidth} mb={2}>
          {bonusHeaders.map(([header, flex, minW], i) => (
            <Heading
              size="sm"
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              flex={flex}
              textAlign="center"
              minW={`${minW}px`}
            >
              {header}
            </Heading>
          ))}
        </Flex>
      </Box>
      <Box flex="1">
        <AutoSizer>
          {({ width, height }) => (
            <VariableSizeList
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
              innerRef={innerRef}
              itemData={{
                results,
                setRowHeight,
                rowHeaderRef,
                rowRefs,
                setRowRefs,
              }}
            >
              {BonusRow}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Box>
    </>
  );
};

export default BonusResults;
