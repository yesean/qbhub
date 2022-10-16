import { useSelector } from 'react-redux';
import ReaderResult from '../components/reader/Result';
import { TossupScore } from '../types/tossups';
import { random } from '../utils/array';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';

const messages = {
  prompt: ['Prompt!'],
  power: ['🎉  Power!  🥳', '🎉  Fifteen!  🥳'],
  ten: ['Ten!', 'Correct!'],
  neg: ['Neg', 'Incorrect'],
  other: ['Incorrect, no penalty'],
};

const Result: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    status,
    current: {
      result: { score },
    },
  } = useSelector(selectTossupReader);

  let text;
  if (status === ReaderStatus.prompting) text = random(messages.prompt);
  else if (score === TossupScore.power) text = random(messages.power);
  else if (score === TossupScore.ten) text = random(messages.ten);
  else if (score === TossupScore.neg) text = random(messages.neg);
  else text = random(messages.other);

  return <ReaderResult text={text} />;
};

export default Result;
