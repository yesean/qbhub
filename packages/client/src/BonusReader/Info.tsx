import { useSelector } from 'react-redux';
import ReaderInfo from '../components/reader/Info';
import {
  Category,
  Difficulty,
  Subcategory,
  Tournament,
} from '../types/questions';
import { selectBonusReader } from './bonusReaderSlice';

const Info: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: {
      bonus: { tournament, category, subcategory, difficulty },
    },
  } = useSelector(selectBonusReader);

  const text = subcategory
    ? `${Tournament[tournament]} / ${Difficulty[difficulty]} / ${Category[category]} / ${Subcategory[subcategory]}`
    : `${Tournament[tournament]} / ${Difficulty[difficulty]} / ${Category[category]}`;

  return <ReaderInfo text={text} />;
};

export default Info;
