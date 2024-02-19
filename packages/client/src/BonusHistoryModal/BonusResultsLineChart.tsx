import { getRange } from '@qbhub/utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import QuestionResultsLineChart from '../components/QuestionHistoryModal/QuestionResultsLineChart';
import { getBonusResultsSummary } from '../utils/bonus';

export default function BonusResultsLineChart() {
  const { results } = useSelector(selectBonusReader);
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
