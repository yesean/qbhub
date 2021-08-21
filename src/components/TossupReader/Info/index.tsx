import { Heading } from '@chakra-ui/react';
import { Category, Difficulty } from '../../../types';

type InfoProps = {
  category: Category;
  difficulty: Difficulty;
  tournament: string;
};

const Info: React.FC<InfoProps> = ({ category, difficulty, tournament }) => {
  return (
    <Heading pl={4} size="sm" mb={4}>
      {`${Category[category]} / ${tournament} / ${Difficulty[difficulty]}`}
    </Heading>
  );
};

export default Info;
