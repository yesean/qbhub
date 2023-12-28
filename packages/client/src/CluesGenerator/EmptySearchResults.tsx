import { Box, Text } from '@chakra-ui/react';

type EmptySearchResultsProps = { query: string };

export default function EmptySearchResults({ query }: EmptySearchResultsProps) {
  return (
    <Box bg="gray.100" borderRadius="md" maxH="100%" overflow="auto" p={4}>
      <Text maxH="100%">
        No answerlines matching <strong>{query}</strong>. Try checking your
        network connection or tweaking the search parameters.
      </Text>
    </Box>
  );
}
