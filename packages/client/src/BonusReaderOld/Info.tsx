import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import ReaderInfo from '../components/reader/Info';

const Info: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: {
      bonus: { category, difficulty, subcategory, tournament },
    },
  } = useSelector(selectBonusReader);

  const text = subcategory
    ? `${Tournament[tournament]} / ${Difficulty[difficulty]} / ${Category[category]} / ${Subcategory[subcategory]}`
    : `${Tournament[tournament]} / ${Difficulty[difficulty]} / ${Category[category]}`;

  return <ReaderInfo text={text} />;
};

export default Info;
