import { Flex } from '@chakra-ui/react';

import ClueSearchInput from './ClueSearchInput';
import ClueSearchResults from './ClueSearchResults';

export default function ClueSearch() {
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
      <ClueSearchInput />
      <ClueSearchResults />
    </Flex>
  );
}
