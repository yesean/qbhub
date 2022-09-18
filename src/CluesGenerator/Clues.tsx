import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  CircularProgress,
  Container,
  Flex,
  Heading,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileDownloadButton } from '../components/buttons';
import { KeyValueTable } from '../components/tables';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Clue } from '../types/tossups';
import { toCSV, toJSON } from '../utils/array';
import { ROUTES } from '../utils/routes';
import BackButton from './BackButton';
import {
  CluesGeneratorStatus,
  fetchClues,
  resetStatus,
  selectAnswer,
  selectCluesGenerator,
} from './cluesGeneratorSlice';
import SearchButton from './SearchButton';

const cluesFields = [
  { label: 'Clue', dataKey: 'clue' },
  { label: 'Score', dataKey: 'score' },
] as const;

const Clues: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { status, clues, currentQuery } = useAppSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { answer } = useParams<{ answer: string }>();
  const [CSVLink, setCSVLink] = useState('');
  const [JSONLink, setJSONLink] = useState('');

  useEffect(() => {
    const cluesCSV = clues
      .filter((clue) => clue.score > 0)
      .map((clue) => [clue.clue, answer, clue.sentence]);
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
    dispatch(fetchClues(answer));
  }, [dispatch, answer]);

  const renderTooltip = (clue: Clue) => {
    const startIndex = clue.sentence.indexOf(clue.clue);
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
          {clue.sentence.substring(startIndex, startIndex + clue.clue.length)}
        </Text>
        <Text display="inline">
          {clue.sentence.substring(startIndex + clue.clue.length)}
        </Text>
      </>
    );
  };

  const renderClue = (clue: Clue) => (
    <Tooltip
      hasArrow
      placement="top"
      label={renderTooltip(clue)}
      borderRadius="5px"
      p={2}
    >
      <Text>{clue.clue}</Text>
    </Tooltip>
  );

  const render = () => {
    if (status !== CluesGeneratorStatus.loaded) {
      return <CircularProgress isIndeterminate color="cyan" />;
    }

    if (clues.length === 0) {
      return (
        <Container bg="gray.100" p={4} borderRadius="md">
          <Text>
            No clues found for <strong>{answer}</strong>. Try checking your
            network connection or tweaking the search parameters.
          </Text>
        </Container>
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
          Showing clues for:{' '}
          <Box as="span" bg="cyan.200" borderRadius="sm" p={1}>
            {answer}
          </Box>
        </Heading>
        <Box w="min(600px, 100%)" h="min(700px, 100%)" mb={4} overflow="auto">
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
          maxW="100%"
          justifyContent="flex-start"
        >
          {currentQuery.length > 0 && (
            <BackButton
              label="Results"
              to={ROUTES.clues.searchResults(currentQuery)}
              mr={4}
            />
          )}
          <SearchButton label="Search" to={ROUTES.clues.search} mr={4} />
          <FileDownloadButton
            href={CSVLink}
            download={answer}
            mr={4}
            label="CSV"
            icon={<DownloadIcon w={6} h={6} />}
          />
          <FileDownloadButton
            href={JSONLink}
            download={answer}
            label="JSON"
            icon={<DownloadIcon w={6} h={6} />}
          />
        </Flex>
      </>
    );
  };

  return render();
};

export default Clues;
