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
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useAppDispatch } from '../redux/hooks';
import { selectSettings } from '../SettingsModal/settingsSlice';
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
  const settings = useSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { getClueDisplayURL } = useGetURL();

  // in initial state, fetch freq
  useEffect(() => {
    if (status === FreqStatus.initial) {
      dispatch(fetchPages(0));
    }
  }, [dispatch, status]);

  const prev = useCallback(
    () => status === FreqStatus.idle && offset !== 0 && dispatch(prevPage()),
    [dispatch, status, offset],
  );
  const next = useCallback(
    () =>
      status === FreqStatus.idle &&
      page.length === PAGE_SIZE &&
      dispatch(nextPage()),
    [dispatch, status, page],
  );

  useKeyboardShortcut('p', prev, () => !settings.isOpen);
  useKeyboardShortcut('n', next, () => !settings.isOpen);
  useKeyboardShortcut('ArrowLeft', prev, () => !settings.isOpen);
  useKeyboardShortcut('ArrowRight', next, () => !settings.isOpen);

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
