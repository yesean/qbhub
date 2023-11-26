import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { getTossupWords } from '../../utils/reader';
import FormattedQuestion from '../reader/FormattedQuestion';
import {
  QuestionReaderStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';
import useRevealer from './useRevealer';

export default () => {
  const { question, status, setStatus } = useQuestionReaderContext();

  const textWords = useMemo(
    () => getTossupWords(question.formattedText),
    [question.formattedText],
  );

  const { visibleIndex } = useRevealer({
    words: textWords,
    onFinish: () => {
      if (status === QuestionReaderStatus.Reading)
        setStatus(QuestionReaderStatus.Answering);
    },
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
