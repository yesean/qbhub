import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { TossupSettingsContext } from '../../services/TossupSettingsContext';
import { Freq } from '../../types';
import { fetchFreq } from '../../services/freqService';

const OFFSET = 20;
const FreqList: React.FC = () => {
  const [, setOffset] = useState(0);
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
    <CircularProgress isIndeterminate color="cyan" />
  );

  const renderFreqTable = () => (
    <Table variant="simple" mb={4}>
      <Thead>
        <Tr>
          <Th>Answer</Th>
          <Th isNumeric>Frequency</Th>
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
    <Container maxW="3xl" maxH="100%">
      <Flex
        direction="column"
        w="100%"
        minH="50vh"
        justify="center"
        align="center"
      >
        {answers.length === 0 ? renderCircularProgress() : renderFreqTable()}
      </Flex>
      <Flex justify="center">
        <Button colorScheme="cyan" onClick={onBack} mr={4}>
          Back
        </Button>
        <Button colorScheme="cyan" onClick={onNext}>
          Next
        </Button>
      </Flex>
    </Container>
  );
};

export default FreqList;
