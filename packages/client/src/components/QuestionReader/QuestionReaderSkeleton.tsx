import { Flex, Skeleton, Stack } from '@chakra-ui/react';

// Skeleton loading state for Question Reader
export default function QuestionReaderSkeleton() {
  return (
    <Stack maxW="container.md" w="100%">
      <Skeleton h="40px" w="85%" />
      <Skeleton h="200px" />
      <Flex gap={2}>
        <Skeleton flexGrow={1} h="40px" />
        <Skeleton flexBasis="60px" h="40px" />
      </Flex>
    </Stack>
  );
}
