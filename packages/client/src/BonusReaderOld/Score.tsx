import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import ReaderScore from '../components/reader/Score';
import { ReaderStatus } from '../utils/reader';

const Score: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: { result },
    score,
    status,
  } = useSelector(selectBonusReader);

  return (
    <ReaderScore
      delta={result.score}
      score={score}
      showDelta={status === ReaderStatus.judged}
    />
  );
};

export default Score;
