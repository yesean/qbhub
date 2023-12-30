import { FrequencyListEntry } from '@qbhub/types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouterLink } from '../components/RouterLink';
import TableSkeleton from '../components/TableSkeleton';
import { KeyValueTable } from '../components/tables';
import useActions from '../hooks/useActions';
import {
  useClueDisplayRouteContext,
  useClueSearchRouteContext,
} from '../utils/routes';
import ClueSearchEmptyResults from './ClueSearchEmptyResults';
import { selectClueGenerator } from './clueGeneratorSlice';

const answersFields = [
  { dataKey: 'answer', label: 'Answer' },
  { dataKey: 'frequency', label: 'Frequency' },
] as const;

type ClueSearchResultsDisplayProps = {
  answers: FrequencyListEntry[];
};

function ClueSearchResultsDisplay({ answers }: ClueSearchResultsDisplayProps) {
  const { getURL: getClueDisplayURL } = useClueDisplayRouteContext();
  const {
    params: { query },
  } = useClueSearchRouteContext();

  if (answers.length === 0) {
    return <ClueSearchEmptyResults query={query} />;
  }

  return (
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
  );
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
