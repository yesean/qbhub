import { FrequencyListEntry } from '@qbhub/types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import TableSkeleton from '../components/table/TableSkeleton';
import FrequencyListTable from '../FrequencyList/FrequencyListTable';
import useActions from '../hooks/useActions';
import { ROUTES } from '../routes';
import { selectClueGenerator } from './clueGeneratorSlice';
import ClueSearchEmptyResults from './ClueSearchEmptyResults';

type ClueSearchResultsDisplayProps = {
  answers: FrequencyListEntry[];
};

function ClueSearchResultsDisplay({ answers }: ClueSearchResultsDisplayProps) {
  const {
    params: { query },
  } = ROUTES.clueSearch.useRouteContext();

  if (answers.length === 0) {
    return <ClueSearchEmptyResults query={query} />;
  }

  return <FrequencyListTable data={answers} maxH={700} overflowY="auto" />;
}

export default function ClueSearchResults() {
  const { answers, isFetching } = useSelector(selectClueGenerator);
  const {
    params: { query },
  } = ROUTES.clueSearch.useRouteContext();
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
