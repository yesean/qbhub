import { useSelector } from 'react-redux';
import ReaderInfo from '../components/reader/Info';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { selectTossupReader } from './tossupReaderSlice';

const Info: React.FC = () => {
  const {
    current: {
      tossup: { tournament, category, subcategory, difficulty },
    },
  } = useSelector(selectTossupReader);

  const text = subcategory
    ? `${tournament} / ${Difficulty[difficulty]} / ${Category[category]} / ${Subcategory[subcategory]}`
    : `${tournament} / ${Difficulty[difficulty]} / ${Category[category]}`;

  return <ReaderInfo text={text} />;
};

export default Info;
