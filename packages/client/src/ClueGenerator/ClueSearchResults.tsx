import { FrequencyListEntry } from '@qbhub/types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FrequencyListTable from '../FrequencyList/FrequencyListTable';
import TableSkeleton from '../components/TableSkeleton';
import useActions from '../hooks/useActions';
import { useClueSearchRouteContext } from '../utils/routes';
import ClueSearchEmptyResults from './ClueSearchEmptyResults';
import { selectClueGenerator } from './clueGeneratorSlice';

type ClueSearchResultsDisplayProps = {
  answers: FrequencyListEntry[];
};

function ClueSearchResultsDisplay({ answers }: ClueSearchResultsDisplayProps) {
  const {
    params: { query },
  } = useClueSearchRouteContext();

  if (answers.length === 0) {
    return <ClueSearchEmptyResults query={query} />;
  }

  return <FrequencyListTable data={answers} maxH={700} overflowY="auto" />;
}

export default function ClueSearchResults() {
  const { answers, isFetching } = useSelector(selectClueGenerator);
  const {
    params: { query },
  } = useClueSearchRouteContext();
  const { dispatchFetchAnswers } = useActions();

  useEffect(() => {
    const promise = dispatchFetchAnswers(query);
    return () => promise.abort();
  }, [dispatchFetchAnswers, query]);

  if (answers === undefined || isFetching) {
    return <TableSkeleton />;
  }

  return <ClueSearchResultsDisplay answers={answers} />;
}
