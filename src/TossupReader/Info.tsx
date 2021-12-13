import { Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { selectTossupReader } from './tossupReaderSlice';

const Info: React.FC = () => {
  const {
    current: {
      tossup: { tournament, category, subcategory, difficulty },
    },
  } = useSelector(selectTossupReader);

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
