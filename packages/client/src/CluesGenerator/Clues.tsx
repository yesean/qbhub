import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  Highlight,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { SelectedClue } from '@qbhub/types';
import { useEffect } from 'react';
import RouterRedirect from '../components/RouterRedirect';
import TableSkeleton from '../components/TableSkeleton';
import FileDownloadButton from '../components/buttons/FileDownloadButton';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { KeyValueTable } from '../components/tables';
import useActions from '../hooks/useActions';
import { useAppSelector } from '../redux/hooks';
import { getCSVURL, getJSONURL } from '../utils/array';
import {
  useClueDisplayRouteContext,
  useClueSearchRouteContext,
} from '../utils/routes';
import { selectCluesGenerator } from './cluesGeneratorSlice';

const cluesFields = [
  { dataKey: 'clue', label: 'Clue' },
  { dataKey: 'score', label: 'Score' },
] as const;

type CluesDisplayProps = {
  answer: string;
  clues: SelectedClue[];
};

function CluesDisplay({ answer, clues }: CluesDisplayProps) {
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  const cluesCSVURL = getCSVURL(
    clues
      .filter((clue) => clue.score > 0)
      .map((clue) => [clue.text, answer, clue.sentence]),
  );

  const cluesJSONURL = getJSONURL(
    clues.filter((clue) => clue.score > 0).map((clue) => ({ ...clue, answer })),
  );

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
            <RouterLinkButton
              label="Search"
              leftIcon={<ArrowBackIcon h={4} w={4} />}
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
}

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

export default function Clues() {
  const { clues, isFetching } = useAppSelector(selectCluesGenerator);
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();
  const {
    params: { answer },
  } = useClueDisplayRouteContext();
  const { dispatchFetchClues } = useActions();

  useEffect(() => {
    if (answer === undefined) return;

    const promise = dispatchFetchClues(answer);
    return () => promise.abort();
  }, [answer, dispatchFetchClues]);

  if (answer === undefined) {
    return <RouterRedirect to={getClueSearchURL({})} />;
  }

  if (clues === undefined || isFetching) {
    return (
      <Box maxW="container.md" minW="300px" w="60%">
        <Heading
          as="h2"
          lineHeight="1.5"
          maxW="600px"
          mb={4}
          px={4}
          size="md"
          textAlign="center"
        >
          Searching clues for:{' '}
          <Box as="span" bg="cyan.200" borderRadius="sm" p={1}>
            {answer}
          </Box>
        </Heading>
        <TableSkeleton />
      </Box>
    );
  }

  return <CluesDisplay answer={answer} clues={clues} />;
}
