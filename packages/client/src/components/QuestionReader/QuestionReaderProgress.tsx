import { Progress as ChakraProgress } from '@chakra-ui/react';
import { useEffect } from 'react';

type Props = {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

const PROGRESS_UPDATE_INTERVAL = 5;
const PROGRESS_UPDATE_AMOUNT = 0.1;

export default ({ progress, setProgress }: Props) => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (progress > 0) setProgress(progress - PROGRESS_UPDATE_AMOUNT);
    }, PROGRESS_UPDATE_INTERVAL);

    return () => clearTimeout(timeoutID);
  }, [setProgress, progress]);

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
