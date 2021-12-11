import { Progress } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';

type TimerProgressProps = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};
const TimerProgress: React.FC<TimerProgressProps> = ({
  progress,
  setProgress,
}) => {
  const { status } = useSelector(selectTossupReader);

  const isAnswering = useMemo(
    () => [ReaderStatus.answering, ReaderStatus.prompting].includes(status),
    [status],
  );

  useEffect(() => {
    if (isAnswering) {
      const id = setTimeout(() => {
        setProgress((p) => (p > 0 ? p - 0.1 : 0));
      }, 5);
      return () => {
        window.clearTimeout(id);
      };
    }
    return () => {};
  }, [status, progress, setProgress, isAnswering]);

  return (
    <Progress
      hasStripe
      isAnimated
      colorScheme="cyan"
      borderRadius="sm"
      mb={4}
      value={progress}
      flexShrink={0}
    />
  );
};

export default TimerProgress;
