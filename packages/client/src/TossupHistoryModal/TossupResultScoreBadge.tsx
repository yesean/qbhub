import { Badge } from '@chakra-ui/react';
import { TossupResult, TossupScore } from '@qbhub/types';

type TossupResultScoreBadgeProps = {
  result: TossupResult;
};

export default function TossupResultScoreBadge({
  result,
}: TossupResultScoreBadgeProps) {
  const colorScheme = (() => {
    switch (result.score) {
      case TossupScore.power:
        return 'green';
      case TossupScore.ten:
        return 'green';
      case TossupScore.incorrect:
        return 'gray';
      case TossupScore.neg:
        return 'red';
    }
  })();

  return (
    <Badge colorScheme={colorScheme} variant="subtle">
      {result.score}
    </Badge>
  );
}
