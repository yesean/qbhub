import { Divider, VStack } from '@chakra-ui/react';
import { Bonus, BonusPartResult } from '@qbhub/types';
import { Fragment, useMemo } from 'react';

import { QuestionContentDisplayProps } from '../components/QuestionReader';
import QuestionContentContainer from '../components/QuestionReader/QuestionContentContainer';
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
    <QuestionContentContainer>
      <VStack align="stretch" spacing={4}>
        {bonusPartResults.slice(0, bonusPartNumber).map((bonusPartResult) => (
          <Fragment key={bonusPartResult.number}>
            <BonusReaderPreviousBonusPart
              bonus={bonus}
              bonusPartResult={bonusPartResult}
            />
            <Divider borderColor="gray.300" />
          </Fragment>
        ))}
        <BonusReaderCurrentBonusPart
          bonusPartResult={bonusPartResults.at(-1)}
          buzzIndex={buzzIndex}
          status={status}
          visibleIndex={visibleIndex}
          visibleRef={visibleRef}
          words={words}
        />
      </VStack>
    </QuestionContentContainer>
  );
}
