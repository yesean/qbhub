import { Skeleton, Stack } from '@chakra-ui/react';
import { getRange } from '@qbhub/utils';

type TableSkeletonProps = {
  rowCount?: number;
  rowHeight?: number;
};

export default function TableSkeleton({
  rowCount = 5,
  rowHeight = 40,
}: TableSkeletonProps) {
  return (
    <Stack>
      {getRange(1, rowCount).map((index) => (
        <Skeleton key={index} h={`${rowHeight}px`} />
      ))}
    </Stack>
  );
}
