import { getRange } from '@qbhub/utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import QuestionResultsLineChart from '../components/QuestionHistoryModal/QuestionResultsLineChart';
import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import { getTossupResultsSummary } from '../utils/tossup';

export default function TossupResultsLineChart() {
  const { results } = useSelector(selectTossupReader);
  const data = useMemo(
    () =>
      getRange(0, results.length).map((index) => ({
        index,
        score: getTossupResultsSummary(results.toReversed().slice(0, index))
          .score,
      })),
    [results],
  );

  return (
    <QuestionResultsLineChart
      data={data}
      tooltipLabelFormatter={(value) => `After ${value} tossups`}
      xAxisLabel="Tossup"
      yAxisLabel="Score"
    />
  );
}
