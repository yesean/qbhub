import { BonusScore } from '@qbhub/types';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import ReaderResult from '../components/reader/Result';
import { random } from '../utils/array';
import { ReaderStatus } from '../utils/reader';

const messages = {
  correct: ['Correct!'],
  incorrect: ['Incorrect.'],
  prompt: ['Prompt!'],
  ten: ['Ten!'],
  thirty: [
    '🎉  All Thirty!  🥳',
    '🎉  For Thirty!  🥳',
    '🎉  All Correct!  🥳',
  ],
  twenty: ['Twenty!'],
  zero: ['Bagel.', 'Zero.'],
};

const Result: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    current: {
      partResult,
      result: { score },
    },
    status,
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
