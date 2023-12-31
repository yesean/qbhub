import { Skeleton, Stack } from '@chakra-ui/react';
import { getRange } from '@qbhub/utils';

export default function TableSkeleton() {
  return (
    <Stack>
      {getRange(0, 4).map((index) => (
        <Skeleton key={index} h="40px" />
      ))}
    </Stack>
  );
}
