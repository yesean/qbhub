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
import { Link as RouterLink } from 'react-router-dom';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { KeyValueTable } from '../components/tables';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import {
  useClueDisplayRouteContext,
  useClueSearchRouteContext,
} from '../utils/routes';
import {
  CluesGeneratorStatus,
  fetchAnswers,
  resetStatus,
  selectAnswer,
  selectCluesGenerator,
  setQuery,
} from './cluesGeneratorSlice';

const answersFields = [
  { dataKey: 'answer', label: 'Answer' },
  { dataKey: 'frequency', label: 'Frequency' },
] as const;

type Props = {
  query: string;
};

const Answers: React.FC<React.PropsWithChildren<Props>> = ({ query }) => {
  const { answers, status } = useSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();
  const { getURL: getClueDisplayURL } = useClueDisplayRouteContext();
  const { settings } = useSettings();

  useLayoutEffect(() => {
    dispatch(resetStatus());
    dispatch(setQuery(query));
    dispatch(fetchAnswers({ answer: query, settings }));
  }, [query, dispatch, settings]);

  if (status !== CluesGeneratorStatus.loaded) {
    return <CircularProgress color="cyan" isIndeterminate />;
  }

  return (
    <Flex
      align="center"
      direction="column"
      gap={4}
      h="100%"
      justify="center"
      w="100%"
    >
      {answers.length === 0 ? (
        <EmptyResults query={query} />
      ) : (
        <>
          <Heading
            as="h2"
            lineHeight="1.5"
            maxW="600px"
            px={4}
            size="md"
            textAlign="center"
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
                  onClick={() => dispatch(selectAnswer(answer.answer))}
                  to={getClueDisplayURL({ answer: answer.answer })}
                >
                  {answer.answer}
                </Link>
              ),
            }))}
            headers={answersFields}
            height={700}
            width={600}
          />
          <RouterLinkButton
            flexShrink={0}
            label="Search"
            leftIcon={<SearchIcon h={4} w={4} />}
            to={getClueSearchURL({ query: undefined })}
            variant="secondary"
          />
        </>
      )}
    </Flex>
  );
};

type EmptyResultsProps = { query: string };

function EmptyResults({ query }: EmptyResultsProps) {
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  return (
    <>
      <Container
        bg="gray.100"
        borderRadius="md"
        maxH="100%"
        overflow="auto"
        p={4}
      >
        <Text maxH="100%">
          No answerlines matching <strong>{query}</strong>. Try checking your
          network connection or tweaking the search parameters.
        </Text>
      </Container>
      <RouterLinkButton
        label="Search"
        leftIcon={<SearchIcon h={4} w={4} />}
        to={getClueSearchURL({ query: undefined })}
        variant="secondary"
      />
    </>
  );
}

export default Answers;
