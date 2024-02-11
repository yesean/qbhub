import { useToast } from '@chakra-ui/react';
import { matchResult } from '@qbhub/utils';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  FREQUENCY_LIST_PAGE_SIZE,
  selectFrequencyList,
} from '../FrequencyList/frequencyListSlice';
import { ROUTES } from '../routes';
import useActions from './useActions';
import useBoolean from './useBoolean';

const LOOKAHEAD_BUFFER_SIZE = FREQUENCY_LIST_PAGE_SIZE * 3;
const INITIAL_LOOKAHEAD_BUFFER_SIZE = FREQUENCY_LIST_PAGE_SIZE * 6;

export default function useFrequencyListPagination() {
  const {
    getURL: getFrequencyListURL,
    params: { offset },
  } = ROUTES.frequencyList.useRouteContext();
  const { hasNoEntries, isFetching, maximumOffset, results } =
    useSelector(selectFrequencyList);
  const { dispatchFetchPages } = useActions();
  const toast = useToast();
  const {
    setFalse: setUserToNotWaiting,
    setTrue: setUserToWaiting,
    value: isUserWaiting,
  } = useBoolean(false);

  // initial fetch
  const latestInitialFetchID = useRef<string>();
  useEffect(() => {
    if (results === undefined) {
      // fetch from beginning up to initial offset plus buffer
      setUserToWaiting();
      const promise = dispatchFetchPages({
        limit: offset + INITIAL_LOOKAHEAD_BUFFER_SIZE,
        offset: 0,
      });

      // track the most recent request, in case any fetches are aborted
      latestInitialFetchID.current = promise.requestId;
      promise.finally(() => {
        if (promise.requestId === latestInitialFetchID.current) {
          setUserToNotWaiting();
        }
      });

      return () => promise.abort();
    }
  }, [
    dispatchFetchPages,
    offset,
    results,
    setUserToNotWaiting,
    setUserToWaiting,
  ]);

  const prevPage = useCallback(() => {
    const prevOffset = Math.max(offset - FREQUENCY_LIST_PAGE_SIZE, 0);
    getFrequencyListURL({ offset: prevOffset }).go();
  }, [getFrequencyListURL, offset]);

  const nextPage = useCallback(async () => {
    if (results === undefined) {
      return undefined;
    }

    const nextOffset = offset + FREQUENCY_LIST_PAGE_SIZE;

    // check if next offset is past the end
    const isNextOffsetPastEnd = nextOffset >= results.length;
    if (isNextOffsetPastEnd) {
      setUserToWaiting();

      if (isFetching) {
        return;
      }

      const result = await dispatchFetchPages({
        limit: LOOKAHEAD_BUFFER_SIZE,
        offset: results.length,
      }).unwrap();
      matchResult(
        result,
        () => {
          getFrequencyListURL({ offset: nextOffset }).go();
          setUserToNotWaiting();
        },
        ({ errType }) => {
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
        },
      );
      return;
    }

    // prefetch pages, if next offset is within 3 pages from the end
    const isNextOffsetNearEnd =
      nextOffset >= results.length - LOOKAHEAD_BUFFER_SIZE;
    if (isNextOffsetNearEnd && !isFetching) {
      dispatchFetchPages({
        limit: LOOKAHEAD_BUFFER_SIZE,
        offset: results.length,
      }).finally(setUserToNotWaiting);
    }

    getFrequencyListURL({ offset: nextOffset }).go();
  }, [
    dispatchFetchPages,
    getFrequencyListURL,
    isFetching,
    offset,
    results,
    setUserToNotWaiting,
    setUserToWaiting,
    toast,
  ]);

  const currentPage = useMemo(() => {
    if (results === undefined) {
      return undefined;
    }

    return results.slice(offset, offset + FREQUENCY_LIST_PAGE_SIZE);
  }, [offset, results]);

  const isFirstPage = offset === 0;

  const isLastPage = maximumOffset !== undefined && offset >= maximumOffset;

  return useMemo(
    () => ({
      currentPage,
      hasNoEntries,
      isFirstPage,
      isLastPage,
      isUserWaiting,
      maximumOffset,
      nextPage,
      prevPage,
    }),
    [
      currentPage,
      hasNoEntries,
      isFirstPage,
      isLastPage,
      isUserWaiting,
      maximumOffset,
      nextPage,
      prevPage,
    ],
  );
}
