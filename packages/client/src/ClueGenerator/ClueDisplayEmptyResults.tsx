import { SearchIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { useClueSearchRouteContext } from '../utils/routes';

type ClueDisplayEmptyResultsProps = { answer: string };

export default function ClueDisplayEmptyResults({
  answer,
}: ClueDisplayEmptyResultsProps) {
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  return (
    <>
      <Container bg="gray.100" borderRadius="md" mb={4} p={4}>
        <Text>
          No clues found for: <strong>{answer}</strong>. Try checking your
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
