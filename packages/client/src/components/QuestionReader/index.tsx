import { Button } from '@chakra-ui/react';
import { Bonus, isTossup, Tossup } from '@qbhub/types';
import { useMemo } from 'react';
import { getTossupWords } from '../../utils/reader';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import { QuestionReaderContextProvider } from './QuestionReaderContext';
import QuestionText from './QuestionText';
import useRevealer from './useRevealer';

type Props = {
  question: Tossup | Bonus; // TODO: fix type
  onNextQuestion: () => void;
  onSubmitAnswer: () => void;
  onJudged: () => void;
};

export default ({ question }: Props) => {
  if (!isTossup(question)) return null;

  return (
    <QuestionReaderContextProvider question={question}>
      <QuestionInfo />
      <QuestionAnswer />
      <QuestionText textWords={textWords} visibleIndex={visibleIndex} />
      <Button mb={2} onClick={pause}>
        pause
      </Button>
      <Button mb={2} onClick={resume}>
        resume
      </Button>
      <Button onClick={reveal}>reveal</Button>
    </QuestionReaderContextProvider>
  );
};
