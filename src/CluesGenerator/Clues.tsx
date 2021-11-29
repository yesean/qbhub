import { CircularProgress } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { TwoColumnTable } from '../components/Table';
import {
  CluesGeneratorStatus,
  fetchClues,
  selectCluesGenerator,
} from './cluesGeneratorSlice';

const cluesFields = [
  { label: 'Clue', dataKey: 'clue' },
  { label: 'Score', dataKey: 'score' },
] as const;

const Clues: React.FC = () => {
  const { status, clues } = useAppSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { answer } = useParams<{ answer: string }>();

  useEffect(() => {
    dispatch(fetchClues(answer));
  }, [dispatch, answer]);

  const render = () => {
    if (status !== CluesGeneratorStatus.idle) {
      return <CircularProgress isIndeterminate color="cyan" />;
    }
    return (
      <TwoColumnTable
        data={clues}
        headers={cluesFields}
        width={600}
        height={700}
      />
    );
  };

  return render();
};

export default Clues;
