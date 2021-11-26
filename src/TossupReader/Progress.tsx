import { Progress } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReaderStatus, selectStatus } from './tossupReaderSlice';

type TimerProgressProps = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};
const TimerProgress: React.FC<TimerProgressProps> = ({
  progress,
  setProgress,
}) => {
  const mode = useSelector(selectStatus);

  useEffect(() => {
    if (mode === ReaderStatus.answering) {
      const id = setTimeout(() => {
        setProgress((p) => (p > 0 ? p - 0.1 : 0));
      }, 5);
      return () => {
        window.clearTimeout(id);
      };
    }
    return () => {};
  }, [mode, progress, setProgress]);

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
