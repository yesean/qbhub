import { Progress as ChakraProgress } from '@chakra-ui/react';
import { useEffect } from 'react';

type ProgressProps = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  shouldTick: boolean;
};

const PROGRESS_UPDATE_INTERVAL = 5;
const PROGRESS_UPDATE_AMOUNT = 0.1;

const Progress: React.FC<React.PropsWithChildren<ProgressProps>> = ({
  progress,
  setProgress,
  shouldTick,
}) => {
  useEffect(() => {
    if (shouldTick) {
      const id = setTimeout(() => {
        setProgress((p) => (p > 0 ? p - PROGRESS_UPDATE_AMOUNT : 0));
      }, PROGRESS_UPDATE_INTERVAL);
      return () => {
        window.clearTimeout(id);
      };
    }

    return undefined;
  }, [setProgress, shouldTick, progress]);

  return (
    <ChakraProgress
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

export default Progress;
