import { Box, Text } from '@chakra-ui/react';

type ClueSearchEmptyResultsProps = { query: string };

export default function ClueSearchEmptyResults({
  query,
}: ClueSearchEmptyResultsProps) {
  return (
    <Box bg="gray.100" borderRadius="md" maxH="100%" overflow="auto" p={4}>
      <Text maxH="100%">
        No answerlines matching <strong>{query}</strong>. Try searching for
        another answerline or adjusting your question settings.
      </Text>
    </Box>
  );
}
