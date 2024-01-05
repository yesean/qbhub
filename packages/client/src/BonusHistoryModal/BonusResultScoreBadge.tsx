import { Badge } from '@chakra-ui/react';
import { BonusResult, BonusScore } from '@qbhub/types';

type BonusResultScoreBadgeProps = {
  result: BonusResult;
};

export default function BonusResultScoreBadge({
  result,
}: BonusResultScoreBadgeProps) {
  const colorScheme = (() => {
    switch (result.score) {
      case BonusScore.thirty:
        return 'green';
      case BonusScore.twenty:
        return 'green';
      case BonusScore.ten:
        return 'green';
      case BonusScore.zero:
        return 'gray';
    }
  })();

  return (
    <Badge colorScheme={colorScheme} variant="subtle">
      {result.score}
    </Badge>
  );
}
