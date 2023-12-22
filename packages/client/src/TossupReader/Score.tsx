import { useSelector } from 'react-redux';
import ReaderScore from '../components/reader/Score';
import { ReaderStatus } from '../utils/reader';
import { selectTossupReader } from './tossupReaderSlice';

const Score: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { results, score, status } = useSelector(selectTossupReader);

  const lastResult = results.at(-1);
  if (lastResult === undefined) return null;

  return (
    <ReaderScore
      delta={lastResult.score}
      score={score}
      showDelta={status === ReaderStatus.judged}
    />
  );
};

export default Score;
