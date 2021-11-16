import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchFreq } from '../services/freqService';
import { selectSettings } from '../Settings/settingsSlice';
import { Freq } from '../types/frequencyList';

const OFFSET = 20;
const FrequencyList: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [answers, setAnswers] = useState<Freq[] | null>(null);
  const { categories, subcategories, difficulties } =
    useSelector(selectSettings);

  const fetch = useCallback(
    async (o: number) => {
      const freq = await fetchFreq(
        categories,
        subcategories,
        difficulties,
        OFFSET,
        o,
      );
      setAnswers(freq);
    },
    [categories, difficulties, subcategories],
  );

  useEffect(() => {
    const initialFetch = async () => {
      setOffset(0);
      await fetch(0);
    };
    initialFetch();
  }, [fetch]);

  const onBack = async () => {
    setAnswers(null);
    const newOffset = Math.max(offset - OFFSET, 0);
    fetch(newOffset);
    setOffset(newOffset);
  };

  const onNext = async () => {
    setAnswers(null);
    const newOffset = Math.max(offset + OFFSET, 0);
    fetch(newOffset);
    setOffset(newOffset);
  };

  const renderCircularProgress = () => (
    <Center padding={4}>
      <CircularProgress isIndeterminate color="cyan" />
    </Center>
  );

  const renderFreqTable = (ans: Freq[]) =>
    ans.length === 0 ? (
      <Text textAlign="center" fontSize="2xl">
        No Tossups Left.
      </Text>
    ) : (
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
          {ans.map((a) => (
            <Tr key={`${a.answer}${a.count}`}>
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
        {answers === null ? renderCircularProgress() : renderFreqTable(answers)}
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
        <Button
          colorScheme="cyan"
          onClick={onNext}
          disabled={answers === null || answers.length === 0}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
};

export default FrequencyList;
