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
import { useEffect, useLayoutEffect, useState } from 'react';
import FileDownloadButton from '../components/buttons/FileDownloadButton';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { KeyValueTable } from '../components/tables';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toCSV, toJSON } from '../utils/array';
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
  { label: 'Clue', dataKey: 'clue' },
  { label: 'Score', dataKey: 'score' },
] as const;

const Clues: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { status, clues, currentQuery } = useAppSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const [CSVLink, setCSVLink] = useState('');
  const [JSONLink, setJSONLink] = useState('');
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();
  const { params } = useClueDisplayRouteContext();
  const answer = params.answer as string;
  const { settings } = useSettings();

  useEffect(() => {
    const cluesCSV = clues
      .filter((clue) => clue.score > 0)
      .map((clue) => [clue.text, answer, clue.sentence]);
    const url = toCSV(cluesCSV);
    setCSVLink(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [answer, clues]);

  useEffect(() => {
    const cluesJSON = clues
      .filter((clue) => clue.score > 0)
      .map((clue) => ({ ...clue, answer }));
    const url = toJSON(cluesJSON);
    setJSONLink(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [answer, clues]);

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
          <Heading size="sm" mb={1}>
            {clue.tournament}
          </Heading>
          <Text>{clue.sentence}</Text>
        </>
      );
    }
    return (
      <>
        <Heading size="sm" mb={1}>
          {clue.tournament}
        </Heading>
        <Text display="inline">{clue.sentence.substring(0, startIndex)}</Text>
        <Text display="inline" as="mark" bgColor="#fffea9">
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
      hasArrow
      placement="top"
      label={renderTooltip(clue)}
      borderRadius="5px"
      p={2}
    >
      <Text>{clue.text}</Text>
    </Tooltip>
  );

  if (status !== CluesGeneratorStatus.loaded) {
    return <CircularProgress isIndeterminate color="cyan" />;
  }

  return (
    <Flex
      gap={4}
      direction="column"
      w="100%"
      h="100%"
      justify="center"
      align="center"
    >
      {clues.length === 0 ? (
        <EmptyResults answer={answer} />
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
            Showing clues for:{' '}
            <Box as="span" bg="cyan.200" borderRadius="sm" p={1}>
              {answer}
            </Box>
          </Heading>
          <Box w="min(600px, 100%)" h="min(700px, 100%)" overflow="auto">
            <KeyValueTable
              data={clues.map((clue) => ({ ...clue, clue: renderClue(clue) }))}
              headers={cluesFields}
              width={600}
              height={700}
            />
          </Box>
          <Flex
            justify="center"
            overflowX="auto"
            flexShrink={0}
            gap={4}
            maxW="100%"
            justifyContent="flex-start"
          >
            {currentQuery.length > 0 && (
              <RouterLinkButton
                label="Results"
                to={getClueSearchURL({ query: currentQuery })}
                leftIcon={<ArrowBackIcon w={4} h={4} />}
                variant="secondary"
              />
            )}
            <RouterLinkButton
              label="Search"
              to={getClueSearchURL({})}
              leftIcon={<SearchIcon w={4} h={4} />}
              variant="secondary"
            />
            <FileDownloadButton href={CSVLink} download={answer} label="CSV" />
            <FileDownloadButton
              href={JSONLink}
              download={answer}
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
      <Container bg="gray.100" p={4} borderRadius="md">
        <Text>
          No clues found for <strong>{answer}</strong>. Try checking your
          network connection or tweaking the search parameters.
        </Text>
      </Container>
      <RouterLinkButton
        label="Search"
        to={getClueSearchURL({})}
        leftIcon={<SearchIcon w={4} h={4} />}
        variant="secondary"
      />
    </>
  );
}

export default Clues;
