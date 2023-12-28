import { Flex } from '@chakra-ui/react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

export default function Search() {
  return (
    <Flex direction="column" gap={4} maxW="container.md" minW="300px" w="60%">
      <SearchInput />
      <SearchResults />
    </Flex>
  );
}
