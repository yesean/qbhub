import { Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { selectCurrentTossup } from './tossupReaderSlice';

const Info: React.FC = () => {
  const { tournament, category, subcategory, difficulty } =
    useSelector(selectCurrentTossup);

  const info = subcategory
    ? `${tournament} / ${Difficulty[difficulty]} / ${Category[category]} / ${Subcategory[subcategory]}`
    : `${tournament} / ${Difficulty[difficulty]} / ${Category[category]}`;

  return (
    <Heading pl={4} size="sm" mb={4}>
      {info}
    </Heading>
  );
};

export default Info;
