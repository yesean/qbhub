import { useSelector } from 'react-redux';
import ReaderAnswer from '../components/reader/Answer';
import { selectTossupReader } from './tossupReaderSlice';

const Answer: React.FC = () => {
  const {
    current: {
      tossup: { formattedAnswer, normalizedAnswer },
    },
  } = useSelector(selectTossupReader);

  return <ReaderAnswer text={formattedAnswer} query={normalizedAnswer} />;
};

export default Answer;
