import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FrequencyListEntry } from '@qbhub/types';
import { matchErr } from '@qbhub/utils';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TableSkeleton from '../components/TableSkeleton';
import useActions from '../hooks/useActions';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useAppDispatch } from '../redux/utils';
import FrequencyListTable from './FrequencyListTable';
import { prevPage, selectFrequencyList } from './frequencyListSlice';

type FrequencyListDisplayProps = {
  currentPage: FrequencyListEntry[];
  maximumOffset: number | undefined;
  offset: number;
};

function FrequencyListDisplay({
  currentPage,
  maximumOffset,
  offset,
}: FrequencyListDisplayProps) {
  const dispatch = useAppDispatch();
  const { dispatchNextPage } = useActions();
  const toast = useToast();

  const handlePrev = () => dispatch(prevPage());
  const handleNext = async () => {
    const result = await dispatchNextPage().unwrap();
    matchErr(result, ({ errType }) => {
      if (errType === 'NoMoreEntriesErr') {
        toast.closeAll();
        toast({
          status: 'warning',
          title: 'No more answerlines left',
        });
      }
      if (errType === 'FetchFreqErr') {
        toast.closeAll();
        toast({
          status: 'error',
          title: 'Failed to fetch more answerlines',
        });
      }
    });
  };

  useKeyboardShortcut('p', handlePrev);
  useKeyboardShortcut('n', handleNext);
  useKeyboardShortcut('ArrowLeft', handlePrev);
  useKeyboardShortcut('ArrowRight', handleNext);

  if (currentPage.length === 0) {
    return (
      <Text fontSize="2xl" textAlign="center">
        No Tossups Left.
      </Text>
    );
  }

  const isFirstPage = offset === 0;
  const isLastPage =
    maximumOffset === undefined ? false : offset >= maximumOffset;

  return (
    <VStack align="stretch" h="100%" maxH={700} maxW={500} spacing={8} w="100%">
      <FrequencyListTable
        data={currentPage}
        h="100%"
        overflowY="auto"
        w="100%"
      />
      <HStack justify="space-between">
        <IconButton
          aria-label="Previous answerlines"
          icon={<ArrowBackIcon />}
          isDisabled={isFirstPage}
          onClick={handlePrev}
        />
        <IconButton
          aria-label="Next answerlines"
          icon={<ArrowForwardIcon />}
          isDisabled={isLastPage}
          onClick={handleNext}
        />
      </HStack>
    </VStack>
  );
}

export default function FrequencyList() {
  const { currentPage, isFetching, maximumOffset, offset } =
    useSelector(selectFrequencyList);
  const { dispatchFetchPages } = useActions();

  useEffect(() => {
    const promise = dispatchFetchPages(0);
    return () => promise.abort();
  }, [dispatchFetchPages]);

  if (currentPage === undefined || isFetching) {
    return (
      <Box maxW={500} w="100%">
        <TableSkeleton rowCount={10} />
      </Box>
    );
  }

  return (
    <FrequencyListDisplay
      currentPage={currentPage}
      maximumOffset={maximumOffset}
      offset={offset}
    />
  );
}
