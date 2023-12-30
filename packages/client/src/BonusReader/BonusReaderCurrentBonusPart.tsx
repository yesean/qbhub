import { BonusPartResult } from '@qbhub/types';
import { FormattedQuestionProps } from '../components/FormattedQuestion';
import { QuestionReaderStatus } from '../utils/questionReader';
import BonusReaderAnswer from './BonusReaderAnswer';
import BonusReaderTextSection from './BonusReaderTextSection';

type BonusReaderCurrentBonusPartProps = FormattedQuestionProps & {
  bonusPartResult: BonusPartResult | undefined;
  status: QuestionReaderStatus;
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
        visibleRef={shouldShowAnswer ? undefined : visibleRef}
        words={words}
      />
      {shouldShowAnswer && bonusPartResult !== undefined && (
        <BonusReaderAnswer
          bonusPartResult={bonusPartResult}
          visibleRef={shouldShowAnswer ? visibleRef : undefined}
        />
      )}
    </>
  );
}
