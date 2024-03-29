import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';
import { useSelector } from 'react-redux';
import ReaderInfo from '../components/reader/Info';
import { selectTossupReader } from './tossupReaderSlice';

const Info: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: {
      tossup: { tournament, category, subcategory, difficulty },
    },
  } = useSelector(selectTossupReader);

  const text = subcategory
    ? `${Tournament[tournament]} / ${Difficulty[difficulty]} / ${Category[category]} / ${Subcategory[subcategory]}`
    : `${Tournament[tournament]} / ${Difficulty[difficulty]} / ${Category[category]}`;

  return <ReaderInfo text={text} />;
};

export default Info;
