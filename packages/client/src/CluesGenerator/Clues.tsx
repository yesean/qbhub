import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  CircularProgress,
  Container,
  Flex,
  Heading,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { SelectedClue } from '@qbhub/types';
import { useLayoutEffect } from 'react';
import FileDownloadButton from '../components/buttons/FileDownloadButton';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { KeyValueTable } from '../components/tables';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getCSVURL, getJSONURL } from '../utils/array';
import {
  useClueDisplayRouteContext,
  useClueSearchRouteContext,
} from '../utils/routes';
import {
  CluesGeneratorStatus,
  fetchClues,
  resetStatus,
  selectAnswer,
  selectCluesGenerator,
} from './cluesGeneratorSlice';

const cluesFields = [
  { dataKey: 'clue', label: 'Clue' },
  { dataKey: 'score', label: 'Score' },
] as const;

const Clues: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { clues, currentQuery, status } = useAppSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();
  const { params } = useClueDisplayRouteContext();
  const answer = params.answer as string;
  const { settings } = useSettings();

  const cluesCSVURL = getCSVURL(
    clues
      .filter((clue) => clue.score > 0)
      .map((clue) => [clue.text, answer, clue.sentence]),
  );

  const cluesJSONURL = getJSONURL(
    clues.filter((clue) => clue.score > 0).map((clue) => ({ ...clue, answer })),
  );

  useLayoutEffect(() => {
    dispatch(resetStatus());
    dispatch(selectAnswer(answer));
    dispatch(fetchClues({ answer, settings }));
  }, [dispatch, answer, settings]);

  const renderTooltip = (clue: SelectedClue) => {
    const startIndex = clue.sentence.indexOf(clue.text);
    if (startIndex === -1) {
      return (
        <>
          <Heading mb={1} size="sm">
            {clue.tournament}
          </Heading>
          <Text>{clue.sentence}</Text>
        </>
      );
    }
    return (
      <>
        <Heading mb={1} size="sm">
          {clue.tournament}
        </Heading>
        <Text display="inline">{clue.sentence.substring(0, startIndex)}</Text>
        <Text as="mark" bgColor="#fffea9" display="inline">
          {clue.sentence.substring(startIndex, startIndex + clue.text.length)}
        </Text>
        <Text display="inline">
          {clue.sentence.substring(startIndex + clue.text.length)}
        </Text>
      </>
    );
  };

  const renderClue = (clue: SelectedClue) => (
    <Tooltip
      borderRadius="5px"
      hasArrow
      label={renderTooltip(clue)}
      p={2}
      placement="top"
    >
      <Text>{clue.text}</Text>
    </Tooltip>
  );

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
      {clues.length === 0 ? (
        <EmptyResults answer={answer} />
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
            Showing clues for:{' '}
            <Box as="span" bg="cyan.200" borderRadius="sm" p={1}>
              {answer}
            </Box>
          </Heading>
          <Box h="min(700px, 100%)" overflow="auto" w="min(600px, 100%)">
            <KeyValueTable
              data={clues.map((clue) => ({ ...clue, clue: renderClue(clue) }))}
              headers={cluesFields}
              height={700}
              width={600}
            />
          </Box>
          <Flex
            flexShrink={0}
            gap={4}
            justify="center"
            justifyContent="flex-start"
            maxW="100%"
            overflowX="auto"
          >
            {currentQuery.length > 0 && (
              <RouterLinkButton
                label="Results"
                leftIcon={<ArrowBackIcon h={4} w={4} />}
                to={getClueSearchURL({ query: currentQuery })}
                variant="secondary"
              />
            )}
            <RouterLinkButton
              label="Search"
              leftIcon={<SearchIcon h={4} w={4} />}
              to={getClueSearchURL({})}
              variant="secondary"
            />
            <FileDownloadButton
              download={answer}
              href={cluesCSVURL}
              label="CSV"
            />
            <FileDownloadButton
              download={answer}
              href={cluesJSONURL}
              label="JSON"
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};

type EmptyResultsProps = { answer: string };

function EmptyResults({ answer }: EmptyResultsProps) {
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  return (
    <>
      <Container bg="gray.100" borderRadius="md" p={4}>
        <Text>
          No clues found for <strong>{answer}</strong>. Try checking your
          network connection or tweaking the search parameters.
        </Text>
      </Container>
      <RouterLinkButton
        label="Search"
        leftIcon={<SearchIcon h={4} w={4} />}
        to={getClueSearchURL({})}
        variant="secondary"
      />
    </>
  );
}

export default Clues;
