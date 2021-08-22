import { useContext } from 'react';
import { Heading } from '@chakra-ui/react';

import { Mode, ModeContext } from '../../../services/ModeContext';
import { Category, Difficulty } from '../../../types';

type InfoProps = {
  category: Category;
  difficulty: Difficulty;
  tournament: string;
};

const Info: React.FC<InfoProps> = ({ category, difficulty, tournament }) => {
  const { mode } = useContext(ModeContext);

  const infoText =
    mode === Mode.start
      ? ''
      : `${Category[category]} / ${tournament} / ${Difficulty[difficulty]}`;

  return (
    <Heading pl={4} size="sm" mb={4}>
      {infoText}
    </Heading>
  );
};

export default Info;
