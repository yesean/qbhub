import {
  Button,
  Center,
  CircularProgress,
  Flex,
  Link,
  Text,
} from '@chakra-ui/react';
import { FrequencyListEntry } from '@qbhub/types';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { KeyValueTable } from '../components/tables';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import { useGetURL } from '../utils/routes';
import {
  FreqStatus,
  PAGE_SIZE,
  fetchPages,
  nextPage,
  prevPage,
  selectFrequencyList,
} from './frequencyListSlice';

const freqFields = [
  { dataKey: 'answer', label: 'Answer' },
  { dataKey: 'frequency', label: 'Frequency' },
] as const;

const FrequencyList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { offset, page, status } = useSelector(selectFrequencyList);
  const { settings } = useSettings();
  const dispatch = useAppDispatch();
  const { getClueDisplayURL } = useGetURL();

  // in initial state, fetch freq
  useEffect(() => {
    if (status === FreqStatus.initial) {
      dispatch(fetchPages({ offset: 0, settings }));
    }
  }, [dispatch, settings, status]);

  const prev = useCallback(
    () => status === FreqStatus.idle && offset !== 0 && dispatch(prevPage()),
    [dispatch, status, offset],
  );
  const next = useCallback(
    () =>
      status === FreqStatus.idle &&
      page.length === PAGE_SIZE &&
      dispatch(nextPage({ settings })),
    [status, page.length, dispatch, settings],
  );

  useKeyboardShortcut('p', prev);
  useKeyboardShortcut('n', next);
  useKeyboardShortcut('ArrowLeft', prev);
  useKeyboardShortcut('ArrowRight', next);

  const renderTable = () => {
    if (status !== FreqStatus.idle) {
      return <CircularProgress color="cyan" isIndeterminate />;
    }
    if (page.length === 0) {
      return (
        <Text fontSize="2xl" textAlign="center">
          No Tossups Left.
        </Text>
      );
    }
    const renderAnswer = (answer: FrequencyListEntry) => (
      <Link as={RouterLink} to={getClueDisplayURL({ answer: answer.answer })}>
        {answer.answer}
      </Link>
    );
    return (
      <KeyValueTable
        data={page.map((answer) => ({
          ...answer,
          answer: renderAnswer(answer),
        }))}
        headers={freqFields}
        height={700}
        width={600}
      />
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
          color="gray.50"
          colorScheme="cyan"
          disabled={shouldDisableBack}
          mr={4}
          onClick={prev}
        >
          Back
        </Button>
        <Button
          color="gray.50"
          colorScheme="cyan"
          disabled={shouldDisableNext}
          onClick={next}
        >
          Next
        </Button>
      </Flex>
    );
  };

  return (
    <Flex
      align="center"
      flexDir="column"
      h="min(700px, 100%)"
      justify="center"
      w="min(600px, 100%)"
    >
      <Center h="100%" mb={4} overflow="auto" w="100%">
        {renderTable()}
      </Center>
      {renderButtons()}
    </Flex>
  );
};

export default FrequencyList;
