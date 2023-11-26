import { Progress as ChakraProgress } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type Props = {
  onFinish: () => void;
};

const PROGRESS_UPDATE_INTERVAL = 5;
const PROGRESS_UPDATE_AMOUNT = 0.1;

export default ({ onFinish }: Props) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (progress <= 0) {
        onFinish();
      } else {
        setProgress(progress - PROGRESS_UPDATE_AMOUNT);
      }
    }, PROGRESS_UPDATE_INTERVAL);

    return () => clearTimeout(timeoutID);
  }, [setProgress, progress, onFinish]);

  return (
    <ChakraProgress
      hasStripe
      isAnimated
      colorScheme="cyan"
      borderRadius="sm"
      value={progress}
      flexShrink={0}
    />
  );
};
