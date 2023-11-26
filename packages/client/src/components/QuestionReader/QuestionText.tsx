import { Box } from '@chakra-ui/react';
import { isTossup } from '@qbhub/types';
import { useMemo } from 'react';
import { getTossupWords } from '../../utils/reader';
import FormattedQuestion from '../reader/FormattedQuestion';
import { useQuestionReaderContext } from './QuestionReaderContext';
import useRevealer from './useRevealer';

export default () => {
  const { question } = useQuestionReaderContext();

  if (!isTossup(question)) return null;

  const textWords = useMemo(
    () => getTossupWords(question.formattedText),
    [question.formattedText],
  );

  const { visibleIndex } = useRevealer({
    words: textWords,
    onFinish: () => {},
  });

  return (
    <Box overflow="auto" bg="gray.100" p={4} borderRadius="md">
      <FormattedQuestion
        words={textWords}
        indices={{ visible: visibleIndex }}
      />
    </Box>
  );
};
