import { Box, Divider } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Answer from '../components/reader/Answer';
import ReaderQuestion from '../components/reader/Question';
import { range } from '../utils/array';
import { getTossupWords } from '../utils/reader';
import ActiveQuestion from './ActiveQuestion';
import { ReaderStatus, selectBonusReader } from './bonusReaderSlice';
import Leadin from './Leadin';
import PreviousQuestion from './PreviousQuestion';

const Container = () => {
  const {
    status,
    current: { number, bonus, result, part },
  } = useSelector(selectBonusReader);

  const showLoading = status === ReaderStatus.fetching;
  const showEmpty = status === ReaderStatus.empty;
  const emptyMessage =
    'No tossups found. Try checking your network connection or tweaking the search parameters.';
  const leadinOffset = useMemo(
    () =>
      bonus.formattedLeadin != null
        ? getTossupWords(bonus.formattedLeadin).length
        : 0,
    [bonus.formattedLeadin],
  );

  return (
    <ReaderQuestion
      showLoading={showLoading}
      showEmpty={showEmpty}
      emptyMessage={emptyMessage}
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
        <React.Fragment key={num}>
          <PreviousQuestion
            leadinOffset={leadinOffset}
            part={bonus.parts[i]}
            partResult={result.parts[i]}
          />
          <Divider borderColor="gray.300" mb={4} />
        </React.Fragment>
      ))}
      <Box>
        <ActiveQuestion key={number} />
      </Box>
      {[ReaderStatus.partialJudged, ReaderStatus.judged].includes(status) && (
        <Box mt={1} py={1}>
          <Answer text={part.formattedAnswer} />
        </Box>
      )}
    </ReaderQuestion>
  );
};

export default Container;
