import { CircularProgress, Link } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { TwoColumnTable } from '../components/Table';
import {
  CluesGeneratorStatus,
  fetchAnswers,
  selectCluesGenerator,
} from './cluesGeneratorSlice';

const answersFields = [
  { label: 'Answer', key: 'answer' },
  { label: 'Frequency', key: 'frequency' },
] as const;

const Answers: React.FC = () => {
  const { answers, status } = useSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { answer: answerParam } = useParams<{ answer: string }>();

  useEffect(() => {
    dispatch(fetchAnswers(answerParam));
  }, [dispatch, answerParam]);

  const createLink = (answer: string) => (
    <Link as={RouterLink} to={`/clues/display/${answer}`}>
      {answer}
    </Link>
  );

  const render = () => {
    if (status !== CluesGeneratorStatus.idle) {
      return <CircularProgress isIndeterminate color="cyan" />;
    }
    return (
      <TwoColumnTable
        data={answers.map((answer) => ({
          ...answer,
          answer: createLink(answer.answer),
        }))}
        fields={answersFields}
        width={600}
        height={700}
      />
    );
  };

  return render();
};

export default Answers;
