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
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { selectQuestionSettings } from '../Settings/settingsSlice';
import {
  FreqStatus,
  initialFetchFreq,
  nextFreq,
  PAGE_SIZE,
  prevFreq,
  resetFreq,
  selectFrequencyList,
} from './frequencyListSlice';

const FrequencyList: React.FC = () => {
  const { page, offset, status } = useSelector(selectFrequencyList);
  const questionSettings = useSelector(selectQuestionSettings);
  const dispatch = useAppDispatch();

  // in initial state, fetch freq
  useEffect(() => {
    if (status === FreqStatus.initial) {
      dispatch(initialFetchFreq());
    }
  }, [dispatch, status]);

  // if question settings change, reset freq to initial state
  useEffect(() => {
    dispatch(resetFreq());
  }, [dispatch, questionSettings]);

  const onBack = async () => {
    dispatch(prevFreq());
  };

  const onNext = async () => {
    dispatch(nextFreq());
  };

  const renderPage = () => {
    if (status !== FreqStatus.idle) {
      return (
        <Center padding={4}>
          <CircularProgress isIndeterminate color="cyan" />
        </Center>
      );
    }
    if (page.length === 0) {
      return (
        <Text textAlign="center" fontSize="2xl">
          No Tossups Left.
        </Text>
      );
    }
    return (
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
          {page.map((a) => (
            <Tr key={`${a.answer}${a.count}`}>
              <Td>{a.answer}</Td>
              <Td isNumeric>{a.count}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  // disable back button on the first page, disable next on the last
  const shouldDisableBack = status !== FreqStatus.idle || offset === 0;
  const shouldDisableNext =
    status !== FreqStatus.idle || page.length < PAGE_SIZE;

  return (
    <Flex
      direction="column"
      justify="center"
      maxW="min(600px, 100%)"
      maxH="min(750px, 100%)"
    >
      <Box w="100%" mb={4} overflow="auto">
        {renderPage()}
      </Box>
      <Flex justify="center">
        <Button
          colorScheme="cyan"
          onClick={onBack}
          mr={4}
          disabled={shouldDisableBack}
        >
          Back
        </Button>
        <Button
          colorScheme="cyan"
          onClick={onNext}
          disabled={shouldDisableNext}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
};

export default FrequencyList;
