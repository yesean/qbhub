import { Progress as ChakraProgress } from '@chakra-ui/react';
import { useEffect } from 'react';

type ProgressProps = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  shouldTick: boolean;
};

const Progress: React.FC<React.PropsWithChildren<ProgressProps>> = ({
  progress,
  setProgress,
  shouldTick,
}) => {
  useEffect(() => {
    if (shouldTick) {
      const id = setTimeout(() => {
        setProgress((p) => (p > 0 ? p - 0.1 : 0));
      }, 5);
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
