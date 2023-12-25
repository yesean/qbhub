import { BonusPartResult } from '@qbhub/types';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import { QuestionReaderStatus } from '../utils/questionReader';
import BonusReaderAnswer from './BonusReaderAnswer';
import BonusReaderTextSection from './BonusReaderTextSection';

type BonusReaderCurrentBonusPartProps = Omit<
  QuestionContentDisplayProps,
  'question'
> & {
  bonusPartResult: BonusPartResult | undefined;
};

export default function BonusReaderCurrentBonusPart({
  bonusPartResult,
  buzzIndex,
  status,
  visibleIndex,
  visibleRef,
  words,
}: BonusReaderCurrentBonusPartProps) {
  const shouldShowAnswer = status === QuestionReaderStatus.Judged;

  return (
    <>
      <BonusReaderTextSection
        buzzIndex={buzzIndex}
        visibleIndex={visibleIndex}
        visibleRef={visibleRef}
        words={words}
      />
      {shouldShowAnswer && bonusPartResult !== undefined && (
        <BonusReaderAnswer bonusPartResult={bonusPartResult} />
      )}
    </>
  );
}
