import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { fetchFreq } from '../../services/freqService';
import { TossupSettingsContext } from '../../services/TossupSettingsContext';
import { Freq } from '../../types';

const OFFSET = 20;
const FreqList: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [answers, setAnswers] = useState<Freq[]>([]);
  const { categoriesSelected, subcategoriesSelected, difficultiesSelected } =
    useContext(TossupSettingsContext);

  const fetch = useCallback(
    async (o: number) => {
      const freq = await fetchFreq(
        categoriesSelected,
        subcategoriesSelected,
        difficultiesSelected,
        OFFSET,
        o,
      );
      setAnswers(freq);
    },
    [categoriesSelected, subcategoriesSelected, difficultiesSelected],
  );

  const onFetch = useCallback(async () => {
    setOffset(0);
    await fetch(0);
  }, [fetch]);

  const onBack = async () => {
    setOffset((o) => {
      setAnswers([]);
      const newOffset = Math.max(o - OFFSET, 0);
      fetch(newOffset);
      return newOffset;
    });
  };

  const onNext = async () => {
    setOffset((o) => {
      setAnswers([]);
      const newOffset = Math.max(o + OFFSET, 0);
      fetch(newOffset);
      return newOffset;
    });
  };

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  const renderCircularProgress = () => (
    <Center padding={4}>
      <CircularProgress isIndeterminate color="cyan" />
    </Center>
  );

  const renderFreqTable = () => (
    <Table variant="simple" mb={4} pos="relative">
      <Thead pos="sticky" top="0" bg="white">
        <Tr>
          <Th fontSize="lg">Answer</Th>
          <Th fontSize="lg" isNumeric>
            Frequency
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {answers.map((a) => (
          <Tr>
            <Td>{a.answer}</Td>
            <Td isNumeric>{a.count}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Flex
      direction="column"
      justify="center"
      maxW="min(600px, 100%)"
      maxH="min(750px, 100%)"
    >
      <Box w="100%" mb={4} overflow="auto">
        {answers.length === 0 ? renderCircularProgress() : renderFreqTable()}
      </Box>
      <Flex justify="center">
        <Button
          colorScheme="cyan"
          onClick={onBack}
          mr={4}
          disabled={offset === 0}
        >
          Back
        </Button>
        <Button colorScheme="cyan" onClick={onNext}>
          Next
        </Button>
      </Flex>
    </Flex>
  );
};

export default FreqList;
