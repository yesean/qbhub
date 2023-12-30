import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
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
import ClueDisplayHeadline from './ClueDisplayHeadline';
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
      justify="center"
      maxW="container.md"
      minW="351px"
      overflow="auto"
      w="60%"
    >
      <ClueDisplayHeadline headline={answer} leadingText="Showing clues for:" />
      <KeyValueTable
        data={clues.map((clue) => ({
          ...clue,
          clue: <ClueDisplayClue clue={clue} />,
        }))}
        headers={clueFields}
        height={700}
        width={1000}
      />
      <Flex flexShrink={0} gap={4} justify="start">
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
      <Flex
        direction="column"
        gap={4}
        justify="center"
        maxW="container.md"
        minW="351px"
        overflow="auto"
        w="60%"
      >
        <ClueDisplayHeadline
          headline={answer}
          leadingText="Searching clues for:"
        />
        <TableSkeleton />
      </Flex>
    );
  }

  return <ClueDisplayDisplay answer={answer} clues={clues} />;
}
