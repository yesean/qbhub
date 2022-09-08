import { useSelector } from 'react-redux';
import ReaderResult from '../components/reader/Result';
import { TossupScore } from '../types/tossups';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';

const Result: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    status,
    current: {
      result: { score },
    },
  } = useSelector(selectTossupReader);

  let text;
  if (status === ReaderStatus.prompting) text = 'Prompt!';
  else if (score === TossupScore.power) text = '🎉  Power!  🥳';
  else if (score === TossupScore.ten) text = 'Ten!';
  else if (score === TossupScore.neg) text = 'Neg!';
  else text = 'Incorrect.';

  return <ReaderResult text={text} />;
};

export default Result;
