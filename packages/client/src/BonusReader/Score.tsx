import { useSelector } from 'react-redux';
import ReaderScore from '../components/reader/Score';
import { ReaderStatus } from '../utils/reader';
import { selectBonusReader } from './bonusReaderSlice';

const Score: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: { result },
    score,
    status,
  } = useSelector(selectBonusReader);

  return (
    <ReaderScore
      score={score}
      delta={result.score}
      showDelta={status === ReaderStatus.judged}
    />
  );
};

export default Score;
