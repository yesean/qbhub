import { Center, Flex, Heading, Text } from '@chakra-ui/react';
import { BonusScore } from '@qbhub/types';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import { getBonusResultsSummary } from '../utils/bonus';

export default function BonusHistorySummary() {
  const { results } = useSelector(selectBonusReader);
  const bonusResultsSummary = getBonusResultsSummary(results);

  return (
    <Center overflow="auto">
      <Flex align="center" gap={[3, 6, 12]} overflow="auto" wrap="wrap">
        <ScoreBadge
          description="Thirties"
          value={bonusResultsSummary.scoreCounts[BonusScore.thirty]}
          variant={BonusScore.thirty}
        />
        <ScoreBadge
          description="Twenties"
          value={bonusResultsSummary.scoreCounts[BonusScore.twenty]}
          variant={BonusScore.twenty}
        />
        <ScoreBadge
          description="Score"
          value={bonusResultsSummary.score}
          variant="total"
        />
        <ScoreBadge
          description="Tens"
          value={bonusResultsSummary.scoreCounts[BonusScore.ten]}
          variant={BonusScore.ten}
        />
        <ScoreBadge
          description="Zeros"
          value={bonusResultsSummary.scoreCounts[BonusScore.zero]}
          variant={BonusScore.zero}
        />
      </Flex>
    </Center>
  );
}

type ScoreBadgeProps = {
  description: string;
  value: number;
  variant: BonusScore | 'total';
};

function ScoreBadge({ description, value, variant }: ScoreBadgeProps) {
  const { backgroundColor, borderColor } = (() => {
    switch (variant) {
      case BonusScore.thirty:
        return { backgroundColor: 'green.100', borderColor: 'green.400' };
      case BonusScore.twenty:
        return { backgroundColor: 'green.100', borderColor: 'green.300' };
      case BonusScore.ten:
        return { backgroundColor: 'green.100', borderColor: 'green.300' };
      case BonusScore.zero:
        return { backgroundColor: 'gray.100', borderColor: 'gray.300' };
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
