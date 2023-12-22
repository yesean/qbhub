import { TossupScore } from '@qbhub/types';
import { useSelector } from 'react-redux';
import ReaderResult from '../components/reader/Result';
import { random } from '../utils/array';
import { ReaderStatus } from '../utils/reader';
import { selectTossupReader } from './tossupReaderSlice';

const messages = {
  neg: ['Neg', 'Incorrect'],
  other: ['Incorrect, no penalty'],
  power: ['🎉  Power!  🥳', '🎉  Fifteen!  🥳'],
  prompt: ['Prompt!'],
  ten: ['Ten!', 'Correct!'],
};

const Result: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { results, status } = useSelector(selectTossupReader);

  const lastResult = results.at(-1);
  if (lastResult === undefined) return null;
  const { score } = lastResult;

  let text;
  if (status === ReaderStatus.prompting) text = random(messages.prompt);
  else if (score === TossupScore.power) text = random(messages.power);
  else if (score === TossupScore.ten) text = random(messages.ten);
  else if (score === TossupScore.neg) text = random(messages.neg);
  else text = random(messages.other);

  return <ReaderResult text={text} />;
};

export default Result;
