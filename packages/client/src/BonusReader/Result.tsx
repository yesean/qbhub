import { useSelector } from 'react-redux';
import ReaderResult from '../components/reader/Result';
import { BonusScore } from '../types/bonus';
import { random } from '../utils/array';
import { ReaderStatus, selectBonusReader } from './bonusReaderSlice';

const messages = {
  prompt: ['Prompt!'],
  correct: ['Correct!'],
  incorrect: ['Incorrect.'],
  thirty: [
    '🎉  All Thirty!  🥳',
    '🎉  For Thirty!  🥳',
    '🎉  All Correct!  🥳',
  ],
  twenty: ['Twenty!'],
  ten: ['Ten!'],
  zero: ['Bagel.', 'Zero.'],
};

const Result: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    status,
    current: {
      result: { score },
      partResult,
    },
  } = useSelector(selectBonusReader);

  let text;
  if (status === ReaderStatus.prompting) text = random(messages.prompt);
  else if (status === ReaderStatus.partialJudged)
    text = partResult.isCorrect
      ? random(messages.correct)
      : random(messages.incorrect);
  else if (score === BonusScore.thirty) text = random(messages.thirty);
  else if (score === BonusScore.twenty) text = random(messages.twenty);
  else if (score === BonusScore.ten) text = random(messages.ten);
  else text = random(messages.zero);

  return <ReaderResult text={text} />;
};

export default Result;
