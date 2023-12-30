import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading } from '@chakra-ui/react';
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
import ClueDisplayClue from './ClueDisplayClue';
import ClueDisplayEmptyResults from './ClueDisplayEmptyResults';
import { selectClueGenerator } from './clueGeneratorSlice';

const clueFields = [
  { dataKey: 'clue', label: 'Clue' },
  { dataKey: 'score', label: 'Score' },
] as const;

type ClueDisplayDisplayProps = {
  answer: string;
  clues: SelectedClue[];
};

function ClueDisplayDisplay({ answer, clues }: ClueDisplayDisplayProps) {
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  if (clues.length === 0) {
    return <ClueDisplayEmptyResults answer={answer} />;
  }

  const cluesCSVURL = getCSVURL(
    clues
      .filter((clue) => clue.score > 0)
      .map((clue) => [clue.text, answer, clue.sentence]),
  );

  const cluesJSONURL = getJSONURL(
    clues.filter((clue) => clue.score > 0).map((clue) => ({ ...clue, answer })),
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
          data={clues.map((clue) => ({
            ...clue,
            clue: <ClueDisplayClue clue={clue} />,
          }))}
          headers={clueFields}
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
        <FileDownloadButton download={answer} href={cluesCSVURL} label="CSV" />
        <FileDownloadButton
          download={answer}
          href={cluesJSONURL}
          label="JSON"
        />
      </Flex>
    </Flex>
  );
}

export default function ClueDisplay() {
  const { clues, isFetching } = useAppSelector(selectClueGenerator);
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

  return <ClueDisplayDisplay answer={answer} clues={clues} />;
}
