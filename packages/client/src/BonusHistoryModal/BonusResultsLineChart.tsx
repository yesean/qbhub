import { BonusResult } from '@qbhub/types';
import { getRange } from '@qbhub/utils';
import { useMemo } from 'react';
import QuestionResultsLineChart from '../components/QuestionHistoryModal/QuestionResultsLineChart';
import { getBonusResultsSummary } from '../utils/bonus';

type BonusResultsLineChartProps = {
  results: BonusResult[];
};

export default function BonusResultsLineChart({
  results,
}: BonusResultsLineChartProps) {
  const data = useMemo(
    () =>
      getRange(0, results.length).map((index) => ({
        index,
        score: getBonusResultsSummary(results.toReversed().slice(0, index))
          .score,
      })),
    [results],
  );

  return (
    <QuestionResultsLineChart
      data={data}
      tooltipLabelFormatter={(value) => `After ${value} bonuses`}
      xAxisLabel="Bonus"
      yAxisLabel="Score"
    />
  );
}
