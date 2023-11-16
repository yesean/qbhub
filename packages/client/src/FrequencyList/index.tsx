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
  fetchPages,
  FreqStatus,
  nextPage,
  PAGE_SIZE,
  prevPage,
  selectFrequencyList,
} from './frequencyListSlice';

const freqFields = [
  { label: 'Answer', dataKey: 'answer' },
  { label: 'Frequency', dataKey: 'frequency' },
] as const;

const FrequencyList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { page, offset, status } = useSelector(selectFrequencyList);
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
      return <CircularProgress isIndeterminate color="cyan" />;
    }
    if (page.length === 0) {
      return (
        <Text textAlign="center" fontSize="2xl">
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
        width={600}
        height={700}
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
          colorScheme="cyan"
          color="gray.50"
          onClick={prev}
          mr={4}
          disabled={shouldDisableBack}
        >
          Back
        </Button>
        <Button
          colorScheme="cyan"
          color="gray.50"
          onClick={next}
          disabled={shouldDisableNext}
        >
          Next
        </Button>
      </Flex>
    );
  };

  return (
    <Flex
      w="min(600px, 100%)"
      h="min(700px, 100%)"
      flexDir="column"
      justify="center"
      align="center"
    >
      <Center mb={4} w="100%" h="100%" overflow="auto">
        {renderTable()}
      </Center>
      {renderButtons()}
    </Flex>
  );
};

export default FrequencyList;
