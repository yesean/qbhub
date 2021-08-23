import { useContext, useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react';

import { Mode, ModeContext } from '../../../services/ModeContext';

const TimerProgress: React.FC = () => {
  const { mode, setMode } = useContext(ModeContext);
  const [progress, setProgress] = useState(100);
  const [decrementIds, setDecrementIds] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (mode === Mode.answering) {
      const id = setTimeout(() => {
        setProgress((p) => (p > 0 ? p - 0.05 : 0));
      }, 5);
      setDecrementIds((ids) => [...ids, id]);
    }
  }, [mode, progress]);

  useEffect(() => {
    if (progress === 0) {
      decrementIds.forEach(window.clearTimeout);
      setMode(Mode.revealed);
    }
  }, [progress, setMode, decrementIds]);

  return (
    <Progress
      hasStripe
      isAnimated
      colorScheme="cyan"
      borderRadius="sm"
      mb={4}
      value={progress}
    />
  );
};

export default TimerProgress;
