import { useSelector } from 'react-redux';
import ReaderResult from '../components/reader/Result';
import { BonusScore } from '../types/bonus';
import { ReaderStatus, selectBonusReader } from './bonusReaderSlice';

const Result: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    status,
    current: {
      result: { score },
      partResult,
    },
  } = useSelector(selectBonusReader);

  let text;
  if (status === ReaderStatus.prompting) text = 'Prompt!';
  else if (status === ReaderStatus.partialJudged)
    text = partResult.isCorrect ? 'Correct' : 'Incorrect';
  else if (score === BonusScore.thirty) text = '🎉  All Thirty!  🥳';
  else if (score === BonusScore.twenty) text = 'Twenty';
  else if (score === BonusScore.ten) text = 'Ten';
  else text = 'Bagel';

  return <ReaderResult text={text} />;
};

export default Result;
