import { VStack } from '@chakra-ui/react';
import { Tossup } from '@qbhub/types';
import { useMemo } from 'react';
import FormattedQuestion from '../components/FormattedQuestion';
import { QuestionContentDisplayProps } from '../components/QuestionReader';
import QuestionContentContainer from '../components/QuestionReader/QuestionContentContainer';
import useAutoScrollIntoView from '../hooks/useAutoScrollIntoView';
import { QuestionReaderStatus } from '../utils/questionReader';
import TossupReaderAnswerDisplay from './TossupReaderAnswerDisplay';

type TossupReaderTextDisplayProps = QuestionContentDisplayProps & {
  tossup: Tossup;
};

export default function TossupReaderContentDisplay({
  buzzIndex,
  status,
  tossup,
  visibleIndex,
  words,
}: TossupReaderTextDisplayProps) {
  const autoScrollDependencies = useMemo(
    () => [visibleIndex, status],
    [status, visibleIndex],
  );
  const visibleRef = useAutoScrollIntoView<HTMLParagraphElement>(
    autoScrollDependencies,
  );

  const shouldShowAnswer = status === QuestionReaderStatus.Judged;
  return (
    <VStack align="stretch" overflow="auto" spacing={4}>
      {shouldShowAnswer && (
        <QuestionContentContainer flex="1 0 auto" maxH="100px">
          <TossupReaderAnswerDisplay tossup={tossup} />
        </QuestionContentContainer>
      )}
      <QuestionContentContainer>
        <FormattedQuestion
          buzzIndex={buzzIndex}
          visibleIndex={visibleIndex}
          visibleRef={visibleRef}
          words={words}
        />
      </QuestionContentContainer>
    </VStack>
  );
}
