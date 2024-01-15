import { Box, Text } from '@chakra-ui/react';

export default function EmptyFrequencyListNotice() {
  return (
    <Box bg="gray.100" borderRadius="md" maxH="100%" overflow="auto" p={4}>
      <Text maxH="100%">
        No answerlines found, try adjusting your question settings.
      </Text>
    </Box>
  );
}
