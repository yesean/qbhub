import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, VStack } from '@chakra-ui/react';
import TableSkeleton from '../components/table/TableSkeleton';
import useFrequencyListPagination from '../hooks/useFrequencyListPagination';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import EmptyFrequencyListNotice from './EmptyFrequencyListNotice';
import FrequencyListTable from './FrequencyListTable';

export default function FrequencyListDisplay() {
  const {
    currentPage,
    hasNoEntries,
    isFirstPage,
    isLastPage,
    isUserWaiting,
    nextPage,
    prevPage,
  } = useFrequencyListPagination();

  useKeyboardShortcut('p', prevPage);
  useKeyboardShortcut('n', nextPage);
  useKeyboardShortcut('ArrowLeft', prevPage);
  useKeyboardShortcut('ArrowRight', nextPage);

  if (isUserWaiting) {
    return (
      <Box maxW="container.md" w="100%">
        <TableSkeleton rowCount={10} />
      </Box>
    );
  }

  if (hasNoEntries || currentPage === undefined) {
    return <EmptyFrequencyListNotice />;
  }

  return (
    <VStack
      align="stretch"
      h="100%"
      maxH={700}
      maxW="container.md"
      spacing={8}
      w="100%"
    >
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
          onClick={prevPage}
        />
        <IconButton
          aria-label="Next answerlines"
          icon={<ArrowForwardIcon />}
          isDisabled={isLastPage}
          onClick={nextPage}
        />
      </HStack>
    </VStack>
  );
}
