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
import {
  fetchPages,
  FreqStatus,
  nextPage,
  PAGE_SIZE,
  prevPage,
  selectFrequencyList,
} from './frequencyListSlice';

const FrequencyList: React.FC = () => {
  const { page, offset, status } = useSelector(selectFrequencyList);
  const dispatch = useAppDispatch();

  // in initial state, fetch freq
  useEffect(() => {
    if (status === FreqStatus.initial) {
      dispatch(fetchPages(0));
    }
  }, [dispatch, status]);

  const onBack = () => {
    dispatch(prevPage());
  };

  const onNext = () => {
    dispatch(nextPage());
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
      <Table
        variant="simple"
        mb={4}
        pos="relative"
        h="min(100vw - 56px - 48px, 600px)"
        w="min(100vw - 32px, 500px)"
        style={{ tableLayout: 'fixed' }}
      >
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

  const renderButtons = () => {
    if (status !== FreqStatus.idle) {
      return null;
    }
    // disable back button on the first page, disable next on the last
    const shouldDisableBack = offset === 0;
    const shouldDisableNext = page.length < PAGE_SIZE;
    return (
      <Flex justify="center">
        <Button
          colorScheme="cyan"
          color="gray.50"
          onClick={onBack}
          mr={4}
          disabled={shouldDisableBack}
        >
          Back
        </Button>
        <Button
          colorScheme="cyan"
          color="gray.50"
          onClick={onNext}
          disabled={shouldDisableNext}
        >
          Next
        </Button>
      </Flex>
    );
  };

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
      {renderButtons()}
    </Flex>
  );
};

export default FrequencyList;
