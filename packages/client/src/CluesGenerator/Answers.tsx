import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  CircularProgress,
  Container,
  Flex,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
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

  if (status !== CluesGeneratorStatus.loaded) {
    return <CircularProgress isIndeterminate color="cyan" />;
  }

  return (
    <Flex
      w="100%"
      h="100%"
      gap={4}
      direction="column"
      justify="center"
      align="center"
    >
      {answers.length === 0 ? (
        <EmptyResults query={query} />
      ) : (
        <>
          <Heading
            as="h2"
            size="md"
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
              answer: (
                <Link
                  as={RouterLink}
                  to={getClueDisplayURL(answer.answer)}
                  onClick={() => dispatch(selectAnswer(answer.answer))}
                >
                  {answer.answer}
                </Link>
              ),
            }))}
            headers={answersFields}
            width={600}
            height={700}
          />
          <RouterLinkButton
            flexShrink={0}
            label="Search"
            to={ROUTES.clue.search}
            leftIcon={<SearchIcon w={4} h={4} />}
            variant="secondary"
          />
        </>
      )}
    </Flex>
  );
};

type EmptyResultsProps = { query: string };

function EmptyResults({ query }: EmptyResultsProps) {
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
      <RouterLinkButton
        label="Search"
        to={ROUTES.clue.search}
        leftIcon={<SearchIcon w={4} h={4} />}
        variant="secondary"
      />
    </>
  );
}

export default Answers;
