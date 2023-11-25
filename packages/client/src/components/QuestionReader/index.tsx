import { Bonus, Tossup } from '@qbhub/types';
import QuestionAnswer from './QuestionAnswer';
import QuestionInfo from './QuestionInfo';
import { QuestionReaderContextProvider } from './QuestionReaderContext';
import QuestionText from './QuestionText';

type Props = {
  question: Tossup | Bonus; // TODO: fix type
  onNextQuestion: () => void;
  onSubmitAnswer: () => void;
  onJudged: () => void;
};

export default ({ question }: Props) => (
  <QuestionReaderContextProvider question={question}>
    <QuestionInfo />
    <QuestionAnswer />
    <QuestionText />
  </QuestionReaderContextProvider>
);
