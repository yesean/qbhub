import { Flex } from '@chakra-ui/react';
import { Bonus, BonusPartResult } from '@qbhub/types';
import { useMemo } from 'react';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import useAutoScrollIntoView from '../hooks/useAutoScrollIntoView';
import BonusReaderCurrentBonusPart from './BonusReaderCurrentBonusPart';
import BonusReaderPreviousBonusPart from './BonusReaderPreviousBonusPart';

type BonusReaderTextDisplayProps = QuestionContentDisplayProps & {
  bonus: Bonus;
  bonusPartNumber: number;
  bonusPartResults: BonusPartResult[];
};

export default function BonusReaderContentDisplay({
  bonus,
  bonusPartNumber,
  bonusPartResults,
  buzzIndex,
  status,
  visibleIndex,
  words,
}: BonusReaderTextDisplayProps) {
  const autoScrollDependencies = useMemo(
    () => [visibleIndex, status],
    [status, visibleIndex],
  );
  const visibleRef = useAutoScrollIntoView<HTMLParagraphElement>(
    autoScrollDependencies,
  );

  return (
    <Flex
      bg="gray.100"
      borderRadius="md"
      direction="column"
      gap={4}
      overflow="auto"
      p={4}
    >
      {bonusPartResults.slice(0, bonusPartNumber).map((bonusPartResult) => (
        <BonusReaderPreviousBonusPart
          key={bonusPartResult.number}
          bonus={bonus}
          bonusPartResult={bonusPartResult}
        />
      ))}
      <BonusReaderCurrentBonusPart
        bonusPartResult={bonusPartResults.at(-1)}
        buzzIndex={buzzIndex}
        status={status}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={words}
      />
    </Flex>
  );
}
