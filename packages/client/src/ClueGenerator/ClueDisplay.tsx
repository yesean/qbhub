import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import { SelectedClue } from '@qbhub/types';
import { getCSVURL, getJSONURL } from '@qbhub/utils';
import { useEffect } from 'react';

import FileDownloadButton from '../components/buttons/FileDownloadButton';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import RouterRedirect from '../components/routing/RouterRedirect';
import TableSkeleton from '../components/table/TableSkeleton';
import useActions from '../hooks/useActions';
import { useAppSelector } from '../redux/utils';
import { ROUTES } from '../routes';
import ClueDisplayEmptyResults from './ClueDisplayEmptyResults';
import ClueDisplayHeadline from './ClueDisplayHeadline';
import ClueDisplayTable from './ClueDisplayTable';
import { selectClueGenerator } from './clueGeneratorSlice';

type ClueDisplayDisplayProps = {
  answer: string;
  clues: SelectedClue[];
};

function ClueDisplayDisplay({ answer, clues }: ClueDisplayDisplayProps) {
  const { getURL: getClueSearchURL } = ROUTES.clueSearch.useRouteContext();

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
      <ClueDisplayTable clues={clues} maxH={700} overflowY="auto" />
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
  const { getURL: getClueSearchURL } = ROUTES.clueSearch.useRouteContext();
  const {
    params: { answer },
  } = ROUTES.clueDisplay.useRouteContext();
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
