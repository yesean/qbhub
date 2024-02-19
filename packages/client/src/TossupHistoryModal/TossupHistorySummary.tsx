import { Center, Flex, Heading, Text } from '@chakra-ui/react';
import { TossupScore } from '@qbhub/types';
import { useSelector } from 'react-redux';

import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import { getTossupResultsSummary } from '../utils/tossup';

export default function TossupHistorySummary() {
  const { results } = useSelector(selectTossupReader);
  const tossupResultsSummary = getTossupResultsSummary(results);

  return (
    <Center overflow="auto">
      <Flex align="center" gap={[3, 6, 12]} overflow="auto" wrap="wrap">
        <ScoreBadge
          description="Powers"
          value={tossupResultsSummary.scoreCounts[TossupScore.power]}
          variant={TossupScore.power}
        />
        <ScoreBadge
          description="Tens"
          value={tossupResultsSummary.scoreCounts[TossupScore.ten]}
          variant={TossupScore.ten}
        />
        <ScoreBadge
          description="Score"
          value={tossupResultsSummary.score}
          variant="total"
        />
        <ScoreBadge
          description="Incorrect"
          value={tossupResultsSummary.scoreCounts[TossupScore.incorrect]}
          variant={TossupScore.incorrect}
        />
        <ScoreBadge
          description="Negs"
          value={tossupResultsSummary.scoreCounts[TossupScore.neg]}
          variant={TossupScore.neg}
        />
      </Flex>
    </Center>
  );
}

type ScoreBadgeProps = {
  description: string;
  value: number;
  variant: TossupScore | 'total';
};

function ScoreBadge({ description, value, variant }: ScoreBadgeProps) {
  const { backgroundColor, borderColor } = (() => {
    switch (variant) {
      case TossupScore.power:
        return { backgroundColor: 'green.100', borderColor: 'green.400' };
      case TossupScore.ten:
        return { backgroundColor: 'green.100', borderColor: 'green.300' };
      case TossupScore.incorrect:
        return { backgroundColor: 'gray.100', borderColor: 'gray.300' };
      case TossupScore.neg:
        return { backgroundColor: 'red.100', borderColor: 'red.300' };
      case 'total':
        return { backgroundColor: 'cyan.100', borderColor: 'cyan.300' };
    }
  })();

  const radius =
    variant === 'total' ? ['50px', '70px', '100px'] : ['40px', '45px', '50px'];

  return (
    <Flex align="center" direction="column">
      <Center
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        borderRadius="full"
        borderWidth={3}
        h={radius}
        w={radius}
      >
        <Text
          as="b"
          fontSize={variant === 'total' ? ['xl', '2xl'] : ['md', 'lg']}
        >
          {value}
        </Text>
      </Center>
      <Heading
        size={variant === 'total' ? ['sm', 'md', 'lg'] : ['xs', 'sm', 'md']}
      >
        {description}
      </Heading>
    </Flex>
  );
}
