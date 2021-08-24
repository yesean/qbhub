import { useContext, useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react';

import { Mode, ModeContext } from '../../../services/ModeContext';

const TimerProgress: React.FC = () => {
  const { mode, setMode } = useContext(ModeContext);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (mode === Mode.answering) {
      const id = setTimeout(() => {
        setProgress((p) => (p > 0 ? p - 0.05 : 0));
      }, 5);
      return () => {
        window.clearTimeout(id);
      };
    }
    return () => {};
  }, [mode, progress]);

  useEffect(() => {
    if (progress === 0) {
      setMode(Mode.submitting);
    }
  }, [progress, setMode]);

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
