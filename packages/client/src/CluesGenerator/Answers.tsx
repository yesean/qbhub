import {
  Box,
  CircularProgress,
  Container,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { KeyValueTable } from '../components/tables';
import { useAppDispatch } from '../redux/hooks';
import { ROUTES, useGetClueDisplayURL } from '../utils/routes';
import {
  CluesGeneratorStatus,
  fetchAnswers,
  resetStatus,
  selectAnswer,
  selectCluesGenerator,
  setQuery,
} from './cluesGeneratorSlice';
import SearchButton from './SearchButton';

const answersFields = [
  { label: 'Answer', dataKey: 'answer' },
  { label: 'Frequency', dataKey: 'frequency' },
] as const;

const Answers: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { answers, status } = useSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') as string;
  const getClueDisplayURL = useGetClueDisplayURL();

  useLayoutEffect(() => {
    dispatch(resetStatus());
    dispatch(setQuery(query));
    dispatch(fetchAnswers(query));
  }, [query, dispatch]);

  const createLink = (answer: string) => (
    <Link
      as={RouterLink}
      to={getClueDisplayURL(answer)}
      onClick={() => dispatch(selectAnswer(answer))}
    >
      {answer}
    </Link>
  );

  if (status !== CluesGeneratorStatus.loaded) {
    return <CircularProgress isIndeterminate color="cyan" />;
  }

  if (answers.length === 0) {
    return (
      <>
        <Container
          bg="gray.100"
          p={4}
          borderRadius="md"
          maxH="100%"
          overflow="auto"
        >
          <Text maxH="100%">
            No answerlines matching <strong>{query}</strong>. Try checking your
            network connection or tweaking the search parameters.
          </Text>
        </Container>
        <SearchButton
          label="Search"
          to={ROUTES.clue.search}
          mt={4}
          flexShrink={0}
        />
      </>
    );
  }

  return (
    <>
      <Heading
        as="h2"
        size="md"
        mb={4}
        px={4}
        textAlign="center"
        lineHeight="1.5"
        maxW="600px"
      >
        Showing answerlines similar to:{' '}
        <Box as="span" bg="cyan.200" borderRadius="sm" p={1}>
          {query}
        </Box>
      </Heading>
      <KeyValueTable
        data={answers.map((answer) => ({
          ...answer,
          answer: createLink(answer.answer),
        }))}
        headers={answersFields}
        width={600}
        height={700}
      />
      <SearchButton
        label="Search"
        to={ROUTES.clue.search}
        mt={4}
        flexShrink={0}
      />
    </>
  );
};

export default Answers;
