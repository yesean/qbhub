import { Button, Center, CircularProgress, Flex, Text } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { TwoColumnTable } from '../components/Table';
import { selectSettings } from '../Settings/settingsSlice';
import { addShortcut } from '../utils/keyboard';
import {
  fetchPages,
  FreqStatus,
  nextPage,
  PAGE_SIZE,
  prevPage,
  selectFrequencyList,
} from './frequencyListSlice';

const freqFields = [
  { label: 'Answer', key: 'answer' },
  { label: 'Frequency', key: 'frequency' },
] as const;

const FrequencyList: React.FC = () => {
  const { page, offset, status } = useSelector(selectFrequencyList);
  const { isOpen } = useSelector(selectSettings);
  const dispatch = useAppDispatch();

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
  useEffect(() => addShortcut('p', prev, [!isOpen]), [prev, isOpen]);
  useEffect(() => addShortcut('ArrowLeft', prev, [!isOpen]), [prev, isOpen]);
  useEffect(() => addShortcut('n', next, [!isOpen]), [next, isOpen]);
  useEffect(() => addShortcut('ArrowRight', next, [!isOpen]), [next, isOpen]);

  const onBack = () => {
    dispatch(prevPage());
  };

  const onNext = () => {
    dispatch(nextPage());
  };

  const renderPage = () => {
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
    return (
      <TwoColumnTable
        data={page}
        fields={freqFields}
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
      w="min(600px, 100%)"
      h="min(700px, 100%)"
      flexDir="column"
      justify="center"
      align="center"
    >
      <Center mb={4} w="100%" h="100%" overflow="auto">
        {renderPage()}
      </Center>
      {renderButtons()}
    </Flex>
  );
};

export default FrequencyList;
