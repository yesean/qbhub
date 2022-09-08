import { Box, Divider } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import Answer from '../components/reader/Answer';
import ReaderQuestion from '../components/reader/Question';
import { range } from '../utils/array';
import ActiveQuestion from './ActiveQuestion';
import { ReaderStatus, selectBonusReader } from './bonusReaderSlice';
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

  return (
    <ReaderQuestion
      showLoading={showLoading}
      showEmpty={showEmpty}
      emptyMessage={emptyMessage}
    >
      {range(1, number).map((num, i) => (
        <React.Fragment key={num}>
          <PreviousQuestion
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
