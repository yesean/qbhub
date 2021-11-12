import { useContext } from 'react';
import { Heading } from '@chakra-ui/react';

import { Mode, ModeContext } from '../../services/ModeContext';
import { Category, Difficulty, Subcategory } from '../../types/questions';

type InfoProps = {
  category: Category;
  subcategory: Subcategory;
  difficulty: Difficulty;
  tournament: string;
};

const Info: React.FC<InfoProps> = ({
  category,
  subcategory,
  difficulty,
  tournament,
}) => {
  const { mode } = useContext(ModeContext);

  const info = subcategory
    ? `${tournament} / ${Difficulty[difficulty]} / ${Category[category]} / ${Subcategory[subcategory]}`
    : `${tournament} / ${Difficulty[difficulty]} / ${Category[category]}`;

  const infoText = mode === Mode.start ? '' : info;

  return (
    <Heading pl={4} size="sm" mb={4}>
      {infoText}
    </Heading>
  );
};

export default Info;
