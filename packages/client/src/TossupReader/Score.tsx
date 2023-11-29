import { useSelector } from 'react-redux';
import ReaderScore from '../components/reader/Score';
import { ReaderStatus } from '../utils/reader';
import { selectTossupReader } from './tossupReaderSlice';

const Score: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: { result },
    score,
    status,
  } = useSelector(selectTossupReader);

  return (
    <ReaderScore
      delta={result.score}
      score={score}
      showDelta={status === ReaderStatus.judged}
    />
  );
};

export default Score;
