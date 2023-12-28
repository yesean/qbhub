import { Skeleton, Stack } from '@chakra-ui/react';
import { range } from '../utils/array';

export default function SearchResultsSkeleton() {
  return (
    <Stack>
      {range(5).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={index} h="40px" />
      ))}
    </Stack>
  );
}
