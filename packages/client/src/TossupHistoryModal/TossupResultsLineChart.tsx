import { TossupResult } from '@qbhub/types';
import { getRange } from '@qbhub/utils';
import { useMemo } from 'react';
import QuestionResultsLineChart from '../components/QuestionHistoryModal/QuestionResultsLineChart';
import { getTossupResultsSummary } from '../utils/tossup';

type TossupResultsLineChartProps = {
  results: TossupResult[];
};

export default function TossupResultsLineChart({
  results,
}: TossupResultsLineChartProps) {
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
