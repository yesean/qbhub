import { SearchIcon } from '@chakra-ui/icons';
import { Container, Flex, Text } from '@chakra-ui/react';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { ROUTES } from '../routes';
import ClueDisplayHeadline from './ClueDisplayHeadline';

type ClueDisplayEmptyResultsProps = { answer: string };

export default function ClueDisplayEmptyResults({
  answer,
}: ClueDisplayEmptyResultsProps) {
  const { getURL: getClueSearchURL } = ROUTES.clueSearch.useRouteContext();

  return (
    <Flex align="center" direction="column" gap={4}>
      <ClueDisplayHeadline headline={answer} leadingText="Showing clues for:" />
      <Container bg="gray.100" borderRadius="md" p={4}>
        <Text>
          No clues found for this answerline. Try searching for another
          answerline or adjusting your question settings.
        </Text>
      </Container>
      <RouterLinkButton
        label="Search"
        leftIcon={<SearchIcon h={4} w={4} />}
        to={getClueSearchURL({})}
        variant="secondary"
      />
    </Flex>
  );
}
