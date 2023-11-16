import { Box, Divider } from '@chakra-ui/react';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import Answer from '../components/reader/Answer';
import ReaderQuestion from '../components/reader/Question';
import UserAnswer from '../components/reader/UserAnswer';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import { range } from '../utils/array';
import { getTossupWords, ReaderStatus } from '../utils/reader';
import ActiveQuestion from './ActiveQuestion';
import { nextBonus, selectBonusReader } from './bonusReaderSlice';
import Leadin from './Leadin';
import PreviousQuestion from './PreviousQuestion';

type Props = {
  setBuzz: React.Dispatch<React.SetStateAction<() => void>>;
};

const Container = ({ setBuzz }: Props) => {
  const {
    status,
    current: { number, bonus, result, part, partResult },
  } = useSelector(selectBonusReader);
  const userAnswerRef = useRef(null);
  const dispatch = useAppDispatch();
  const { settings } = useSettings();

  const showLoading = status === ReaderStatus.fetching;
  const showEmpty = status === ReaderStatus.empty;
  const emptyMessage =
    'No bonuses found. Try checking your network connection or tweaking the search parameters.';
  const onEmpty = () => dispatch(nextBonus({ settings }));

  const leadinOffset = useMemo(
    () =>
      bonus.formattedLeadin != null
        ? getTossupWords(bonus.formattedLeadin).length
        : 0,
    [bonus.formattedLeadin],
  );

  useEffect(() => {
    if (userAnswerRef.current === null) return;

    elementScrollIntoView(userAnswerRef.current, { block: 'center' });
  }, [status]);

  return (
    <ReaderQuestion
      showLoading={showLoading}
      showEmpty={showEmpty}
      emptyMessage={emptyMessage}
      onEmpty={onEmpty}
    >
      {number > 1 && (
        <Box mb={1}>
          <Leadin
            text={bonus.formattedLeadin}
            buzzIndex={result.parts[0].buzzIndex}
          />
        </Box>
      )}
      {range(1, number).map((num, i) => (
        <Fragment key={num}>
          <PreviousQuestion
            leadinOffset={leadinOffset}
            part={bonus.parts[i]}
            partResult={result.parts[i]}
          />
          <Divider borderColor="gray.300" mb={4} />
        </Fragment>
      ))}
      <Box>
        {/* use key prop to unmount ActiveQuestion to reset useReader */}
        <ActiveQuestion key={number} setBuzz={setBuzz} />
      </Box>
      {[ReaderStatus.partialJudged, ReaderStatus.judged].includes(status) && (
        <Box mt={1} py={1}>
          <Answer text={part.formattedAnswer} />
          <Box ref={userAnswerRef}>
            <UserAnswer
              text={partResult.userAnswer}
              isCorrect={partResult.isCorrect}
            />
          </Box>
        </Box>
      )}
    </ReaderQuestion>
  );
};

export default Container;
