import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouterLink } from '../components/RouterLink';
import { KeyValueTable } from '../components/tables';
import useActions from '../hooks/useActions';
import {
  useClueDisplayRouteContext,
  useClueSearchRouteContext,
} from '../utils/routes';
import EmptySearchResults from './EmptySearchResults';
import SearchResultsSkeleton from './SearchResultsSkeleton';
import { selectCluesGenerator } from './cluesGeneratorSlice';

const answersFields = [
  { dataKey: 'answer', label: 'Answer' },
  { dataKey: 'frequency', label: 'Frequency' },
] as const;

export default function SearchResults() {
  const { answers, isFetching } = useSelector(selectCluesGenerator);
  const { getURL: getClueDisplayURL } = useClueDisplayRouteContext();
  const {
    params: { query },
  } = useClueSearchRouteContext();
  const { dispatchFetchAnswers } = useActions();

  useEffect(() => {
    dispatchFetchAnswers(query);
  }, [dispatchFetchAnswers, query]);

  if (answers === undefined || isFetching) {
    return <SearchResultsSkeleton />;
  }

  if (answers.length === 0) {
    return <EmptySearchResults query={query} />;
  }

  return (
    <Flex
      align="center"
      direction="column"
      gap={4}
      justify="center"
      maxH="700px"
      w="100%"
    >
      <KeyValueTable
        data={answers.map((answer) => ({
          ...answer,
          answer: (
            <RouterLink to={getClueDisplayURL({ answer: answer.answer })}>
              {answer.answer}
            </RouterLink>
          ),
        }))}
        headers={answersFields}
        height={700}
        width={1000}
      />
    </Flex>
  );
}
