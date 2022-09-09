import { CircularProgress, Container, Link, Text } from '@chakra-ui/react';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { KeyValueTable } from '../components/tables';
import { ROUTES } from '../utils/routes';
import {
  CluesGeneratorStatus,
  fetchAnswers,
  selectCluesGenerator,
  setQuery,
} from './cluesGeneratorSlice';

const answersFields = [
  { label: 'Answer', dataKey: 'answer' },
  { label: 'Frequency', dataKey: 'frequency' },
] as const;

const Answers: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { answers, status } = useSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { answer: answerParam } = useParams<{ answer: string }>();

  useLayoutEffect(() => {
    dispatch(resetStatus());
    dispatch(fetchAnswers(answerParam));
  }, [answerParam, dispatch]);

  const createLink = (answer: string) => (
    <Link as={RouterLink} to={ROUTES.clues.display(answer)}>
      {answer}
    </Link>
  );

  const render = () => {
    if (status !== CluesGeneratorStatus.loaded) {
      return <CircularProgress isIndeterminate color="cyan" />;
    }

    if (answers.length === 0) {
      return (
        <Container bg="gray.100" p={4} borderRadius="md">
          <Text>
            No answerlines matching <strong>{answerParam}</strong>. Try checking
            your network connection or tweaking the search parameters.
          </Text>
        </Container>
      );
    }

    return (
      <KeyValueTable
        data={answers.map((answer) => ({
          ...answer,
          answer: createLink(answer.answer),
        }))}
        headers={answersFields}
        width={600}
        height={700}
      />
    );
  };

  return render();
};

export default Answers;
