import { Progress as ChakraProgress } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type Props = {
  onFinish: () => void;
  duration?: number; // in milliseconds, default to 10 seconds
};

const PROGRESS_TOTAL_UPDATE_FRAMES = 1000; // number of progress updates between 100->0, i.e. controls progress smoothness

export default function QuestionReaderProgress({
  onFinish,
  duration = 10000,
}: Props) {
  const [progress, setProgress] = useState(100);

  const updateInterval = duration / PROGRESS_TOTAL_UPDATE_FRAMES;
  const updateAmount = 100 / PROGRESS_TOTAL_UPDATE_FRAMES;

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (progress <= 0) {
        onFinish();
      } else {
        setProgress(progress - updateAmount);
      }
    }, updateInterval);

    return () => clearTimeout(timeoutID);
  }, [onFinish, progress, updateAmount, updateInterval]);

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
}
