import { useSelector } from 'react-redux';
import ReaderScore from '../components/reader/Score';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';

const Score: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    status,
    score,
    current: { result },
  } = useSelector(selectTossupReader);

  return (
    <ReaderScore
      score={score}
      delta={result.score}
      showDelta={status === ReaderStatus.judged}
    />
  );
};

export default Score;
