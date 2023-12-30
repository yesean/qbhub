import { Flex } from '@chakra-ui/react';
import ClueSearchInput from './ClueSearchInput';
import ClueSearchResults from './ClueSearchResults';

export default function ClueSearch() {
  return (
    <Flex
      direction="column"
      gap={4}
      justify="center"
      maxH="100%"
      maxW="container.md"
      minW="300px"
      py={4}
      w="60%"
    >
      <ClueSearchInput />
      <ClueSearchResults />
    </Flex>
  );
}
